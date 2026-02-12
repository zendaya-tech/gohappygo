import React from 'react';

interface ActionCardProps {
  id: string | number;
  image: string;
  title: string;
  type?: 'traveler' | 'transporter';
  subtitle: string;
  dateLabel: string;
  flightNumber: string;
  weight: number;
  price: string | number;
  priceSubtext?: string; // e.g., "€/Kg"
  user?: {
    name: string;
    avatar: string;
  };
  unreadCount?: number; // Badge for unread messages
  // Action Slots
  primaryAction?: {
    label: string;
    onClick: () => void;
    color?: "blue" | "green";
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    color?: 'red' | 'outline';
    disabled?: boolean;
  };
  statusBadge?: string;
  messageAction?: {
    label: string;
    onClick: () => void;
  };
  tertiaryAction?: {
    label: string;
    onClick: () => void;
    color?: 'blue' | 'green' | 'orange' | 'gray';
    disabled?: boolean;
  };
}

const ActionCard: React.FC<ActionCardProps> = ({
  image,
  title,
  subtitle,
  dateLabel,
  flightNumber,
  weight,
  price,
  priceSubtext,
  user,
  unreadCount,
  primaryAction,
  type,
  secondaryAction,
  statusBadge,
  messageAction,
  tertiaryAction,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden p-2 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 flex flex-col h-full">
      {/* 1. Image - Hauteur adaptée (plus petite sur mobile) */}
      <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 h-48 sm:h-56 md:h-64 mb-4 shrink-0">
        <img
          src={image || '/favicon.ico'}
          alt={title}
          className={`${
            type === 'transporter'
              ? 'max-h-full h-40 md:h-52 p-4 md:p-5 object-contain'
              : 'object-cover w-full h-full'
          } m-auto transition-transform duration-300 hover:scale-105`}
          onError={(e) => (e.currentTarget.src = '/favicon.ico')}
        />
        {type && (
          <div
            className={`absolute bottom-3 left-3 md:bottom-4 md:left-4 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide ${
              type === 'transporter' ? 'bg-blue-600/90 text-white' : 'bg-orange-500/90 text-white'
            }`}
          >
            {type === 'transporter' ? 'Voyage' : 'Demande'}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow px-1">
        {/* 2. User Row - Adaptation de l'espace et taille texte */}
        {user && (
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover bg-gray-100 shrink-0"
              />
              <span className="font-bold text-gray-800 text-xs md:text-sm truncate">
                {user.name}
              </span>
            </div>
            <button
              className="relative px-3 py-1.5 md:px-5 md:py-2 border-2 border-blue-600 text-blue-600 rounded-xl text-[10px] md:text-xs font-bold hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
              onClick={messageAction?.onClick}
            >
              Message
              {/* Badge de messages non lus sur le bouton */}
              {!!unreadCount && unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        )}

        {/* 3. Text Info - Hiérarchie visuelle */}
        <div className="space-y-3 mb-5">
          <h3 className="text-sm  text-gray-500 leading-tight min-h-[2.5rem] md:min-h-[3rem]">
            {title}
          </h3>

          <div className="flex flex-col gap-1.5">
            <div className="text-blue-600 font-medium text-xs md">
              {subtitle}: <span className="ml-1">{weight} kg</span>
            </div>
            <div className="flex justify-between items-center text-[0.65rem] md:text-[0.7rem] text-gray-400 font-bold uppercase tracking-wider">
              <span>{dateLabel}</span>
              <span className=" px-2 py-0.5 rounded text-gray-500">Vol {flightNumber}</span>
            </div>
          </div>
        </div>

        {/* 4. Footer - Prix & Boutons (Stack sur très petit écran si besoin) */}
        <div className="flex flex-wrap items-center justify-between mt-auto pt-3 border-t border-gray-50 gap-1">
          <div className="text-sm font-medium  text-gray-900">
            {price} <span className="text-sm  text-gray-900">{priceSubtext || '$/kg'}</span>
          </div>

          <div className="flex gap-2">
            {statusBadge ? (
              <div className="flex gap-2 items-center justify-end w-full">
                {tertiaryAction && (
                  <button
                    onClick={tertiaryAction.onClick}
                    disabled={tertiaryAction.disabled}
                    className={`px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer ${
                      tertiaryAction.disabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                        : tertiaryAction.color === 'orange'
                          ? 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md'
                          : tertiaryAction.color === 'gray'
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                    }`}
                  >
                    {tertiaryAction.label}
                  </button>
                )}
                <span className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold text-xs">
                  {statusBadge}
                </span>
              </div>
            ) : (
              <>
                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.disabled}
                    className={`px-3 py-2 md:px-4 md:py-2 text-white rounded-xl font-bold text-[10px] md shadow-md transition-all active:scale-95 whitespace-nowrap ${
                      primaryAction.disabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                        : primaryAction.color === 'green'
                          ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                          : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    }`}
                  >
                    {primaryAction.label}
                  </button>
                )}
                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    disabled={secondaryAction.disabled}
                    className={`px-3 py-2 md:px-4 md:py-2 text-[10px] md font-bold rounded-xl transition-colors border-2 whitespace-nowrap ${
                      secondaryAction.disabled
                        ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed opacity-80'
                        : secondaryAction.color === 'red'
                          ? 'border-red-500 text-red-500 hover:bg-red-50 cursor-pointer'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
