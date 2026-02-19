import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { StarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '~/hooks/useAuth';
import { getReviews, type Review } from '~/services/reviewService';

export const ReviewsSection = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'received' | 'given'>('received');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user');

  // Use the profile user ID or current user ID
  const targetUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || (currentUser && userId === currentUser.id?.toString());

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      if (!targetUserId) {
        setLoading(false);
        return;
      }

      try {
        // Correct signature: getReviews(asReviewer?: boolean, userId?: number)
        const asReviewer = tab === 'given';
        const response = await getReviews(asReviewer, Number(targetUserId));
        setReviews(response.items || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [targetUserId, tab]);

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
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <StarIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('reviews.noReviewsYet')}</h2>
            <p className="text-gray-600 text-center mb-1">{t('reviews.beFirstReview')}</p>
            <p className="text-gray-600 text-center mb-2">{t('reviews.shareExperience')}</p>
            {isOwnProfile && (
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover transition-colors mt-4">
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
              const displayName = reviewer
                ? `${reviewer.firstName} ${reviewer.lastName}`.trim()
                : t('common.userDefault');

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
        </div>
      )}
    </div>
  );
};
