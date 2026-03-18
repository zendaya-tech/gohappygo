import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useAuth } from '~/hooks/useAuth';
import ActionCard from '~/components/cards/ActionCard';
import ConfirmCancelDialog from '~/components/dialogs/ConfirmCancelDialog';
import ReviewDialog from '~/components/dialogs/ReviewDialog';
import MessageDialog from '~/components/dialogs/MessageDialog';
import {
  getRequests,
  acceptRequest,
  completeRequest,
  cancelRequest,
  confirmCancellation,
  disputeCancellation,
  type RequestResponse,
} from '~/services/requestService';

export const ReservationsSection = ({
  onNavigateToMessages,
}: {
  onNavigateToMessages?: (requestId: number) => void;
}) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'pending' | 'accepted' | 'completed' | 'cancelled'>('pending');
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<RequestResponse | null>(null);
  const [selectedRequester, setSelectedRequester] = useState<{
    name: string;
    avatar: string;
    requestId: number;
  } | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [requestToReview, setRequestToReview] = useState<RequestResponse | null>(null);
  const [searchParams] = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const userId = searchParams.get('user');
  const { user: currentUser } = useAuth();

  const [isOwnProfile] = useState(
    !userId || (currentUser && userId === currentUser.id?.toString())
  );

  const fetchRequestsPage = useCallback(async (nextPage = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getRequests(nextPage, 12);
      const incoming = response.items || [];

      setRequests((prev) => (reset ? incoming : [...prev, ...incoming]));
      setPage(nextPage);
      setHasMore(response.meta?.hasNextPage || false);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchRequestsPage(1, true);
  }, [fetchRequestsPage]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchRequestsPage(page + 1);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, fetchRequestsPage]);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await acceptRequest(requestId);
      await fetchRequestsPage(1, true);
    } catch (error) {
      console.error('Error accepting request:', error);
      setErrorMessage(t('profile.messages.errorAccept'));
    }
  };

  const handleCompleteRequest = async (requestId: number) => {
    try {
      await completeRequest(requestId);
      await fetchRequestsPage(1, true);
    } catch (error) {
      console.error('Error completing request:', error);
      setErrorMessage(t('profile.messages.errorComplete'));
    }
  };

  const handleCancelRequest = async () => {
    if (!requestToCancel) return;

    try {
      await cancelRequest(requestToCancel.id);
      await fetchRequestsPage(1, true);
      setRequestToCancel(null);
      setCancelConfirmOpen(false);
    } catch (error) {
      console.error('Error canceling request:', error);
      setErrorMessage(t('profile.messages.errorCancel'));
    }
  };

  const handleConfirmCancellation = async (requestId: number) => {
    try {
      await confirmCancellation(requestId);
      await fetchRequestsPage(1, true);
    } catch (error) {
      console.error('Error confirming cancellation:', error);
      setErrorMessage(t('profile.messages.errorConfirmCancel'));
    }
  };

  const handleDisputeCancellation = async (requestId: number) => {
    try {
      await disputeCancellation(requestId);
      await fetchRequestsPage(1, true);
    } catch (error) {
      console.error('Error disputing cancellation:', error);
      setErrorMessage(t('profile.messages.errorDisputeCancel'));
    }
  };

  const handleContactRequester = (
    requesterName: string,
    requesterAvatar: string,
    requestId: number
  ) => {
    // Redirect to messages section and auto-select the conversation
    if (onNavigateToMessages) {
      onNavigateToMessages(requestId);
    }
  };

  const handleSendMessage = async (message: string) => {
    console.log('Message sent:', message, 'to:', selectedRequester?.name);
    // Message is already sent by MessageDialog component via API
    // Optionally refresh unread count or request list here if needed
  };

  const handleOpenReview = (request: RequestResponse) => {
    setRequestToReview(request);
    setReviewDialogOpen(true);
  };

  // Fonction pour obtenir le nom de la personne à évaluer (vis-à-vis)
  const getRevieweeName = (request: RequestResponse): string => {
    const requester = request.requester;
    const travelOwner = request.travel?.owner;

    // Si l'utilisateur connecté est le requester, évaluer le propriétaire
    const isCurrentUserRequester = requester?.id.toString() === currentUser?.id;
    const reviewee = isCurrentUserRequester ? travelOwner : requester;

    return reviewee
      ? `${reviewee.firstName} ${reviewee.lastName.charAt(0)}.`
      : t('common.userDefault');
  };

  const handleReviewSuccess = () => {
    // Refresh requests
    fetchRequestsPage(1, true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t('languages.fr') === 'French' ? 'en-US' : 'fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDisplayName = (fullName?: string) => {
    if (!fullName?.trim()) return t('common.userDefault');

    return fullName
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  };

  const filtered = requests.filter((r) => {
    const status = r.currentStatus?.status?.toUpperCase();
    if (tab === 'pending') return status === 'NEGOTIATING';
    if (tab === 'accepted')
      return status === 'ACCEPTED' || status === 'PENDING_CANCELLATION_CONFIRMATION';
    if (tab === 'completed') return status === 'COMPLETED' || status === 'CANCELLATION_DISPUTED';
    if (tab === 'cancelled') return status === 'CANCELLED';
    return false;
  });

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">
        {t('profile.messages.loadingReservations')}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={() => setTab('pending')}
          className={`text-sm font-semibold cursor-pointer ${
            tab === 'pending' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          | {t('profile.tabs.reservationsToConfirm')}
        </button>
        <button
          onClick={() => setTab('accepted')}
          className={`text-sm font-semibold cursor-pointer ${
            tab === 'accepted' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          | {t('profile.tabs.reservationsPendingDelivery')}
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`text-sm font-semibold cursor-pointer ${
            tab === 'completed' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          | {t('profile.tabs.reservationsCompleted')}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-8 flex flex-col items-center">
          <img
            src="/images/noReservations.png"
            alt={t('profile.messages.noReservations')}
            className="w-[15%] h-[15%]"
          />
          <span className="font-bold text-lg my-6">
            {t('profile.messages.noReservationsSubImageText')}
          </span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {filtered.map((request) => {
            const travel = request.travel;
            const requester = request.requester;
            const travelOwner = travel?.owner; // Utiliser travel.owner au lieu de travel.user

            // Déterminer qui afficher : si l'utilisateur connecté est le requester, afficher le propriétaire du voyage, sinon afficher le requester
            const isCurrentUserRequester = requester?.id.toString() === currentUser?.id;
            const displayUser = isCurrentUserRequester ? travelOwner : requester;

            // Data Preparation
            const departureCity = travel?.departureAirport?.name || '';
            const arrivalCity = travel?.arrivalAirport?.name || '';
            const travelDate = travel?.departureDatetime
              ? formatDate(travel.departureDatetime)
              : '';
            const flightNumber = travel?.flightNumber || 'N/A';
            const weight = request.weight || 0;

            const pricePerKg =
              typeof travel?.pricePerKg === 'string'
                ? parseFloat(travel.pricePerKg)
                : travel?.pricePerKg || 0;

            const price = Number((pricePerKg * weight).toFixed(0));

            // Get currency symbol from request
            const currencySymbol = request.currency?.symbol || travel?.currency?.symbol || '€';

            const displayUserName = formatDisplayName(displayUser?.fullName);

            const displayUserAvatar = (displayUser as any)?.profilePictureUrl || '/favicon.ico';

              return (
                <ActionCard
                key={request.id}
                id={request.id}
                user={{
                  name: displayUserName,
                  avatar: displayUserAvatar,
                }}
                image={request.travel?.airline?.logoUrl}
                title={`${departureCity} → ${arrivalCity}`}
                subtitle={t('profile.messages.reservedSpace')}
                dateLabel={travelDate}
                flightNumber={flightNumber}
                weight={weight}
                price={price}
                priceSubtext={currencySymbol}
                priceAboveActions
                type="transporter" // For the proper airline logo styling
                roleBadgeLabel={
                  isCurrentUserRequester ? t('cards.action.buyer') : t('cards.action.seller')
                }
                roleBadgeTone={isCurrentUserRequester ? 'orange' : 'blue'}
                unreadCount={request.unReadMessages || 0}
                // Logic for Status Badges vs Buttons
                statusBadge={
                  request.currentStatus?.status === 'COMPLETED'
                    ? t('common.completed')
                    : request.currentStatus?.status === 'CANCELLATION_DISPUTED'
                      ? t('profile.messages.cancellationDisputed')
                    : request.currentStatus?.status === 'CANCELLED'
                      ? t('common.cancel')
                      : undefined
                }
                statusBadgeTone={
                  request.currentStatus?.status === 'CANCELLATION_DISPUTED' ? 'red' : 'green'
                }
                cardTone={
                  request.currentStatus?.status === 'CANCELLATION_DISPUTED' ? 'danger' : 'default'
                }
                primaryAction={
                  request.currentStatus?.status === 'NEGOTIATING' &&
                  requester?.id.toString() != currentUser?.id
                    ? {
                        label: t('profile.actions.confirmReservation'),
                        onClick: () => handleAcceptRequest(request.id),
                      }
                    : request.currentStatus?.status === 'ACCEPTED' &&
                        requester?.id.toString() === currentUser?.id
                      ? (() => {
                          // Check by calendar day only (ignore hour)
                          const travelDate = travel?.departureDatetime
                            ? new Date(travel.departureDatetime)
                            : null;
                          const today = new Date();
                          const todayStart = new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            today.getDate()
                          );
                          const travelDay = travelDate
                            ? new Date(
                                travelDate.getFullYear(),
                                travelDate.getMonth(),
                                travelDate.getDate()
                              )
                            : null;
                          const canComplete = travelDay ? todayStart >= travelDay : false;

                          return {
                            label: t('profile.actions.confirmReception'),
                            onClick: canComplete
                              ? () => handleCompleteRequest(request.id)
                              : () => setErrorMessage(t('profile.messages.impossibleFinish')),
                            color: 'green' as const,
                          };
                        })()
                      : request.currentStatus?.status === 'PENDING_CANCELLATION_CONFIRMATION'
                        ? requester?.id.toString() === currentUser?.id
                          ? {
                              label: t('profile.actions.confirmReception'),
                              onClick: () => {},
                              color: 'green' as const,
                              disabled: true,
                            }
                          : {
                              label: t('profile.actions.approve'),
                              onClick: () => handleConfirmCancellation(request.id),
                              color: 'green' as const,
                            }
                        : undefined
                }
                secondaryAction={
                  request.currentStatus?.status === 'NEGOTIATING' &&
                  requester?.id.toString() != currentUser?.id
                    ? {
                        label: t('profile.actions.decline'),
                        onClick: () => {
                          setRequestToCancel(request);
                          setCancelConfirmOpen(true);
                        },
                        color: 'red',
                      }
                    : request.currentStatus?.status === 'NEGOTIATING' &&
                        requester?.id.toString() === currentUser?.id
                      ? {
                          label: t('profile.actions.cancel'),
                          onClick: () => {
                            setRequestToCancel(request);
                            setCancelConfirmOpen(true);
                          },
                          color: 'red',
                        }
                      : request.currentStatus?.status === 'ACCEPTED' &&
                          requester?.id.toString() === currentUser?.id
                        ? {
                            label: t('profile.actions.cancel'),
                            onClick: () => {
                              setRequestToCancel(request);
                              setCancelConfirmOpen(true);
                            },
                            color: 'red',
                          }
                        : request.currentStatus?.status === 'PENDING_CANCELLATION_CONFIRMATION'
                          ? requester?.id.toString() === currentUser?.id
                            ? {
                                label: t('profile.actions.cancel'),
                                onClick: () => {},
                                color: 'outline',
                                disabled: true,
                              }
                            : {
                                label: t('profile.actions.dispute'),
                                onClick: () => handleDisputeCancellation(request.id),
                                color: 'red',
                              }
                          : undefined
                }
                tertiaryAction={
                  request.currentStatus?.status === 'COMPLETED' && request.canReview
                    ? {
                        label: t('profile.actions.rate'),
                        onClick: () => handleOpenReview(request),
                        color: 'orange',
                      }
                    : request.currentStatus?.status === 'COMPLETED' && !request.canReview
                      ? {
                          label: t('profile.actions.rated'),
                          onClick: () => {},
                          color: 'gray',
                          disabled: true,
                        }
                      : undefined
                }
                messageAction={
                  // Show message button for all statuses except CANCELLED
                  request.currentStatus?.status !== 'CANCELLED'
                    ? {
                        label: t('profile.actions.message'),
                        onClick: () =>
                          handleContactRequester(displayUserName, displayUserAvatar, request.id),
                      }
                    : undefined
                }
                />
              );
            })}
          </div>

          {loadingMore && (
            <div className="text-center text-sm text-gray-500 mt-4">{t('common.loading')}</div>
          )}
          <div ref={loadMoreRef} className="h-2" />
        </>
      )}

      {/* Error Modal */}
      {errorMessage && (
        <ConfirmCancelDialog
          open={!!errorMessage}
          onClose={() => setErrorMessage(null)}
          onConfirm={() => setErrorMessage(null)}
          title={t('common.error')}
          message={errorMessage}
          confirmText={t('common.ok')}
          cancelText=""
          type="danger"
        />
      )}

      {/* Message Dialog */}
      {selectedRequester && (
        <MessageDialog
          open={messageDialogOpen}
          onClose={() => {
            setMessageDialogOpen(false);
            setSelectedRequester(null);
          }}
          title={t('profile.actions.contact', { name: selectedRequester.name })}
          hostName={selectedRequester.name}
          hostAvatar={selectedRequester.avatar}
          requestId={selectedRequester.requestId}
          onSend={handleSendMessage}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmCancelDialog
        open={cancelConfirmOpen}
        onClose={() => {
          setCancelConfirmOpen(false);
          setRequestToCancel(null);
        }}
        onConfirm={handleCancelRequest}
        title={t('profile.messages.cancelReservationTitle')}
        message={t('profile.messages.cancelReservationBody')}
        confirmText={t('profile.messages.confirmCancel')}
        cancelText={t('profile.messages.keep')}
        type="danger"
      />

      {/* Review Dialog */}
      {requestToReview && (
        <ReviewDialog
          open={reviewDialogOpen}
          onClose={() => {
            setReviewDialogOpen(false);
            setRequestToReview(null);
          }}
          requestId={requestToReview.id}
          requesterName={getRevieweeName(requestToReview)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};
