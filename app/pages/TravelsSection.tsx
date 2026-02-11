import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import EditAnnounceDialog from '~/components/dialogs/EditAnnounceDialog';
import ConfirmCancelDialog from '~/components/dialogs/ConfirmCancelDialog';
import { useAuth } from '~/hooks/useAuth';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { getUserTravels, deleteTravel, type TravelItem } from '~/services/travelService';
import ActionCard from '~/components/cards/ActionCard';

export function TravelsSection() {
  const { t, i18n } = useTranslation();
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
    return date.toLocaleDateString(i18n.language, {
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
      <div className="flex items-center gap-6 mb-6">
        <button onClick={() => {}} className={`text-sm font-semibold cursor-pointer text-blue-600`}>
          | {t('profile.tabs.myAds')}
        </button>
      </div>

      <div className="bg-white rounded-2xl">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">| {t('profile.tabs.myTravels')}</h3>
        </div>

        {travels.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <PaperAirplaneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {isOwnProfile
                  ? t('profile.messages.noTravels')
                  : t('profile.messages.noPublicTravels')}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {isOwnProfile
                  ? t('profile.messages.publishTravelPrompt')
                  : t('profile.messages.noPublicTravelsDesc')}
              </p>
              <div className="text-center text-gray-500 py-8 flex flex-col items-center">
                <img
                  src="/images/noTravelAnnounces.jpeg"
                  alt="No travel announces"
                  className="w-[50%] h-[50%]"
                />
              </div>
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
                subtitle={t('announcements.card.availableSpace')}
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
                        name: travel.user?.fullName || t('common.user'),
                        avatar: travel.user?.profilePictureUrl || '/favicon.ico',
                      }
                    : undefined
                }
                // Actions for your own travels
                primaryAction={
                  isOwnProfile && travel.isEditable
                    ? {
                        label: t('common.edit'),
                        onClick: () => setEditingTravel(travel),
                        color: 'blue',
                      }
                    : undefined
                }
                secondaryAction={
                  isOwnProfile
                    ? {
                        label: t('common.cancel'),
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
}
