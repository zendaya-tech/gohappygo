import { useTranslation } from 'react-i18next';

type ReservationStatus = 'waiting_proposal' | 'waiting_payment' | 'archived';

export type Reservation = {
  id: string;
  originCity: string;
  destinationCity: string;
  travelDate: string; // YYYY-MM-DD
  flightNumber?: string;
  weightKg: number;
  priceEuro: number;
  imageUrl?: string;
  customer?: { name: string; avatar?: string };
  status: ReservationStatus;
};

export default function ReservationCard({
  reservation,
  onApprove,
  onReject,
  onContact,
}: {
  reservation: Reservation;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onContact?: (id: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const route = `${reservation.originCity} → ${reservation.destinationCity}`;
  const date = new Date(reservation.travelDate).toLocaleDateString(i18n.language, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex">
      <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
        {reservation.imageUrl ? (
          <img src={reservation.imageUrl} alt={route} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400">✈️</div>
        )}
      </div>

      <div className="flex-1 p-4">
        <div className="text-sm text-gray-700 font-medium">{route}</div>
        <div className="mt-1 text-xs text-gray-500">{date}</div>
        {reservation.flightNumber && (
          <div className="mt-1 text-xs text-gray-500">
            {t('cards.profileTravel.flightNumber')} {reservation.flightNumber}
          </div>
        )}

        <div className="mt-3 flex items-center gap-3">
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm">
            {reservation.weightKg.toString().padStart(2, '0')} {t('cards.common.kg')}
          </span>
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm">
            {t('cards.common.currency', { amount: reservation.priceEuro, symbol: '€' })}
          </span>
        </div>

        {reservation.status === 'waiting_proposal' && (
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => onApprove?.(reservation.id)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover"
            >
              {t('cards.reservation.approve')}
            </button>
            <button
              onClick={() => onReject?.(reservation.id)}
              className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm hover"
            >
              {t('cards.reservation.reject')}
            </button>
          </div>
        )}
      </div>

      <div className="w-64 p-4 border-l border-gray-200 hidden md:block">
        <div className="text-sm font-semibold text-gray-900 mb-2">
          {t('cards.reservation.customerDetails')}
        </div>
        {reservation.customer ? (
          <div className="flex items-center gap-3">
            <img
              className="w-8 h-8 rounded-full"
              src={reservation.customer.avatar || '/favicon.ico'}
              alt={reservation.customer.name}
            />
            <div className="text-sm text-gray-700">{reservation.customer.name}</div>
          </div>
        ) : (
          <div className="text-xs text-gray-500">{t('cards.reservation.customerDataPending')}</div>
        )}

        <button
          onClick={() => onContact?.(reservation.id)}
          className="mt-4 w-full px-4 py-2 rounded-lg border text-sm hover"
        >
          {t('cards.reservation.contact')}
        </button>
      </div>
    </div>
  );
}
