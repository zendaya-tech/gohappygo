import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateDemand } from "../../../services/transportService";
import AirportComboBox from "../AirportComboBox";
import CurrencyComboBox from "../CurrencyComboBox";
import type { Airport } from "../../../services/airportService";
import type { Currency } from "../../../services/currencyService";
import { useAuth } from "../../../hooks/useAuth";
import type { DemandTravelItem } from "../../../services/announceService";

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
  const [baggageDescription, setBaggageDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [pricePerKilo, setPricePerKilo] = useState("");
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [flightNumber, setFlightNumber] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [packageNature, setPackageNature] = useState<
    "FRAGILE" | "URGENT" | "STANDARD" | "MORE_THAN_3000"
  >("STANDARD");

  // API state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
    setBaggageDescription(demand.description || "");
    setWeight(demand.weight?.toString() || "");
    const priceValue = typeof demand.pricePerKg === 'string' ? parseFloat(demand.pricePerKg) : demand.pricePerKg;
    setPricePerKilo(priceValue?.toString() || "");
    
    // Set currency - use user's recent currency as fallback since demand doesn't have currency info
    const defaultCurrency = user?.recentCurrency ? {
      ...user.recentCurrency,
      id: user.recentCurrency.id.toString(),
      country: ""
    } : null;
    setCurrency(defaultCurrency);
    
    setFlightNumber(demand.flightNumber || "");
    
    // Set travel date
    if (demand.deliveryDate || demand.travelDate) {
      const dateString = demand.deliveryDate || demand.travelDate;
      if (dateString) {
        const date = new Date(dateString);
        setTravelDate(date.toISOString().split('T')[0]);
      }
    }
    
    // Set package nature - map from backend values
    const backendPackageKind = (demand as any).packageKind || "STANDARD";
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
        setError("Veuillez sélectionner les aéroports de départ et d'arrivée");
        setSubmitting(false);
        return;
      }

      if (!currency) {
        setError("Veuillez sélectionner une devise");
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
        setSuccess("Demande de voyage mise à jour avec succès!");
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        setError("Erreur lors de la mise à jour de la demande. Veuillez réessayer.");
      }
    } catch (err: any) {
      // Check if it's a 401 error (user not authenticated)
      if (err?.response?.status === 401 || err?.status === 401) {
        setError("Vous devez être connecté pour modifier une demande de voyage. Veuillez vous connecter.");
      } else {
        // Handle validation errors from backend
        if (err?.response?.data?.message) {
          if (Array.isArray(err.response.data.message)) {
            setError(err.response.data.message.join(", "));
          } else {
            setError(err.response.data.message);
          }
        } else {
          setError("Erreur lors de la mise à jour de la demande. Veuillez réessayer.");
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
      <div className="relative z-10 mt-4 md:mt-10 w-full max-w-4xl overflow-hidden rounded-2xl md:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 h-[95vh] md:max-h-[85vh] flex flex-col">
        <div className="flex flex-col min-h-0 flex-1">
          {/* Content */}
          <section className="p-4 md:p-6 overflow-y-auto min-h-0">
            <header className="mb-4 md:mb-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                <span className="uppercase text-sm md:text-base">
                  Modifier la demande de voyage
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

            <div className="space-y-6">
              <AirportComboBox
                label={t("dialogs.createAnnounce.departure")}
                value={departureAirportId ?? undefined}
                onChange={setDepartureAirportId}
                placeholder={t("dialogs.createAnnounce.departure")}
              />
              <AirportComboBox
                label={t("dialogs.createAnnounce.arrival")}
                value={arrivalAirportId ?? undefined}
                onChange={setArrivalAirportId}
                placeholder={t("dialogs.createAnnounce.arrival")}
              />

              <Field label={t("dialogs.createAnnounce.flightNumber")}>
                <input
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder={t("dialogs.createAnnounce.flightNumber")}
                  className="w-full uppercase rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>
              <Field label={t("dialogs.createAnnounce.travelDate")}>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>

              <Field label={t("dialogs.createAnnounce.story")}>
                <textarea
                  value={baggageDescription}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setBaggageDescription(e.target.value);
                    }
                  }}
                  rows={5}
                  placeholder={t("dialogs.createAnnounce.story")}
                  className={`w-full resize-none rounded-xl border ${
                    baggageDescription.length > 500
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                  } bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2`}
                />
                <div
                  className={`mt-1 text-xs ${
                    baggageDescription.length > 500
                      ? "text-red-500 font-semibold"
                      : baggageDescription.length > 450
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                >
                  {baggageDescription.length}/500 caractères
                </div>
              </Field>

              <div>
                <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                  Nature du baggage
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      checked={packageNature === "STANDARD"}
                      onChange={() => setPackageNature("STANDARD")}
                    />
                    Standard
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      checked={packageNature === "FRAGILE"}
                      onChange={() => setPackageNature("FRAGILE")}
                    />
                    Fragile
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      checked={packageNature === "URGENT"}
                      onChange={() => setPackageNature("URGENT")}
                    />
                    Urgent
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      checked={packageNature === "MORE_THAN_3000"}
                      onChange={() => setPackageNature("MORE_THAN_3000")}
                    />
                    Valeur supérieure à 3000 €
                  </label>
                </div>
              </div>

              <Field label={t("dialogs.createAnnounce.weight")}>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={t("dialogs.createAnnounce.weight")}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </Field>
              <div>
                <div className="flex gap-4">
                  <Field label={t("dialogs.createAnnounce.pricePerKilo")}>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={pricePerKilo}
                      onChange={(e) => setPricePerKilo(e.target.value)}
                      placeholder={t("dialogs.createAnnounce.pricePerKilo")}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </Field>
                  <div className="w-32">
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
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
                <p className="mt-1 text-xs text-gray-500">
                  Cette devise sera utilisée pour tous les montants
                </p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={onClose}
                >
                  ‹ {t("common.back")}
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit() || submitting}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white ${
                  canSubmit() && !submitting
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {submitting ? "Mise à jour en cours..." : "Update"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
        {label}
      </label>
      {children}
    </div>
  );
}