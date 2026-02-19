import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useAuth } from '~/hooks/useAuth';
import ActionCard from '~/components/cards/ActionCard';
import ConfirmCancelDialog from '~/components/dialogs/ConfirmCancelDialog';
import { getUserDemands, type DemandItem } from '~/services/demandService';
import { deleteDemand } from '~/services/announceService';

export const TravelRequestsSection = () => {
  const { t } = useTranslation();
  const [demands, setDemands] = useState<DemandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [demandToCancel, setDemandToCancel] = useState<DemandItem | null>(null);
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user');

  // Use the profile user ID or current user ID
  const targetUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || (currentUser && userId === currentUser.id?.toString());

  const fetchDemands = async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    try {
      const response = await getUserDemands(Number(targetUserId));
      setDemands(response.items || []);
    } catch (error) {
      console.error('Error fetching demands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, [targetUserId]);

  const handleCancelDemand = async () => {
    if (!demandToCancel) return;

    try {
      await deleteDemand(demandToCancel.id);
      // Refresh the list
      await fetchDemands();
      setDemandToCancel(null);
      setCancelConfirmOpen(true);
    } catch (error) {
      console.error('Error canceling demand:', error);
    }
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
        <div className="text-center text-gray-500">{t('profile.messages.loadingDemands')}</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl">
        {demands.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500 py-8 flex flex-col items-center">
              <img
                src="/images/noTravelDemands.jpeg"
                alt={t('profile.messages.noDemandsFound')}
                className="w-[50%] h-[50%]"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {demands.map((demand) => (
              <ActionCard
                key={demand.id}
                id={demand.id}
                // Use user avatar if viewing someone else's profile, else default demand image
                image={
                  !isOwnProfile
                    ? demand.user?.profilePictureUrl || '/favicon.ico'
                    : '/images/demand-placeholder.png'
                }
                title={`${demand.departureAirport?.name || 'N/A'} → ${demand.arrivalAirport?.name || 'N/A'}`}
                subtitle={t('profile.messages.requiredWeight')}
                type="traveler"
                weight={demand.weight || 0}
                dateLabel={demand.deliveryDate ? formatDate(demand.deliveryDate) : ''}
                price={demand.pricePerKg}
                priceSubtext={`${demand.currency?.symbol || '€'}/Kg`}
                flightNumber={demand.flightNumber || 'N/A'}
                // Optional: Include user info if viewing someone else's profile
                user={
                  !isOwnProfile
                    ? {
                        name: demand.user?.fullName || t('common.userDefault'),
                        avatar: demand.user?.profilePictureUrl || '/favicon.ico',
                      }
                    : undefined
                }
                // Actions for your own demands
                primaryAction={
                  isOwnProfile
                    ? {
                        label: t('profile.actions.edit'),
                        onClick: () => {
                          /* handle edit */
                        },
                        color: 'blue',
                      }
                    : undefined
                }
                secondaryAction={
                  isOwnProfile
                    ? {
                        label: t('profile.actions.cancel'),
                        onClick: () => {
                          setDemandToCancel(demand);
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

      {/* Cancel Confirmation Dialog */}
      <ConfirmCancelDialog
        open={cancelConfirmOpen}
        onClose={() => {
          setCancelConfirmOpen(false);
          setDemandToCancel(null);
        }}
        onConfirm={handleCancelDemand}
        title={t('profile.messages.cancelDemandTitle')}
        message={t('profile.messages.cancelDemandBody')}
        confirmText={t('profile.messages.confirmCancel')}
        cancelText={t('profile.messages.keep')}
        type="danger"
      />
    </>
  );
};
