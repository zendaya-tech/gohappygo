import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useAuth } from '~/hooks/useAuth';
import { StarIcon } from '@heroicons/react/24/outline';
import { getReviews, type Review } from '~/services/reviewService';

export const ReviewsSection = () => {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<'received' | 'given'>('received');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user');
  const { user: currentUser } = useAuth();

  const isOwnProfile = !userId || (currentUser && userId === currentUser.id?.toString());

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // For both own profile and public profiles, allow switching between received and given
        const asReviewer = tab === 'given';
        const response = await getReviews(asReviewer, userId ? Number(userId) : undefined);
        setReviews(response.items || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tab, userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + parseFloat(review.rating || '0'), 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="bg-white rounded-2xl">
      {/* Tabs - Show for both own profile and public profiles */}
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={() => setTab('received')}
          className={`text-sm font-semibold cursor-pointer ${tab === 'received' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          | {isOwnProfile ? t('profile.tabs.myReceivedReviews') : t('profile.tabs.receivedReviews')}
        </button>
        <button
          onClick={() => setTab('given')}
          className={`text-sm font-semibold cursor-pointer ${tab === 'given' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          | {isOwnProfile ? t('profile.tabs.myGivenReviews') : t('profile.tabs.givenReviews')}
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">{t('profile.messages.loadingReviews')}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-gray-500 py-8 flex flex-col items-center">
          <div className={`flex items-center justify-center p-8`}>
            {/* Chat bubble icon */}
            <div className="mb-6 w-[30%]">
              <img src="/images/noAvisIcon.jpeg" alt="No reviews" className="w-full h-full" />
            </div>

            <div>
              {/* Text content */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('profile.messages.noReviewsYet')}
              </h2>
              <p className="text-gray-600 text-center mb-1">
                {t('profile.messages.beFirstReview')}
              </p>
              <p className="text-gray-600 text-center mb-2">
                {t('profile.messages.shareExperience')}
              </p>
              <p className="text-blue-600 font-semibold mb-6">GoHappyGo !</p>

              {/* Button */}
              <button className="bg-blue-600 hover text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {t('profile.messages.leaveReview')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {tab === 'received'
                ? t('profile.tabs.receivedReviews')
                : t('profile.tabs.givenReviews')}{' '}
              ({reviews.length})
            </h3>
            {tab === 'received' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(parseFloat(calculateAverageRating() || '0'))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-1">
                  {calculateAverageRating()} ({reviews.length}{' '}
                  {t('profile.sections.reviews', { count: reviews.length }).toLowerCase()})
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {reviews.map((review) => {
              // For received reviews, show the reviewer (who gave the review)
              // For given reviews, show the reviewee (who received the review)
              const displayUser = tab === 'given' ? review.reviewee : review.reviewer;
              const displayName = displayUser
                ? `${displayUser.firstName} ${displayUser.lastName.charAt(0)}.`
                : t('common.user');
              const displayAvatar = displayUser?.profilePictureUrl || '/favicon.ico';
              const rating = parseFloat(review.rating || '0');

              return (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={displayAvatar}
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {tab === 'received'
                              ? t('profile.messages.reviewFrom', { name: displayName })
                              : t('profile.messages.reviewFor', { name: displayName })}
                          </h4>
                          {review.request?.travel && (
                            <p className="text-xs text-gray-500">
                              {t('announcements.filters.flight')}{' '}
                              {review.request.travel.flightNumber}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Rating stars */}
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Comment */}
                      {review.comment && (
                        <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
                      )}
                    </div>
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
