import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TravelCard from '~/components/cards/TravelCard';
import { getBookmarks, type BookmarkItem } from '~/services/announceService';
import { removeBookmark } from '~/services/bookmarkService';

export function FavoritesSection() {
  const { t, i18n } = useTranslation();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await getBookmarks();
        setBookmarks(response.items || []);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatName = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1].charAt(0)}.`;
    }
    return fullName;
  };

  const handleRemoveBookmark = async (bookmarkType: 'TRAVEL' | 'DEMAND', itemId: number) => {
    try {
      // Convert to lowercase for API endpoint
      const type = bookmarkType.toLowerCase();
      await removeBookmark(type, itemId);
      // Refresh bookmarks after removal
      const response = await getBookmarks();
      setBookmarks(response.items || []);
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2x p-6">
        <div className="text-center text-gray-500">{t('profile.messages.loadingFavorites')}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl ">
      {bookmarks.length === 0 ? (
        <div className="text-center text-gray-500 py-8 flex flex-col items-center">
          <img src="/images/noFavorites.jpeg" alt="No favorites" className="w-[50%] h-[50%]" />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('profile.sections.favorites')} ({bookmarks.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {bookmarks.map((bookmark) => {
              // Determine if it's a travel or demand
              const isTravel = bookmark.bookmarkType === 'TRAVEL' && bookmark.travel;
              const isDemand = bookmark.bookmarkType === 'DEMAND' && bookmark.demand;

              if (!isTravel && !isDemand) return null;

              // Get the actual item (travel or demand)
              const item: any = isTravel ? bookmark.travel : bookmark.demand;
              if (!item) return null;

              const id =
                (isTravel ? bookmark.travelId : bookmark.demandId)?.toString() ||
                bookmark.id.toString();
              const name = item.user ? `${item.user.fullName}`.trim() : t('common.user');

              const avatar =
                item.user?.profilePictureUrl || item.images?.[0]?.fileUrl || '/favicon.ico';
              const originName = item.departureAirport?.name || '';
              const destName = item.arrivalAirport?.name || '';
              const location = `${originName} → ${destName}`;
              // Parse pricePerKg as it's returned as string from API
              const pricePerKg =
                typeof item.pricePerKg === 'string'
                  ? parseFloat(item.pricePerKg)
                  : (item.pricePerKg ?? 0);
              const rating = '4.7';

              // Pour les voyages (travel), utiliser le logo de la compagnie
              // Pour les demandes (demand), utiliser l'avatar de l'utilisateur
              const image = isTravel ? item.airline?.logoUrl || avatar : avatar;

              const featured = Boolean(item.user?.isVerified);

              // Use weightAvailable for travel type, weight for demand type
              const availableWeight = isTravel ? (item.weightAvailable ?? 0) : (item.weight ?? 0);

              // Get the date from the correct field
              const dateString = item.departureDatetime || item.deliveryDate || item.travelDate;
              const departure = dateString ? formatDate(dateString) : undefined;

              const airline = item.airline?.name;
              const type = isTravel ? 'transporter' : 'traveler';

              return (
                <>
                  <TravelCard
                    id={id}
                    fullName={name}
                    avatar={avatar}
                    location={location}
                    price={`${pricePerKg}`}
                    rating={rating}
                    image={image}
                    featured={featured}
                    weight={availableWeight ? `${availableWeight}kg` : undefined}
                    departure={departure}
                    airline={airline}
                    type={type as any}
                    onRemove={() =>
                      handleRemoveBookmark(
                        bookmark.bookmarkType,
                        isTravel ? bookmark.travelId! : bookmark.demandId!
                      )
                    }
                  />
                  {/* Remove from favorites button */}
                  {/* <button
                                                onClick={() => handleRemoveBookmark(
                                                  bookmark.bookmarkType,
                                                  isTravel ? bookmark.travelId! : bookmark.demandId!
                                                )}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover transition-colors z-10"
                                              >
                                                <svg
                                                  className="w-4 h-4"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                  />
                                                </svg>
                                              </button> */}
                </>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
