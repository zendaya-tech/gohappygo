import { useState, forwardRef, useImperativeHandle, type Ref } from 'react';
import { useNavigate } from 'react-router';
import AirportComboBox from '~/components/forms/AirportComboBox';
import AirlineComboBox from '~/components/forms/AirlineComboBox';
import type { Airport } from '~/services/airportService';
import type { Airline } from '~/services/airlineService';

type Props = {
  initialFrom?: string;
  initialTo?: string;
  initialDate?: string; // ISO string yyyy-mm-dd
  initialFlight?: string;
  initialAirline?: string;
  initialWeight?: number;
  onChange?: (filters: {
    from: string;
    to: string;
    date: string;
    flight: string;
    airline: string;
    weight: number;
  }) => void;
};

export interface SearchFiltersBarRef {
  reset: () => void;
}

// Airports are now fetched dynamically via AirportComboBox

function SearchFiltersBar(
  {
    initialFrom,
    initialTo,
    initialDate,
    initialFlight = '',
    initialAirline = '',
    initialWeight = 0,
    onChange,
  }: Props,
  ref: Ref<SearchFiltersBarRef>
) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState<string>(initialDate || '');
  const [flight, setFlight] = useState(initialFlight);
  const [airline, setAirline] = useState(initialAirline);
  const [weight, setWeight] = useState<number>(initialWeight);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Expose reset method to parent component
  useImperativeHandle(ref, () => ({
    reset: () => {
      setFrom(undefined);
      setTo(undefined);
      setDate('');
      setFlight('');
      setAirline('');
      setWeight(0);
      setErrorMessage(null);
      // Notify parent of reset
      if (onChange) {
        onChange({
          from: '',
          to: '',
          date: '',
          flight: '',
          airline: '',
          weight: 0,
        });
      }
    },
  }));

  const emit = (
    next?: Partial<{
      from: string;
      to: string;
      date: string;
      flight: string;
      weight: number;
    }>
  ) => {
    if (!onChange) return;
    const payload = { from, to, date, flight, weight, ...(next || {}) } as any;
    onChange(payload);
  };

  const handleSearch = async () => {
    setErrorMessage(null);

    const validations = [
      // [
      //   !from || !to,
      //   "Veuillez sélectionner les aéroports de départ et d'arrivée.",
      // ],
      [
        from && to && from === to,
        "L'aéroport de départ et d'arrivée ne peuvent pas être identiques.",
      ],
      // [!date, "Veuillez sélectionner une date de voyage."],
      // [weight < 0, "Le poids doit être un nombre positif."],
    ] as const;

    for (const [condition, message] of validations) {
      if (condition) {
        setErrorMessage(message);
        return;
      }
    }

    setIsLoading(true);

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (date) params.set('date', date);
    if (flight) params.set('flight', flight);
    if (typeof weight === 'number' && weight > 0) params.set('weight', String(weight));

    navigate(`/annonces?${params.toString()}`);
    setIsLoading(false);
  };

  return (
    <div className="bg-white max-w-7xl mx-auto border border-gray-200 rounded-2xl md:rounded-r-full px-3 md:px-4 py-3 md:py-4 shadow-lg">
      {/* Mobile: 2x2 Grid + Button | Desktop: 5 columns */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-2">
        {/* From */}
        <div className="md:border-r md:border-gray-200 md:pr-4">
          <AirportComboBox
            label="Départ"
            value={from !== to ? Number(from) : undefined}
            placeholder="Aéroport de départ"
            onChange={(airportId: number | null) => {
              const id = airportId ? String(airportId) : '';
              setFrom(id);
              emit({ from: id });
            }}
          />
        </div>

        {/* To */}
        <div className="md:border-r md:border-gray-200 md:pr-4">
          <AirportComboBox
            label="Arrivée"
            value={to !== from ? Number(to) : undefined}
            placeholder="Aéroport d'arrivée"
            onChange={(airportId: number | null) => {
              const id = airportId ? String(airportId) : '';
              setTo(id);
              emit({ to: id });
            }}
          />
        </div>

        {/* Date */}
        <div className="md:border-r md:border-gray-200 md:pr-4">
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              console.log(e.target.value);
              emit({ date: e.target.value });
            }}
            className="w-full text-xs md:text-sm text-gray-700 bg-transparent border border-gray-300 md:border-none rounded-lg md:rounded-none px-3 py-2 md:px-0 md:py-0 outline-none truncate focus:border-blue-500 md:focus:border-none transition-colors cursor-pointer"
          />
        </div>

        {/* Flight */}
        <div className="md:border-r md:border-gray-200 md:pr-4">
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Vol</label>
          <input
            type="text"
            value={flight}
            onChange={(e) => {
              setFlight(e.target.value);
              emit({ flight: e.target.value });
            }}
            placeholder="N° de vol"
            className="w-full uppercase text-xs md:text-sm text-gray-700 bg-transparent border border-gray-300 md:border-none rounded-lg md:rounded-none px-3 py-2 md:px-0 md:py-0 outline-none truncate focus:border-blue-500 md:focus:border-none transition-colors"
          />
        </div>

        {/* Search Button - Full width on mobile, single column on desktop */}
        <div className="col-span-2 md:col-span-1 flex items-center justify-center bg-[url('/images/gribouille.jpg')] md:rounded-r-full rounded-2xl overflow-hidden bg-no-repeat bg-cover bg-center py-4 md:py-0">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`
              relative bg-blue-600 border-4 md:border-8 border-white text-white p-3 md:p-3 rounded-full
              transition-all duration-300 ease-in-out transform cursor-pointer
              ${
                isLoading
                  ? 'bg-blue-500 scale-95 cursor-not-allowed'
                  : 'hover:bg-blue-700 hover:scale-110 active:scale-95'
              }
              ${isLoading ? 'animate-pulse' : 'hover:shadow-lg'}
              shadow-xl
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                {/* Spinning loader */}
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
              </div>
            ) : (
              <span className="text-xl md:text-2xl font-bold transition-transform duration-200">
                GO
              </span>
            )}

            {/* Ripple effect */}
            {!isLoading && (
              <span className="absolute inset-0 rounded-full bg-white opacity-0 transform scale-0 transition-all duration-300 group-active:opacity-20 group-active:scale-100" />
            )}
          </button>
        </div>
      </div>
      {errorMessage && <div className="mt-3 text-red-600 text-sm text-center">{errorMessage}</div>}
    </div>
  );
}

const ForwardedSearchFiltersBar = forwardRef(SearchFiltersBar);
ForwardedSearchFiltersBar.displayName = 'SearchFiltersBar';

export default ForwardedSearchFiltersBar;
