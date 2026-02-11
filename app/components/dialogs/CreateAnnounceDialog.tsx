import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createTravel, getAirlineFromFlightNumber } from '~/services/travelService';
import AirportComboBox from '~/components/forms//AirportComboBox';
import CurrencyComboBox from '~/components/forms/CurrencyComboBox';
import type { Airport } from '~/services/airportService';
import type { Currency } from '~/services/currencyService';
import { useAuth } from '~/hooks/useAuth';

type StepKey = 1 | 2 | 3 | 4;

type InitialData = {
  departureId?: number | null;
  arrivalId?: number | null;
  story?: string;
  kilos?: number;
  pricePerKg?: number;
  currency?: Currency | null;
  allowExtraGrams?: boolean;
  flightNumber?: string;
  airline?: any;
  travelDate?: string; // YYYY-MM-DD
  reservationType?: 'single' | 'shared';
  bookingType?: 'instant' | 'non-instant';
  punctuality?: 'punctual' | 'very-punctual';
};

export default function CreateAnnounceDialog({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: InitialData;
}) {
  const [step, setStep] = useState<StepKey>(1);
  const { t } = useTranslation();
  const { user } = useAuth();
  // Form state - Using IDs instead of full Airport objects
  const [departureId, setDepartureId] = useState<number | null>(null);
  const [arrivalId, setArrivalId] = useState<number | null>(null);
  const [story, setStory] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [kilos, setKilos] = useState<number | ''>('');
  const [pricePerKg, setPricePerKg] = useState<number | ''>('');
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [allowExtraGrams, setAllowExtraGrams] = useState<boolean>(false);
  const [punctuality, setPunctuality] = useState<'punctual' | 'very-punctual'>('punctual');
  // Supplementary info for Step 1
  const [flightNumber, setFlightNumber] = useState('');
  const [airline, setAirline] = useState<{ name?: string }>({});
  const [travelDate, setTravelDate] = useState('');
  const [fetchingAirline, setFetchingAirline] = useState(false);
  const [flightNumberError, setFlightNumberError] = useState<string | null>(null);
  // API integration state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [reservationType, setReservationType] = useState<'single' | 'shared'>('single');
  const [bookingType, setBookingType] = useState<'instant' | 'non-instant'>('instant');

  const today = new Date().toISOString().split('T')[0];

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

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!departureId) errors.departure = 'Veuillez sélectionner un aéroport de départ';
        if (!arrivalId) errors.arrival = "Veuillez sélectionner un aéroport d'arrivée";
        if (departureId && arrivalId && departureId === arrivalId) {
          errors.airports = "L'aéroport d'arrivée doit être différent de l'aéroport de départ";
        }
        if (!story.trim()) errors.story = 'Veuillez décrire votre voyage';
        if (story.length > 500) errors.story = 'La description ne peut pas dépasser 500 caractères';
        if (flightNumber && (!airline.name || flightNumberError)) {
          errors.flightNumber = 'Veuillez entrer un numéro de vol valide';
        }
        break;
      case 2:
        if (files.length < 2) errors.photos = 'Veuillez ajouter au moins 2 images';
        break;
      case 3:
        if (!kilos || Number(kilos) <= 0)
          errors.kilos = 'Veuillez saisir un nombre de kilos valide';
        if (!pricePerKg || Number(pricePerKg) <= 0)
          errors.pricePerKg = 'Veuillez saisir un prix valide';
        if (!currency) errors.currency = 'Veuillez sélectionner une devise';
        break;
    }

    return errors;
  };

  useEffect(() => {
    if (!open) return;
    setStep(1);
    if (initialData) {
      setDepartureId(initialData.departureId ?? null);
      setArrivalId(initialData.arrivalId ?? null);
      setStory(initialData.story ?? '');
      setKilos(typeof initialData.kilos === 'number' ? initialData.kilos : '');
      setPricePerKg(typeof initialData.pricePerKg === 'number' ? initialData.pricePerKg : '');
      // Prioritize initialData currency, then user's recent currency
      const defaultCurrency = user?.recentCurrency
        ? {
            ...user.recentCurrency,
            id: user.recentCurrency.id.toString(), // Convert number to string
            country: '', // Add missing country property for type compatibility
          }
        : null;
      console.log(defaultCurrency);
      setCurrency(defaultCurrency);
      setAllowExtraGrams(Boolean(initialData.allowExtraGrams));
      setPunctuality(initialData.punctuality ?? 'punctual');
      setFlightNumber(initialData.flightNumber ?? '');
      setAirline(initialData.airline ?? '');
      setTravelDate(initialData.travelDate ?? '');
      setFlightNumberError(null);
      setReservationType(initialData.reservationType ?? 'single');
      setBookingType(initialData.bookingType ?? 'instant');
    } else {
      // Reset all fields when no initial data
      setDepartureId(null);
      setArrivalId(null);
      setStory('');
      setFiles([]);
      setFileUrls([]);
      setKilos('');
      setPricePerKg('');
      // Set user's recent currency as default with proper type conversion
      const defaultCurrency = user?.recentCurrency
        ? {
            ...user.recentCurrency,
            id: user.recentCurrency.id.toString(), // Convert number to string
            country: '', // Add missing country property for type compatibility
          }
        : null;
      setCurrency(defaultCurrency);
      setAllowExtraGrams(false);
      setPunctuality('punctual');
      setFlightNumber('');
      setAirline({});
      setTravelDate('');
      setFlightNumberError(null);
      setReservationType('single');
      setBookingType('instant');
      setSubmitting(false);
      setError(null);
      setSuccess(null);
      setValidationErrors({});
    }
  }, [open, initialData, user?.recentCurrency]);

  const canNext = useMemo(() => {
    // Always return true to keep button active
    return true;
  }, []);

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prevFiles) => {
      const remainingSlots = Math.max(0, 2 - prevFiles.length);
      const filesToAdd = selected.slice(0, remainingSlots);
      return [...prevFiles, ...filesToAdd];
    });

    // Create preview URLs for new images up to the cap
    setFileUrls((prevUrls) => {
      const remainingSlots = Math.max(0, 2 - prevUrls.length);
      const urlsToAdd = selected.slice(0, remainingSlots).map((file) => URL.createObjectURL(file));
      return [...prevUrls, ...urlsToAdd];
    });

    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFileUrls((prevUrls) => {
      // Revoke the URL to free memory
      URL.revokeObjectURL(prevUrls[index]);
      return prevUrls.filter((_, i) => i !== index);
    });
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return (
          !!departureId &&
          !!arrivalId &&
          !!flightNumber.trim() &&
          !!travelDate &&
          !!story.trim() &&
          story.length <= 500
        );
      case 2:
        return files.length >= 2;
      case 3:
        return Number(kilos) > 0 && Number(pricePerKg) > 0 && !!currency;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    const errors = validateCurrentStep();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (files.length < 2) {
      setError('Veuillez ajouter au moins 2 images');
      return;
    }

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
      const departureDatetime = travelDate ? `${travelDate}T12:00:00Z` : new Date().toISOString();

      if (!currency) {
        setError('Veuillez sélectionner une devise');
        return;
      }

      const travelData = {
        description: story,
        flightNumber,
        isSharedWeight: reservationType === 'shared',
        isInstant: bookingType === 'instant',
        isAllowExtraWeight: allowExtraGrams,
        punctualityLevel: punctuality === 'very-punctual', // false = punctual, true = very punctual
        feeForGloomy: 0,
        departureAirportId: departureId,
        arrivalAirportId: arrivalId,
        departureDatetime,
        pricePerKg: typeof pricePerKg === 'number' ? pricePerKg : 0,
        currencyId: parseInt(currency.id),
        totalWeightAllowance: typeof kilos === 'number' ? kilos : 0,
        image1: files[0],
        image2: files[1],
      };

      const result = await createTravel(travelData);

      if (result) {
        setSuccess('Annonce de voyage créée avec succès!');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError("Erreur lors de la création de l'annonce. Veuillez réessayer.");
      }
    } catch (err: any) {
      // Check if it's a 401 error (user not authenticated)
      if (err?.response?.status === 401 || err?.status === 401) {
        setError('Vous devez être connecté pour créer une annonce. Veuillez vous connecter.');
      } else {
        // Handle validation errors from backend
        if (err?.response?.data?.message) {
          if (Array.isArray(err.response.data.message)) {
            setError(err.response.data.message.join(', '));
          } else {
            setError(err.response.data.message);
          }
        } else {
          setError("Erreur lors de la création de l'annonce. Veuillez réessayer.");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/35" onClick={onClose} />

      {/* Dialog container */}
      <div className="relative z-10 mt-4 md:mt-10 w-full max-w-6xl overflow-hidden rounded-2xl md:rounded-2xl bg-white shadow-2xl ring-1 ring-black/10/10 h-[95vh] md:max-h-[85vh] flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-0 flex-1">
          {/* Sidebar steps */}
          <aside className="border-b md md border-gray-200 p-4 md:p-6 overflow-y-auto">
            <StepsNav step={step} />
          </aside>

          {/* Content */}
          <section className="p-4 md:p-6 overflow-y-auto min-h-0">
            <header className="mb-4 md:mb-6">
              <h2 className="text-lg md font-bold text-gray-900">
                <span className="uppercase text-sm md">{t('dialogs.createAnnounce.title')}</span>{' '}
                <span className="text-sm md">
                  - {t('common.step')} {step} {t('common.of')} 3
                </span>
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

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <AirportComboBox
                    label="Sélectionnez votre aéroport de départ"
                    value={departureId ?? undefined}
                    onChange={setDepartureId}
                    placeholder="Choisir l'aéroport"
                  />
                  {validationErrors.departure && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.departure}</p>
                  )}
                </div>
                <div>
                  <AirportComboBox
                    label="Sélectionnez votre aéroport d'arrivée"
                    value={arrivalId ?? undefined}
                    onChange={setArrivalId}
                    placeholder="Choisir l'aéroport"
                  />
                  {validationErrors.arrival && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.arrival}</p>
                  )}
                  {validationErrors.airports && (
                    <p className="mt-1 text-sm text-red-600 font-semibold italic">
                      {validationErrors.airports}
                    </p>
                  )}
                </div>

                <Field label="Numéro de Vol">
                  <input
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="Ajoutez le numéro de vol sur votre billet d’avion"
                    className={`w-full rounded-xl uppercase border ${
                      validationErrors.flightNumber || flightNumberError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500'
                    } bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2`}
                  />
                  {(validationErrors.flightNumber || flightNumberError) && (
                    <p className="mt-1 text-sm text-red-600 font-medium">
                      {validationErrors.flightNumber || flightNumberError}
                    </p>
                  )}
                </Field>
                <Field label="Date de votre Voyage">
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={today} // This prevents selecting past dates
                    placeholder="Choisir une date"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {/* Optional: Show an error message if the date is invalid */}
                  {travelDate && travelDate < today && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      La date ne peut pas être dans le passé.
                    </p>
                  )}
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

                <Field label="Parlez un peu plus de votre voyage">
                  <textarea
                    value={story}
                    onChange={(e) => {
                      // Allow typing beyond 500 characters but show validation
                      setStory(e.target.value);
                    }}
                    rows={5}
                    placeholder="Tapez ici..."
                    className={`w-full resize-none rounded-xl border ${
                      validationErrors.story || story.length > 500
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500'
                    } bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2`}
                  />
                  <div
                    className={`mt-1 text-xs ${
                      story.length > 500
                        ? 'text-red-500 font-semibold'
                        : story.length > 450
                          ? 'text-orange-500'
                          : 'text-gray-400'
                    }`}
                  >
                    {story.length}/500 caractères
                    {story.length > 500 && (
                      <span className="block text-red-500 font-medium">
                        Dépassement de {story.length - 500} caractères
                      </span>
                    )}
                  </div>
                  {validationErrors.story && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.story}</p>
                  )}
                </Field>
                <div>
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Quel type de réservation préférez-vous ?
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700">
                      <input
                        type="radio"
                        checked={reservationType === 'single'}
                        onChange={() => setReservationType('single')}
                      />
                      Tous mes kilos pour un seul et unique voyageur
                    </label>
                    <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700">
                      <input
                        type="radio"
                        checked={reservationType === 'shared'}
                        onChange={() => setReservationType('shared')}
                      />
                      Kilo partagé avec différents voyageurs
                    </label>
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Quel type de réservation préférez-vous pour ce voyage ?
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-700">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        checked={bookingType === 'instant'}
                        onChange={() => setBookingType('instant')}
                      />
                      Instantané
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        checked={bookingType === 'non-instant'}
                        onChange={() => setBookingType('non-instant')}
                      />
                      Non-instantané (vous souhaitez valider la réservation avant confirmation)
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <p className="text-gray-700 font-medium">
                  Téléchargez au moins 2 photos de votre voyage
                </p>
                <label className="block cursor-pointer rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500 hover">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onFilesSelected}
                    disabled={files.length >= 2}
                  />
                  Cliquez pour télécharger des fichiers ({files.length}/2)
                </label>
                {validationErrors.photos && (
                  <p className="text-sm text-red-600">{validationErrors.photos}</p>
                )}
                {files.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {files.map((f, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl border border-gray-200 overflow-hidden"
                      >
                        <button
                          onClick={() => removeFile(idx)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg cursor-pointer z-10"
                          title="Supprimer l'image"
                        >
                          −
                        </button>
                        <img
                          src={fileUrls[idx]}
                          alt={`Aperçu ${f.name}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2">
                          <div className="text-xs text-gray-600 truncate">{f.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <Field label="Combien de kilos proposez-vous ?">
                  <input
                    type="number"
                    min={0}
                    value={kilos}
                    onChange={(e) => setKilos(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Entrez le nombre de kilos"
                    className={`w-full rounded-xl border ${
                      validationErrors.kilos
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500'
                    } bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2`}
                  />
                  {validationErrors.kilos && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.kilos}</p>
                  )}
                </Field>
                <div>
                  <div className="flex gap-4">
                    <Field label="Quel est votre prix par kilo ?">
                      <input
                        type="number"
                        min={0}
                        max={3000}
                        value={pricePerKg}
                        onChange={(e) =>
                          setPricePerKg(
                            e.target.value === '' ? '' : Math.min(Number(e.target.value), 3000)
                          )
                        }
                        placeholder="Entrez votre prix par kilo"
                        className={`w-full rounded-xl border ${
                          validationErrors.pricePerKg
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-indigo-500'
                        } bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2`}
                      />
                      {validationErrors.pricePerKg && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.pricePerKg}</p>
                      )}
                    </Field>
                    <div className="w-32">
                      <label className="mb-2 block text-sm font-semibold text-gray-900">
                        Devise
                      </label>
                      <CurrencyComboBox
                        value={currency?.code}
                        selectedCurrency={currency}
                        onChange={setCurrency}
                        placeholder="EUR"
                        compact
                      />
                      {validationErrors.currency && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.currency}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Tolérez-vous quelques grammes de trop ?
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-700">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        checked={allowExtraGrams}
                        onChange={() => setAllowExtraGrams(true)}
                      />
                      Oui
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!allowExtraGrams}
                        onChange={() => setAllowExtraGrams(false)}
                      />
                      Non
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
                        name="punctuality"
                        checked={punctuality === 'punctual'}
                        onChange={() => setPunctuality('punctual')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      Ponctuel
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="punctuality"
                        checked={punctuality === 'very-punctual'}
                        onChange={() => setPunctuality('very-punctual')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      Très Ponctuel
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <p className="text-gray-700 font-medium">Configuration des paiements</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nom du titulaire du compte">
                    <input
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="John Doe"
                    />
                  </Field>
                  <Field label="Email de paiement (Stripe)">
                    <input
                      type="email"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="name@email.com"
                    />
                  </Field>
                </div>
                <Field label="IBAN / Compte bancaire">
                  <input
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="FR76...."
                  />
                </Field>
              </div>
            )}

            {/* Footer actions */}
            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover cursor-pointer"
                  onClick={() => {
                    if (step > 1) {
                      setStep((s) => Math.max(1, (s - 1) as StepKey) as StepKey);
                      setValidationErrors({}); // Clear errors when going back
                    } else {
                      onClose();
                    }
                  }}
                >
                  ‹ Retour
                </button>
              </div>
              {step < 3 ? (
                <button
                  onClick={() => {
                    const errors = validateCurrentStep();
                    setValidationErrors(errors);

                    if (Object.keys(errors).length === 0) {
                      setStep((s) => (s + 1) as StepKey);
                    }
                  }}
                  disabled={!isStepComplete()}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors cursor-pointer ${
                    isStepComplete() ? 'bg-indigo-600 hover' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Suivant ›
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  //Button is disabled if submitting OR step 3 is incomplete
                  disabled={submitting || !isStepComplete()}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white cursor-pointer ${
                    submitting && isStepComplete()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover'
                  }`}
                >
                  {submitting ? 'Publication en cours...' : 'Publier'}
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StepsNav({ step }: { step: StepKey }) {
  const Item = ({
    index,
    title,
    subtitle,
  }: {
    index: StepKey;
    title: string;
    subtitle: string;
  }) => (
    <div className="flex items-start gap-2 md:gap-3 py-2 md:py-4">
      <div
        className={`mt-0.5 md:mt-1 inline-flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full border ${
          index <= step ? 'border-green-500 text-green-600' : 'border-gray-300 text-gray-400'
        }`}
      >
        {index <= step ? (
          <svg className="h-2.5 w-2.5 md:h-3 md:w-3" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-gray-300"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm md font-semibold truncate ${
            index <= step ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {title}
        </div>
        <div className="text-xs md text-gray-400 truncate">{subtitle}</div>
      </div>
    </div>
  );

  return (
    <div>
      <Item index={1} title="Général" subtitle="Sélectionner les paramètres de base" />
      <div className="ml-1.5 md:ml-2 h-4 md:h-6 w-px bg-gray-200" />
      <Item index={2} title="Photos" subtitle="Ajouter 2 photos" />
      <div className="ml-1.5 md:ml-2 h-4 md:h-6 w-px bg-gray-200" />
      <Item index={3} title="Prix & Réservation" subtitle="Spécifiez vos préférences" />
      {/* <Item index={1} title="General" subtitle="Select basic settings" />
      <div className="ml-1.5 md:ml-2 h-4 md:h-6 w-px bg-gray-200" />
      <Item index={2} title="Pictures" subtitle="Add 2 photos" />
      <div className="ml-1.5 md:ml-2 h-4 md:h-6 w-px bg-gray-200" />
      <Item index={3} title="Price & Booking" subtitle="Specify your preferences" /> */}
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
