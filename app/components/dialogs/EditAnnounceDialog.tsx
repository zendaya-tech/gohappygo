import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  updateTravel,
  getAirlineFromFlightNumber,
  type TravelItem,
} from '~/services/travelService';
import AirportComboBox from '~/components/forms/AirportComboBox';
import CurrencyComboBox from '~/components/forms/CurrencyComboBox';
import { useAuth } from '~/hooks/useAuth';
import type { DemandTravelItem } from '~/services/announceService';
import type { Currency } from '~/services/currencyService';

type StepKey = 1 | 2;

export default function EditAnnounceDialog({
  open,
  onClose,
  travel,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  travel: DemandTravelItem | null | TravelItem;
  onSuccess?: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Form state - all in one step now
  const [departureId, setDepartureId] = useState<number | null>(null);
  const [arrivalId, setArrivalId] = useState<number | null>(null);
  const [story, setStory] = useState('');
  const [kilos, setKilos] = useState<number | ''>('');
  const [pricePerKg, setPricePerKg] = useState<number | ''>('');
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [allowExtraGrams, setAllowExtraGrams] = useState<boolean>(false);
  const [punctuality, setPunctuality] = useState<'punctual' | 'very-punctual'>('punctual');

  // Supplementary info
  const [flightNumber, setFlightNumber] = useState('');
  const [airline, setAirline] = useState<{ name?: string }>({});
  const [travelDate, setTravelDate] = useState('');
  const [fetchingAirline, setFetchingAirline] = useState(false);
  const [flightNumberError, setFlightNumberError] = useState<string | null>(null);

  // API integration state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [reservationType, setReservationType] = useState<'single' | 'shared'>('single');
  const [bookingType, setBookingType] = useState<'instant' | 'non-instant'>('instant');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Fetch airline when flight number changes
  useEffect(() => {
    const fetchAirline = async () => {
      if (!flightNumber || flightNumber.length < 2) {
        setAirline({});
        setFlightNumberError(null);
        return;
      }

      setFetchingAirline(true);
      setFlightNumberError(null);
      try {
        const airline = await getAirlineFromFlightNumber(flightNumber);
        if (airline) {
          setAirline({ name: airline.name });
          setFlightNumberError(null);
        } else {
          setAirline({});
          setFlightNumberError('Numéro de vol non valide');
        }
      } catch (error) {
        console.error('Error fetching airline:', error);
        setAirline({});
        setFlightNumberError('Numéro de vol non valide');
      } finally {
        setFetchingAirline(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchAirline, 500);
    return () => clearTimeout(timeoutId);
  }, [flightNumber]);

  // Initialize form with travel data
  useEffect(() => {
    if (!open || !travel) return;

    // Set airport IDs
    if (travel.departureAirport) {
      setDepartureId(travel.departureAirport.id);
    }

    if (travel.arrivalAirport) {
      setArrivalId(travel.arrivalAirport.id);
    }

    // Set other fields
    setStory(travel.description || '');
    setKilos(travel.weightAvailable || travel.totalWeightAllowance || '');
    const priceValue =
      typeof travel.pricePerKg === 'string' ? parseFloat(travel.pricePerKg) : travel.pricePerKg;
    setPricePerKg(priceValue || '');

    // Set currency - use user's recent currency as fallback since travel doesn't have currency info
    const defaultCurrency = user?.recentCurrency
      ? {
          ...user.recentCurrency,
          id: user.recentCurrency.id.toString(),
          country: '',
        }
      : null;
    setCurrency(defaultCurrency);

    setAllowExtraGrams(Boolean(travel.isAllowExtraWeight));
    setPunctuality('punctual'); // Default value since not stored in backend yet
    setFlightNumber(travel.flightNumber || '');

    // Set travel date
    if (travel.departureDatetime) {
      const date = new Date(travel.departureDatetime);
      setTravelDate(date.toISOString().split('T')[0]);
    }

    setReservationType(travel.isSharedWeight ? 'shared' : 'single');
    setBookingType(travel.isInstant ? 'instant' : 'non-instant');

    // Reset other states
    setFlightNumberError(null);
    setSubmitting(false);
    setError(null);
    setSuccess(null);
  }, [open, travel, user?.recentCurrency]);

  const canSubmit = useMemo(() => {
    const hasValidFlightNumber =
      !flightNumber || (flightNumber && airline.name && !flightNumberError);
    return (
      departureId !== null &&
      arrivalId !== null &&
      story.trim().length > 0 &&
      story.length <= 500 &&
      hasValidFlightNumber &&
      Boolean(kilos) &&
      Boolean(pricePerKg)
    );
  }, [
    departureId,
    arrivalId,
    kilos,
    pricePerKg,
    story.length,
    flightNumber,
    airline.name,
    flightNumberError,
  ]);

  const handleSubmit = async () => {
    if (!travel) return;

    if (!departureId || !arrivalId) {
      setError("Veuillez sélectionner les aéroports de départ et d'arrivée");
      return;
    }

    if (flightNumber && (!airline.name || flightNumberError)) {
      setError('Veuillez entrer un numéro de vol valide');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert travelDate to datetime format (assuming departure time)
      const departureDatetime = travelDate ? `${travelDate}T12:00:00Z` : undefined;

      if (!currency) {
        setError('Veuillez sélectionner une devise');
        return;
      }

      const updateData: any = {
        description: story,
        flightNumber,
        isSharedWeight: reservationType === 'shared',
        isInstant: bookingType === 'instant',
        isAllowExtraWeight: allowExtraGrams,
        feeForGloomy: 0,
        punctualityLevel: punctuality === 'very-punctual',
        departureAirportId: departureId,
        arrivalAirportId: arrivalId,
        pricePerKg: pricePerKg === '' ? 0 : Number(pricePerKg),
        currencyId: parseInt(currency.id),
        totalWeightAllowance: kilos === '' ? 0 : Number(kilos),
      };

      if (departureDatetime) {
        updateData.departureDatetime = departureDatetime;
      }

      const result = await updateTravel(travel.id, updateData);

      if (result) {
        setSuccess('Annonce de voyage mise à jour avec succès!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        setError("Erreur lors de la mise à jour de l'annonce. Veuillez réessayer.");
      }
    } catch (err: any) {
      // Check if it's a 401 error (user not authenticated)
      if (err?.response?.status === 401 || err?.status === 401) {
        setError('Vous devez être connecté pour modifier une annonce. Veuillez vous connecter.');
      } else {
        // Handle validation errors from backend
        if (err?.response?.data?.message) {
          if (Array.isArray(err.response.data.message)) {
            setError(err.response.data.message.join(', '));
          } else {
            setError(err.response.data.message);
          }
        } else {
          setError("Erreur lors de la mise à jour de l'annonce. Veuillez réessayer.");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !travel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/35" onClick={onClose} />

      {/* Dialog container */}
      <div className="relative z-10 mt-4 md:mt-10 w-full max-w-4xl overflow-hidden rounded-2xl md:rounded-2xl bg-white shadow-2xl ring-1 ring-black/10/10 h-[95vh] md:max-h-[85vh] flex flex-col">
        <div className="flex flex-col min-h-0 flex-1">
          {/* Content */}
          <section className="p-4 md:p-6 overflow-y-auto min-h-0">
            <header className="mb-4 md:mb-6">
              <h2 className="text-lg md font-bold text-gray-900">
                <span className="uppercase text-sm md">Modifier l'annonce de voyage</span>
              </h2>
            </header>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <AirportComboBox
                  label="Select your airport of departure"
                  value={departureId ?? undefined}
                  onChange={setDepartureId}
                  placeholder="Choose airport"
                />
                {!departureId && (
                  <p className="mt-1 text-sm text-red-500 font-medium">
                    Veuillez sélectionner un aéroport de départ
                  </p>
                )}
              </div>
              <div>
                <AirportComboBox
                  label="Select your airport of arrival"
                  value={arrivalId ?? undefined}
                  onChange={setArrivalId}
                  placeholder="Choose airport"
                />
                {!arrivalId && (
                  <p className="mt-1 text-sm text-red-500 font-medium">
                    Veuillez sélectionner un aéroport d'arrivée
                  </p>
                )}
              </div>

              <Field label="Numéro de Vol">
                <input
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="Add numero de vol sur votre billet d'avion"
                  className={`w-full rounded-xl uppercase border ${
                    flightNumberError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  } bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2`}
                />
                {flightNumberError && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{flightNumberError}</p>
                )}
              </Field>
              <Field label="Date de votre Voyage">
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  placeholder="Choisir une date"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>
              <Field label="Compagnie aérienne">
                <div className="relative">
                  <input
                    value={airline.name || ''}
                    disabled
                    placeholder={
                      fetchingAirline
                        ? 'Recherche en cours...'
                        : flightNumber
                          ? 'Détectée automatiquement'
                          : "Entrez d'abord le numéro de vol"
                    }
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-600 cursor-not-allowed"
                  />
                  {fetchingAirline && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="animate-spin h-5 w-5 text-indigo-600"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  La compagnie aérienne est détectée automatiquement à partir du numéro de vol
                </p>
              </Field>

              <Field label="Tell a bit more about your travel">
                <textarea
                  value={story}
                  onChange={(e) => {
                    // Allow typing beyond 500 characters but show validation
                    setStory(e.target.value);
                  }}
                  rows={5}
                  placeholder="Type here..."
                  className={`w-full resize-none rounded-xl border ${
                    story.length > 500
                      ? 'border-red-500 focus:ring-red-500'
                      : story.trim().length === 0
                        ? 'border-red-300 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-indigo-500'
                  } bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2`}
                />
                <div
                  className={`mt-1 text-xs ${
                    story.length > 500
                      ? 'text-red-500 font-semibold'
                      : story.length > 450
                        ? 'text-orange-500'
                        : story.trim().length === 0
                          ? 'text-red-400'
                          : 'text-gray-400'
                  }`}
                >
                  {story.length}/500 caractères
                  {story.trim().length === 0 && (
                    <span className="block text-red-500 font-medium">
                      Une description est requise
                    </span>
                  )}
                  {story.length > 500 && (
                    <span className="block text-red-500 font-medium">
                      Dépassement de {story.length - 500} caractères
                    </span>
                  )}
                </div>
              </Field>
              <div>
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  What kind of reservation do you prefer?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    <input
                      type="radio"
                      checked={reservationType === 'single'}
                      onChange={() => setReservationType('single')}
                    />
                    All my kilos for one person
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    <input
                      type="radio"
                      checked={reservationType === 'shared'}
                      onChange={() => setReservationType('shared')}
                    />
                    Shared kilo with differents traveller
                  </label>
                </div>
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  What kind of booking do you prefer for this travel?
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-700">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      checked={bookingType === 'instant'}
                      onChange={() => setBookingType('instant')}
                    />
                    Instant
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      checked={bookingType === 'non-instant'}
                      onChange={() => setBookingType('non-instant')}
                    />
                    Non-instant
                  </label>
                </div>
              </div>

              <Field label="How many Kilos do you propose ?">
                <input
                  type="number"
                  min={0}
                  value={kilos}
                  onChange={(e) => setKilos(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Enter number of kilos"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>
              <div>
                <div className="flex gap-4">
                  <Field label="What is your price per kilos?">
                    <input
                      type="number"
                      min={0}
                      value={pricePerKg}
                      onChange={(e) =>
                        setPricePerKg(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      placeholder="enter your price per kilos"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </Field>
                  <div className="w-32">
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      Currency
                    </label>
                    <CurrencyComboBox
                      value={currency?.code}
                      selectedCurrency={currency}
                      onChange={setCurrency}
                      placeholder="EUR"
                      compact
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  Tolérez vous quelques grammes de trop ?
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-700">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      checked={allowExtraGrams}
                      onChange={() => setAllowExtraGrams(true)}
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      checked={!allowExtraGrams}
                      onChange={() => setAllowExtraGrams(false)}
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  Quelle ponctualité attendez-vous lors de la rencontre avec votre HappyVoyageur ?
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-700">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="punctuality-edit"
                      checked={punctuality === 'punctual'}
                      onChange={() => setPunctuality('punctual')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Ponctuel
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="punctuality-edit"
                      checked={punctuality === 'very-punctual'}
                      onChange={() => setPunctuality('very-punctual')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Très Ponctuel
                  </label>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover cursor-pointer"
                  onClick={onClose}
                >
                  ‹ Back
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white cursor-pointer ${
                  canSubmit && !submitting
                    ? 'bg-indigo-600 hover'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {submitting ? 'Mise à jour en cours...' : 'Update'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-900">{label}</label>
      {children}
    </div>
  );
}
