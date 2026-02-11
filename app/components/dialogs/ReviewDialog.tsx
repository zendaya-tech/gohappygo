import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { createReview } from '~/services/reviewService';

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  requestId: number;
  requesterName: string;
  onSuccess?: () => void;
}

export default function ReviewDialog({
  open,
  onClose,
  requestId,
  requesterName,
  onSuccess,
}: ReviewDialogProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError(t('reviews.dialog.selectRatingError'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createReview({
        requestId,
        rating,
        comment,
      });

      // Reset form
      setRating(0);
      setComment('');
      onClose();
      onSuccess?.();
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err?.message || t('reviews.dialog.submitError'));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('reviews.dialog.title')}</h2>
          <p className="text-gray-600 text-sm">
            {t('reviews.dialog.subtitle', { name: requesterName })}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Rating Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3 text-center">
            {t('reviews.dialog.rating')}
          </label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
              >
                {star <= rating ? (
                  <StarIconSolid className="h-10 w-10 text-yellow-400" />
                ) : (
                  <StarIcon className="h-10 w-10 text-gray-300 hover" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('reviews.dialog.comment')}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('reviews.dialog.commentPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus resize-none"
            rows={4}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover transition-colors disabled:opacity-50 cursor-pointer"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover transition-colors disabled:opacity-50 shadow-lg cursor-pointer"
          >
            {loading ? t('reviews.dialog.submitting') : t('reviews.dialog.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
