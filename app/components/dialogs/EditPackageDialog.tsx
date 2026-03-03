import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateDemand } from '~/services/transportService';
import AirportComboBox from '~/components/forms/AirportComboBox';
import CurrencyComboBox from '~/components/forms/CurrencyComboBox';
import type { Currency } from '~/services/currencyService';
import { useAuth } from '~/hooks/useAuth';
import type { DemandTravelItem } from '~/services/announceService';

export default function EditPackageDialog({
  open,
  onClose,
  demand,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  demand: DemandTravelItem | null;
  onSuccess?: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  // Form fields - all in one step now
  const [departureAirportId, setDepartureAirportId] = useState<number | null>(null);
  const [arrivalAirportId, setArrivalAirportId] = useState<number | null>(null);
  const [baggageDescription, setBaggageDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [pricePerKilo, setPricePerKilo] = useState('');
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [flightNumber, setFlightNumber] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [packageNature, setPackageNature] = useState<
    'FRAGILE' | 'URGENT' | 'STANDARD' | 'MORE_THAN_3000'
  >('STANDARD');

  // API state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Initialize form with demand data
  useEffect(() => {
    if (!open || !demand) return;

    // Set airport IDs
    if (demand.departureAirport) {
      setDepartureAirportId(demand.departureAirportId);
    }

    if (demand.arrivalAirport) {
      setArrivalAirportId(demand.arrivalAirportId);
    }

    // Set other fields
    setBaggageDescription(demand.description || '');
    setWeight(demand.weight?.toString() || '');
    const priceValue =
      typeof demand.pricePerKg === 'string' ? parseFloat(demand.pricePerKg) : demand.pricePerKg;
    setPricePerKilo(priceValue?.toString() || '');

    // Set currency - use user's recent currency as fallback since demand doesn't have currency info
    const defaultCurrency = user?.recentCurrency
      ? {
          ...user.recentCurrency,
          id: user.recentCurrency.id.toString(),
          country: '',
        }
      : null;
    setCurrency(defaultCurrency);

    setFlightNumber(demand.flightNumber || '');

    // Set travel date
    if (demand.deliveryDate || demand.travelDate) {
      const dateString = demand.deliveryDate || demand.travelDate;
      if (dateString) {
        const date = new Date(dateString);
        setTravelDate(date.toISOString().split('T')[0]);
      }
    }

    // Set package nature - map from backend values
    const backendPackageKind = (demand as any).packageKind || 'STANDARD';
    setPackageNature(backendPackageKind);

    // Reset other states
    setSubmitting(false);
    setError(null);
    setSuccess(null);
  }, [open, demand, user?.recentCurrency]);

  const canSubmit = () => {
    return (
      departureAirportId !== null &&
      arrivalAirportId !== null &&
      Boolean(baggageDescription) &&
      baggageDescription.length <= 500 &&
      Boolean(weight) &&
      Boolean(pricePerKilo) &&
      Boolean(flightNumber) &&
      Boolean(travelDate)
    );
  };

  const handleSubmit = async () => {
    if (!demand) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!departureAirportId || !arrivalAirportId) {
        setError(t('dialogs.createAnnounce.errors.selectAirports'));
        setSubmitting(false);
        return;
      }

      if (!currency) {
        setError(t('dialogs.createAnnounce.errors.selectCurrency'));
        setSubmitting(false);
        return;
      }

      const updateData: any = {
        flightNumber,
        description: baggageDescription,
        departureAirportId: departureAirportId,
        arrivalAirportId: arrivalAirportId,
        travelDate,
        weight: parseFloat(weight),
        pricePerKg: parseFloat(pricePerKilo),
        currencyId: parseInt(currency.id),
        packageKind: packageNature,
      };

      const result = await updateDemand(demand.id, updateData);

      if (result) {
        setSuccess(t('dialogs.editPackage.success'));
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        setError(t('common.errors.genericUpdate'));
      }
    } catch (err: any) {
      // Check if it's a 401 error (user not authenticated)
      if (err?.response?.status === 401 || err?.status === 401) {
        setError(t('common.errors.loginRequiredUpdate'));
      } else {
        // Handle validation errors from backend
        if (err?.response?.data?.message) {
          if (Array.isArray(err.response.data.message)) {
            setError(err.response.data.message.join(', '));
          } else {
            setError(err.response.data.message);
          }
        } else {
          setError(t('common.errors.genericUpdate'));
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !demand) return null;

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
                <span className="uppercase text-sm md">{t('dialogs.editPackage.title')}</span>
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
              <AirportComboBox
                label={t('dialogs.createAnnounce.departure')}
                value={departureAirportId ?? undefined}
                onChange={setDepartureAirportId}
                placeholder={t('dialogs.createAnnounce.departure')}
              />
              <AirportComboBox
                label={t('dialogs.createAnnounce.arrival')}
                value={arrivalAirportId ?? undefined}
                onChange={setArrivalAirportId}
                placeholder={t('dialogs.createAnnounce.arrival')}
              />

              <Field label={t('dialogs.createAnnounce.flightNumber')}>
                <input
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder={t('dialogs.createAnnounce.flightNumber')}
                  className="w-full uppercase rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>
              <Field label={t('dialogs.createAnnounce.travelDate')}>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>

              <Field label={t('dialogs.createAnnounce.story')}>
                <textarea
                  value={baggageDescription}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setBaggageDescription(e.target.value);
                    }
                  }}
                  rows={5}
                  placeholder={t('dialogs.createAnnounce.story')}
                  className={`w-full resize-none rounded-xl border ${
                    baggageDescription.length > 500
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  } bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2`}
                />
                <div
                  className={`mt-1 text-xs ${
                    baggageDescription.length > 500
                      ? 'text-red-500 font-semibold'
                      : baggageDescription.length > 450
                        ? 'text-orange-500'
                        : 'text-gray-400'
                  }`}
                >
                  {t('common.characterCount', { count: baggageDescription.length, max: 500 })}
                </div>
              </Field>

              <div>
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  {t('dialogs.createPackage.packageNature')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    <input
                      type="radio"
                      checked={packageNature === 'STANDARD'}
                      onChange={() => setPackageNature('STANDARD')}
                    />
                    {t('common.packageNature.STANDARD')}
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    <input
                      type="radio"
                      checked={packageNature === 'FRAGILE'}
                      onChange={() => setPackageNature('FRAGILE')}
                    />
                    {t('common.packageNature.FRAGILE')}
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    <input
                      type="radio"
                      checked={packageNature === 'URGENT'}
                      onChange={() => setPackageNature('URGENT')}
                    />
                    {t('common.packageNature.URGENT')}
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    <input
                      type="radio"
                      checked={packageNature === 'MORE_THAN_3000'}
                      onChange={() => setPackageNature('MORE_THAN_3000')}
                    />
                    {t('common.packageNature.MORE_THAN_3000')}
                  </label>
                </div>
              </div>

              <Field label={t('dialogs.createAnnounce.weight')}>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={t('dialogs.createAnnounce.weight')}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>
              <div>
                <div className="flex gap-4">
                  <Field label={t('dialogs.createAnnounce.pricePerKilo')}>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={pricePerKilo}
                      onChange={(e) => setPricePerKilo(e.target.value)}
                      placeholder={t('dialogs.createAnnounce.pricePerKilo')}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </Field>
                  <div className="w-32">
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      {t('dialogs.createAnnounce.currencyLabel')}
                    </label>
                    <CurrencyComboBox
                      value={currency?.code}
                      selectedCurrency={currency}
                      onChange={setCurrency}
                      placeholder={t('common.placeholders.currency')}
                      compact
                    />
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">{t('common.currencyHint')}</p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover cursor-pointer"
                  onClick={onClose}
                >
                  ‹ {t('common.back')}
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit() || submitting}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white cursor-pointer ${
                  canSubmit() && !submitting
                    ? 'bg-indigo-600 hover'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {submitting ? t('common.loadingStates.updating') : t('common.update')}
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
