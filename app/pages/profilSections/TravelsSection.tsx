import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useAuth } from '~/hooks/useAuth';
import ActionCard from '~/components/cards/ActionCard';
import ConfirmCancelDialog from '~/components/dialogs/ConfirmCancelDialog';
import EditAnnounceDialog from '~/components/dialogs/EditAnnounceDialog';
import { getUserTravels, deleteTravel, type TravelItem } from '~/services/travelService';

export const TravelsSection = () => {
  const { t } = useTranslation();
  const [travels, setTravels] = useState<TravelItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchTravels = async () => {
    if (!targetUserId) return;

    try {
      const response = await getUserTravels(Number(targetUserId));
      setTravels(response.items || []);
    } catch (error) {
      console.error('Error fetching travels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravels();
  }, [targetUserId]);

  const handleCancelTravel = async () => {
    if (!travelToCancel) return;

    try {
      await deleteTravel(travelToCancel.id);
      // Refresh the list
      await fetchTravels();
      setTravelToCancel(null);
    } catch (error) {
      console.error('Error canceling travel:', error);
      // You could show an error modal here instead of alert
    }
  };

  const handleEditSuccess = () => {
    setEditingTravel(null);
    fetchTravels(); // Refresh the list
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
                src="/images/noTravelAnnounces.jpeg"
                alt={t('profile.messages.noTravelsFound')}
                className="w-[50%] h-[50%]"
              />
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
