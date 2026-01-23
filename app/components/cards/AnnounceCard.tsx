import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { addBookmark, removeBookmark, checkIfBookmarked } from '~/services/bookmarkService';
import { useAuthStore, type AuthState } from '~/store/auth';

interface PropertyCardProps {
  id: string;
  fullName: string;
  location: string;
  price: string;
  rating: string;
  image: string;
  featured?: boolean;
  weight?: string;
  departure?: string;
  airline?: string;
  isRequest?: boolean;
  avatar?: string;
  type?: 'traveler' | 'transporter';
  isBookmarked?: boolean;
  userId?: number; // ID de l'utilisateur qui a créé l'annonce
  currencySymbol?: string; // Symbole de la devise
}

export default function AnnounceCard({
  id,
  fullName,
  location,
  price,
  type,
  rating,
  image,
  featured = false,
  weight,
  departure,
  airline,
  isRequest = false,
  avatar,
  isBookmarked = false,
  userId,
  currencySymbol = '€', // Valeur par défaut Euro
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = useAuthStore((s: AuthState) => s.isLoggedIn);
  const currentUser = useAuthStore((s: AuthState) => s.user);

  // Vérifier si l'annonce appartient à l'utilisateur connecté
  const isOwnAnnounce = currentUser && userId && Number(currentUser.id) === Number(userId);

  // Use the isBookmarked prop from API response or check bookmark status
  useEffect(() => {
    if (isBookmarked !== undefined) {
      setIsFavorite(isBookmarked);
    } else {
      const checkBookmarkStatus = async () => {
        try {
          const bookmarkType = type === 'transporter' ? 'TRAVEL' : 'DEMAND';
          const bookmarkStatus = await checkIfBookmarked(bookmarkType, parseInt(id));
          setIsFavorite(bookmarkStatus);
        } catch (error) {
          console.error('Error checking bookmark status:', error);
        }
      };
      checkBookmarkStatus();
    }
  }, [id, type, isBookmarked]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation vers le lien

    // Si l'utilisateur n'est pas connecté, ouvrir la modal de connexion
    if (!isLoggedIn) {
      window.dispatchEvent(new Event('open-login-dialog'));
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const bookmarkType = type === 'transporter' ? 'TRAVEL' : 'DEMAND';
      const itemId = parseInt(id);

      if (isFavorite) {
        // Remove bookmark
        await removeBookmark(bookmarkType, itemId);
        setIsFavorite(false);
      } else {
        // Add bookmark
        const bookmarkData: any = {
          bookmarkType: bookmarkType as 'TRAVEL' | 'DEMAND',
        };

        if (bookmarkType === 'TRAVEL') {
          bookmarkData.travelId = itemId;
        } else {
          bookmarkData.demandId = itemId;
        }

        await addBookmark(bookmarkData);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const announceType = type === 'transporter' ? 'travel' : 'demand';

  return (
    <Link
      target="_blank"
      to={`/announces?id=${id}&type=${announceType}`}
      className="bg-white rounded-2xl overflow-hidden px-2 py-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
    >
      <div className="relative items-center  justify-center flex overflow-hidden rounded-2xl bg-gray-100  border border-gray-200 h-64">
        <img
          src={image}
          alt={fullName}
          className={`${
            type === 'transporter'
              ? 'max-h-full h-52 p-5 object-contain max-w-full '
              : 'object-cover min-w-100 min-h-100 '
          } m-auto  `}
        />
        {featured && (
          <div className="absolute top-4 left-4 bg-emerald-950/80 text-white px-4 py-1 rounded-full text-xs">
            Vérifié
          </div>
        )}
        {type && (
          <div
            className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
              type === 'transporter' ? 'bg-blue-500/90 text-white' : 'bg-orange-500/90 text-white'
            }`}
          >
            {type === 'transporter' ? 'Voyage' : 'Demande'}
          </div>
        )}
        {!isOwnAnnounce && (
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={`absolute top-4 right-4 backdrop-blur-sm p-2 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              isFavorite ? 'bg-red-500/90 text-white' : 'bg-white/80/70 hover'
            }`}
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${
                  isFavorite ? 'text-white' : 'text-gray-600'
                }`}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
        )}

        {airline && <></>}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <img src={avatar} alt={fullName} className="w-10 h-10 rounded-full" />
          <h3 className="font-semibold text-gray-900 ">{fullName}</h3>
        </div>
        <p className="text-gray-600 h-14 text-sm mb-2 ">
          {location.length - 3 > 80 ? `${location.slice(0, 80)} ...` : location}
        </p>
        {
          <p className="text-blue-600 text-sm font-medium mb-2">
            {type === 'transporter' ? 'Espace disponible' : 'Espace demandé'}: {weight ?? '0 kg'}
          </p>
        }
        {departure && <p className="text-gray-500 text-xs mb-2">Date : {departure}</p>}
        {/* {airline && (
          <p className="text-gray-500 text-xs mb-4">
            Compagnie: {airline}
          </p>
        )} */}

        {departure && (
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">
              {price} {currencySymbol}/kg
            </span>
            <div className="flex items-center space-x-1">
              {Number(rating) > 0 ? (
                <>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600">{rating}</span>
                </>
              ) : (
                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
