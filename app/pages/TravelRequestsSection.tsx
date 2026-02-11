import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import EditPackageDialog from '~/components/dialogs/EditPackageDialog';
import ConfirmCancelDialog from '~/components/dialogs/ConfirmCancelDialog';
import { useAuth } from '~/hooks/useAuth';
import { getUserDemands, deleteDemand, type DemandItem } from '~/services/demandService';
import ActionCard from '~/components/cards/ActionCard';

export function TravelRequestsSection() {
  const { t, i18n } = useTranslation();
  const [demands, setDemands] = useState<DemandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDemand, setEditingDemand] = useState<DemandItem | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [demandToCancel, setDemandToCancel] = useState<DemandItem | null>(null);
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user');

  // Use the profile user ID or current user ID
  const targetUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || (currentUser && userId === currentUser.id?.toString());

  const fetchDemands = async () => {
    if (!targetUserId) return;

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
    } catch (error) {
      console.error('Error canceling demand:', error);
    }
  };

  const handleEditSuccess = () => {
    setEditingDemand(null);
    fetchDemands(); // Refresh the list
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
                src="/images/noTravelDemandes.jpeg"
                alt="No demands"
                className="w-[50%] h-[50%]"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {demands.map((demand) => (
              <ActionCard
                key={demand.id}
                id={demand.id.toString()}
                image={
                  demand.images?.[0]?.fileUrl || demand.user?.profilePictureUrl || '/favicon.ico'
                }
                title={`${demand.departureAirport?.name || 'N/A'} → ${demand.arrivalAirport?.name || 'N/A'}`}
                subtitle={t('announcements.card.requestedSpace')}
                dateLabel={
                  demand.travelDate
                    ? formatDate(demand.travelDate)
                    : demand.deliveryDate
                      ? formatDate(demand.deliveryDate)
                      : '—'
                }
                flightNumber={demand.flightNumber}
                weight={demand.weight || 0}
                price={demand.pricePerKg}
                type="traveler"
                priceSubtext={`${demand.currency?.symbol || '€'}/Kg`}
                // Buttons for Demands
                primaryAction={
                  isOwnProfile
                    ? {
                        label: t('common.edit'),
                        onClick: () => setEditingDemand(demand),
                      }
                    : undefined
                }
                secondaryAction={
                  isOwnProfile
                    ? {
                        label: t('common.cancel'),
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

      {/* Edit Package Dialog - Only show for own profile */}
      {isOwnProfile && editingDemand && (
        <EditPackageDialog
          open={!!editingDemand}
          onClose={() => setEditingDemand(null)}
          demand={editingDemand as any} // Type conversion for compatibility
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Cancel Confirmation Dialog - Only show for own profile */}
      {isOwnProfile && (
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
      )}
    </>
  );
}
