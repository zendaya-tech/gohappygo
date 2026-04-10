import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useAuth } from '~/hooks/useAuth';
import ActionCard from '~/components/cards/ActionCard';
import ConfirmCancelDialog from '~/components/dialogs/ConfirmCancelDialog';
import EditAnnounceDialog from '~/components/dialogs/EditAnnounceDialog';
import { getUserTravels, deleteTravel, type TravelItem } from '~/services/travelService';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';

export const TravelsSection = () => {
  const { t } = useTranslation();
  const [travels, setTravels] = useState<TravelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [editingTravel, setEditingTravel] = useState<TravelItem | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [travelToCancel, setTravelToCancel] = useState<TravelItem | null>(null);
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user');
  const type = 'transporter'; // Puisqu'on récupère que les voyages

  // Use the profile user ID or current user ID
  const targetUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || (currentUser && userId === currentUser.id?.toString());

  const fetchTravels = useCallback(async (nextPage = 1, reset = false) => {
    if (!targetUserId) return;

    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getUserTravels(Number(targetUserId), nextPage, 12);
      const incoming = response.items || [];
      const hasNextFromMeta = response.meta?.hasNextPage;
      const currentPage = response.meta?.currentPage ?? response.page ?? nextPage;
      const totalPages = response.meta?.totalPages ?? response.totalPages ?? 0;
      const fallbackHasMore = incoming.length >= 10;

      setTravels((prev) => (reset ? incoming : [...prev, ...incoming]));
      setPage(nextPage);
      setHasMore(hasNextFromMeta ?? (totalPages > 0 ? currentPage < totalPages : fallbackHasMore));
    } catch (error) {
      console.error('Error fetching travels:', error);
    } finally {
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [targetUserId]);

  useEffect(() => {
    setTravels([]);
    setPage(1);
    setHasMore(false);
    fetchTravels(1, true);
  }, [fetchTravels]);

  const loadMoreTravels = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return;
    await fetchTravels(page + 1);
  }, [hasMore, loadingMore, loading, fetchTravels, page]);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMoreTravels,
    hasMore: hasMore && !loading,
    loading: loadingMore,
    threshold: 220,
  });

  const handleCancelTravel = async () => {
    if (!travelToCancel) return;

    try {
      await deleteTravel(travelToCancel.id);
      // Refresh the list
      await fetchTravels(1, true);
      setTravelToCancel(null);
    } catch (error) {
      console.error('Error canceling travel:', error);
      // You could show an error modal here instead of alert
    }
  };

  const handleEditSuccess = () => {
    setEditingTravel(null);
    fetchTravels(1, true); // Refresh the list
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t('languages.fr') === 'French' ? 'en-US' : 'fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl">
        <div className="text-center text-gray-500">{t('profile.messages.loadingTravels')}</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl">
        {travels.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500 py-8 flex flex-col items-center">
              <img
                src="/images/noTravelDemandes.png"
                alt={t('profile.messages.noTravelsFound')}
                className="w-40 h-40 object-contain"
              />
              <span className="font-bold text-lg my-6">
                {t('profile.messages.noTravelsFoundSubImageText')}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {travels.map((travel) => (
              <ActionCard
                key={travel.id}
                id={travel.id}
                // Image Priority: Travel Upload -> Airline Logo -> User Avatar -> Default
                image={travel.airline?.logoUrl || '/favicon.ico'}
                title={`${travel?.departureAirport?.name || 'N/A'} → ${travel?.arrivalAirport?.name || 'N/A'}`}
                subtitle={t('profile.messages.reservedSpace')}
                type={type}
                weight={travel.weightAvailable || 0}
                dateLabel={travel.departureDatetime ? formatDate(travel.departureDatetime) : ''}
                flightNumber={travel.flightNumber || 'N/A'}
                price={travel.pricePerKg}
                priceSubtext={`${travel.currency?.symbol || '€'}/Kg`}
                // Optional: Include user info if viewing someone else's profile
                user={
                  !isOwnProfile
                    ? {
                        name: travel.user?.fullName || t('common.userDefault'),
                        avatar: travel.user?.profilePictureUrl || '/favicon.ico',
                      }
                    : undefined
                }
                // Actions for your own travels
                primaryAction={
                  isOwnProfile && travel.isEditable
                    ? {
                        label: t('profile.actions.edit'),
                        onClick: () => setEditingTravel(travel),
                        color: 'blue',
                      }
                    : undefined
                }
                secondaryAction={
                  isOwnProfile
                    ? {
                        label: t('profile.actions.cancel'),
                        onClick: () => {
                          setTravelToCancel(travel);
                          setCancelConfirmOpen(true);
                        },
                        color: 'red',
                      }
                    : undefined
                }
              />
            ))}
          </div>
        )}

        {!loading && travels.length > 0 && (
          <>
            {loadingMore && (
              <div className="text-center text-sm text-gray-500 mt-4">{t('common.loading')}</div>
            )}
            <div ref={sentinelRef} className="h-2" />
          </>
        )}
      </div>

      {/* Edit Announce Dialog - Only show for own profile and editable travels */}
      {isOwnProfile && editingTravel && editingTravel.isEditable && (
        <EditAnnounceDialog
          open={!!editingTravel}
          onClose={() => setEditingTravel(null)}
          travel={editingTravel}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Cancel Confirmation Dialog - Only show for own profile */}
      {isOwnProfile && (
        <ConfirmCancelDialog
          open={cancelConfirmOpen}
          onClose={() => {
            setCancelConfirmOpen(false);
            setTravelToCancel(null);
          }}
          onConfirm={handleCancelTravel}
          title={t('profile.messages.cancelTravelTitle')}
          message={t('profile.messages.cancelTravelBody')}
          confirmText={t('profile.messages.confirmCancel')}
          cancelText={t('profile.messages.keep')}
          type="danger"
        />
      )}
    </>
  );
};
