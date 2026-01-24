import { Link } from 'react-router';

interface FavoriteCardProps {
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
  avatar?: string;
  type?: 'traveler' | 'transporter';
  onRemove: () => void;
}

export default function TravelCard({
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
  avatar,
  onRemove,
}: FavoriteCardProps) {
  const announceType = type === 'transporter' ? 'travel' : 'demand';

  return (
    <Link
      to={`/announces?id=${id}&type=${announceType}`}
      target="_blank"
      className="bg-white rounded-2xl overflow-hidden px-2 py-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
    >
      <div className="relative items-center justify-center flex overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 h-64">
        <img
          src={image}
          alt={fullName}
          className={`${
            type === 'transporter'
              ? 'max-h-full h-52 p-5 object-contain max-w-full'
              : 'object-cover min-w-100 min-h-100'
          } m-auto`}
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

        {/* Remove button with X icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-4 right-4 backdrop-blur-sm p-2 rounded-full transition-all duration-200 hover:scale-110 bg-red-500/90 hover text-white cursor-pointer"
          title="Retirer des favoris"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {airline && <></>}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <img src={avatar} alt={fullName} className="w-10 h-10 rounded-full object-cover" />
          <h3 className="font-semibold text-gray-900">{fullName}</h3>
        </div>
        <p className="text-gray-600 h-12 text-sm mb-2">{location}</p>
        <p className="text-blue-600 text-sm font-medium mb-2">
          {type === 'transporter' ? 'Espace disponible' : 'Espace demandé'}: {weight ?? '0 kg'}
        </p>
        {departure && <p className="text-gray-500 text-xs mb-2">Date : {departure}</p>}

        {departure && (
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">{price} €/kg</span>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-600">{rating}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
