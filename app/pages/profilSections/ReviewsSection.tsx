import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { StarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '~/hooks/useAuth';
import { getReviews, type Review } from '~/services/reviewService';

//trying to implement the "leave a review" button
// import { getRequests, type RequestResponse } from '~/services/requestService';
// import ReviewDialog from '~/components/dialogs/ReviewDialog';

export const ReviewsSection = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'received' | 'given'>('received');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const userId = searchParams.get('user');

  //trying to implement the "leave a review" button
  // const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  // const [requestToReview, setRequestToReview] = useState<RequestResponse | null>(null);
  // const [requests, setRequests] = useState<RequestResponse[]>([]);

  // Use the profile user ID or current user ID
  const targetUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || (currentUser && userId === currentUser.id?.toString());

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setReviews([]);
      setPage(1);
      setHasMore(false);

      if (!targetUserId) {
        setLoading(false);
        return;
      }

      try {
        const asReviewer = tab === 'given';
        const response = await getReviews(asReviewer, Number(targetUserId), 1, 10);
        setReviews(response.items || []);
        setHasMore(response.meta?.hasNextPage || false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [targetUserId, tab]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading || loadingMore || !targetUserId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        const fetchMore = async () => {
          try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const asReviewer = tab === 'given';
            const response = await getReviews(asReviewer, Number(targetUserId), nextPage, 10);
            setReviews((prev) => [...prev, ...(response.items || [])]);
            setPage(nextPage);
            setHasMore(response.meta?.hasNextPage || false);
          } catch (error) {
            console.error('Error fetching more reviews:', error);
          } finally {
            setLoadingMore(false);
          }
        };

        fetchMore();
      },
      { rootMargin: '200px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, tab, targetUserId]);

  //trying to implement the "leave a review" button
  // const handleOpenReview = (request: RequestResponse) => {
  //   setRequestToReview(request);
  //   setReviewDialogOpen(true);
  // };

  // // Fonction pour obtenir le nom de la personne à évaluer (vis-à-vis)
  // const getRevieweeName = (request: RequestResponse): string => {
  //   const requester = request.requester;
  //   const travelOwner = request.travel?.owner;

  //   // Si l'utilisateur connecté est le requester, évaluer le propriétaire
  //   const isCurrentUserRequester = requester?.id.toString() === currentUser?.id;
  //   const reviewee = isCurrentUserRequester ? travelOwner : requester;

  //   return reviewee
  //     ? `${reviewee.firstName} ${reviewee.lastName.charAt(0)}.`
  //     : t('common.userDefault');
  // };

  // const handleReviewSuccess = () => {
  //   // Refresh requests
  //   const fetchRequests = async () => {
  //     try {
  //       const response = await getRequests();
  //       setRequests(response.items || []);
  //     } catch (error) {
  //       console.error('Error fetching requests:', error);
  //     }
  //   };
  //   fetchRequests();
  // };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return '0.0';
    const sum = reviews.reduce((acc, review) => acc + parseFloat(review.rating || '0'), 0);
    return (sum / reviews.length).toFixed(1);
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
        <div className="text-center text-gray-500 py-8">{t('reviews.loadingReviews')}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl">
      {/* Tabs */}
      <div className="flex items-center gap-6 mb-8">
        <button
          onClick={() => setTab('received')}
          className={`text-sm font-semibold cursor-pointer ${
            tab === 'received' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          | {isOwnProfile ? t('reviews.myReceivedReviews') : t('reviews.receivedReviews')}
        </button>
        <button
          onClick={() => setTab('given')}
          className={`text-sm font-semibold cursor-pointer ${
            tab === 'given' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          | {isOwnProfile ? t('reviews.myGivenReviews') : t('reviews.givenReviews')}
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="flex justify-center mb-4 items-center">
              <img
                src="/images/noAvisIcon.png"
                alt={t('reviews.noReviewsYet')}
                className="w-[20%] h-[20%]"
              />
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {t('reviews.noReviewsYet')}
                </h2>
                <p className="text-gray-600 text-center mb-1">{t('reviews.beFirstReview')}</p>
                <p className="text-gray-600 text-center mb-2">{t('reviews.shareExperience')}</p>
              </div>
            </div>
            {isOwnProfile && (
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover transition-colors mt-4 cursor-pointer"
                onClick={() => {}}
              >
                {t('reviews.leaveReview')}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary */}
          <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-1">
              <span className="text-3xl font-bold text-gray-900">{calculateAverageRating()}</span>
              <StarIcon className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-gray-600">
              {reviews.length} {t('reviews.reviewsWithCount', { count: reviews.length })}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => {
              const reviewer = tab === 'received' ? review.reviewer : review.reviewee;
              const displayName = reviewer?.fullName?.trim() || t('common.userDefault');

              return (
                <div
                  key={review.id}
                  className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={reviewer?.profilePictureUrl || '/favicon.ico'}
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{displayName}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${
                                  i < parseFloat(review.rating || '0')
                                    ? 'text-yellow-400'
                                    : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-3">
                    {review.comment || t('reviews.noCommentProvided')}
                  </p>

                  <div className="text-sm font-medium text-gray-400">
                    {tab === 'received'
                      ? t('reviews.reviewFrom', { name: displayName })
                      : t('reviews.reviewFor', { name: displayName })}
                    {review.request?.travel && (
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {t('reviews.flight')} {review.request.travel.flightNumber}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {loadingMore && <div className="text-center text-sm text-gray-500">{t('common.loading')}</div>}
          <div ref={loadMoreRef} className="h-2" />
        </div>
      )}

      {/* Review Dialog
      trying to implement the "leave a review" button
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
      )} */}
    </div>
  );
};
