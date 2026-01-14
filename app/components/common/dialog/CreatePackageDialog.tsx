import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { createDemand } from "../../../services/transportService";
import AirportComboBox from "../AirportComboBox";
import CurrencyComboBox from "../CurrencyComboBox";
import type { Airport } from "../../../services/airportService";
import type { Currency } from "../../../services/currencyService";
import { useAuth } from "../../../hooks/useAuth";

export default function CreatePackageDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: General
  const [departureAirport, setDepartureAirport] = useState<Airport | null>(
    null
  );
  const [arrivalAirport, setArrivalAirport] = useState<Airport | null>(null);
  const [baggageDescription, setBaggageDescription] = useState("");

  // Step 2: Photos (now requires 3 images)
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Price & Booking (moved from step 3 to step 2)
  const [weight, setWeight] = useState("");
  const [pricePerKilo, setPricePerKilo] = useState("");
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [flightNumber, setFlightNumber] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [packageNature, setPackageNature] = useState<
    "FRAGILE" | "URGENT" | "STANDARD" | "MORE_THAN_3000"
  >("STANDARD");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setCurrentStep(1);
    setDepartureAirport(null);
    setArrivalAirport(null);
    setBaggageDescription("");
    setPhotos([]);
    setWeight("");
    setPricePerKilo("");
    setCurrency(user?.recentCurrency ?? null);
    setFlightNumber("");
    setTravelDate("");
    setPackageNature("STANDARD");
    setSubmitting(false);
    setError(null);
    setSuccess(null);
    setValidationErrors({});
  }, [open, user?.recentCurrency]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setPhotos((prev) => {
      const remainingSlots = Math.max(0, 3 - prev.length);
      const filesToAdd = selectedFiles.slice(0, remainingSlots);
      return [...prev, ...filesToAdd];
    });
    // Reset input so same file can be chosen again after removing
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!departureAirport)
          errors.departure = "Veuillez sélectionner un aéroport de départ";
        if (!arrivalAirport)
          errors.arrival = "Veuillez sélectionner un aéroport d'arrivée";
        if (!baggageDescription.trim())
          errors.description = "Veuillez décrire votre baggage";
        if (baggageDescription.length > 500)
          errors.description =
            "La description ne peut pas dépasser 500 caractères";
        if (!flightNumber.trim())
          errors.flightNumber = "Veuillez saisir le numéro de vol";
        if (!travelDate)
          errors.travelDate = "Veuillez sélectionner une date de voyage";
        break;
      case 2:
        if (photos.length < 3)
          errors.photos = "Veuillez ajouter 3 images de votre baggage";
        if (!weight || parseFloat(weight) <= 0)
          errors.weight = "Veuillez saisir un poids valide";
        if (!pricePerKilo || parseFloat(pricePerKilo) <= 0)
          errors.price = "Veuillez saisir un prix valide";
        if (!currency) errors.currency = "Veuillez sélectionner une devise";
        break;
    }

    return errors;
  };

  const nextStep = () => {
    const errors = validateCurrentStep();
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (currentStep < 2) setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({}); // Clear errors when going back
    }
  };

  const canProceedToNext = () => {
    // Always return true to keep button active
    return true;
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return (
          !!departureAirport &&
          !!arrivalAirport &&
          !!flightNumber.trim() &&
          !!travelDate &&
          !!baggageDescription.trim() &&
          baggageDescription.length <= 500
        );
      case 2:
        return (
          photos.length === 3 &&
          !!weight &&
          parseFloat(weight) > 0 &&
          !!pricePerKilo &&
          parseFloat(pricePerKilo) > 0 &&
          !!currency
        );
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

    if (photos.length < 3) {
      setError("Veuillez ajouter 3 images");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!departureAirport || !arrivalAirport) {
        setError("Veuillez sélectionner les aéroports de départ et d'arrivée");
        setSubmitting(false);
        return;
      }

      if (!currency) {
        setError("Veuillez sélectionner une devise");
        setSubmitting(false);
        return;
      }

      const demandData = {
        flightNumber,
        description: baggageDescription,
        departureAirportId: departureAirport.id,
        arrivalAirportId: arrivalAirport.id,
        travelDate,
        weight: parseFloat(weight),
        pricePerKg: parseFloat(pricePerKilo),
        currencyId: parseInt(currency.id),
        packageKind: packageNature,
        image1: photos[0],
        image2: photos[1],
        image3: photos[2],
      };

      const result = await createDemand(demandData);

      if (result) {
        setSuccess("Demande de voyage créée avec succès!");
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(
          "Erreur lors de la création de la demande. Veuillez réessayer."
        );
      }
    } catch (err: any) {
      // Check if it's a 401 error (user not authenticated)
      if (err?.response?.status === 401 || err?.status === 401) {
        setError(
          "Vous devez être connecté pour créer une demande de voyage. Veuillez vous connecter."
        );
      } else {
        // Handle validation errors from backend
        if (err?.response?.data?.message) {
          if (Array.isArray(err.response.data.message)) {
            setError(err.response.data.message.join(", "));
          } else {
            setError(err.response.data.message);
          }
        } else {
          setError(
            "Erreur lors de la création de la demande. Veuillez réessayer."
          );
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
      <div className="relative z-10 mt-4 md:mt-10 w-full max-w-6xl overflow-hidden rounded-2xl md:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 h-[95vh] md:max-h-[85vh] flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-0 flex-1">
          {/* Sidebar steps */}
          <aside className="border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 p-4 md:p-6 overflow-y-auto">
            <StepsNavPackage step={currentStep as 1 | 2} />
          </aside>

          {/* Content */}
          <section className="p-4 md:p-6 overflow-y-auto min-h-0">
            <header className="mb-4 md:mb-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                {" "}
                <span className="uppercase text-sm md:text-base">
                  {t("dialogs.createPackage.title")}
                </span>
                <span className="text-sm md:text-base">
                  {" "}
                  - {t("common.step")} {currentStep} {t("common.of")} 2
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

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <AirportComboBox
                    label={t("dialogs.createAnnounce.departure")}
                    value={departureAirport?.code}
                    onChange={setDepartureAirport}
                    placeholder={t("dialogs.createAnnounce.departure")}
                  />
                  {validationErrors.departure && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.departure}
                    </p>
                  )}
                </div>

                <div>
                  <AirportComboBox
                    label={t("dialogs.createAnnounce.arrival")}
                    value={arrivalAirport?.code}
                    onChange={setArrivalAirport}
                    placeholder={t("dialogs.createAnnounce.arrival")}
                  />
                  {validationErrors.arrival && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.arrival}
                    </p>
                  )}
                </div>

                <Field label={t("dialogs.createAnnounce.flightNumber")}>
                  <input
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder={t("dialogs.createAnnounce.flightNumber")}
                    className={`w-full uppercase rounded-xl border ${
                      validationErrors.flightNumber
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                    } bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2`}
                  />
                  {validationErrors.flightNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.flightNumber}
                    </p>
                  )}
                </Field>

                <Field label={t("dialogs.createAnnounce.travelDate")}>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={today} // This prevents selecting past dates
                    className={`w-full rounded-xl border ${
                      validationErrors.travelDate
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                    } bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2`}
                  />
                  {validationErrors.travelDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.travelDate}
                    </p>
                  )}
                  {travelDate && travelDate < today && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      La date ne peut pas être dans le passé.
                    </p>
                  )}
                </Field>

                <Field label={t("dialogs.createAnnounce.story")}>
                  <textarea
                    value={baggageDescription}
                    onChange={(e) => {
                      // Allow typing beyond 500 characters but show validation

                      setBaggageDescription(e.target.value);
                    }}
                    rows={5}
                    placeholder={t("dialogs.createAnnounce.story")}
                    className={`w-full resize-none rounded-xl border ${
                      validationErrors.description ||
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
                  {validationErrors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.description}
                    </p>
                  )}
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
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {t("dialogs.createAnnounce.photos")}
                </p>
                <label className="block cursor-pointer rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={photos.length >= 3}
                  />
                  {t("common.upload")} ({photos.length}/3)
                </label>
                {validationErrors.photos && (
                  <p className="text-sm text-red-600">
                    {validationErrors.photos}
                  </p>
                )}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                      >
                        <button
                          onClick={() => removePhoto(idx)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg z-10"
                          title="Remove image"
                        >
                          −
                        </button>
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2">
                          <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                            {photo.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Field label={t("dialogs.createAnnounce.weight")}>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={t("dialogs.createAnnounce.weight")}
                    className={`w-full rounded-xl border ${
                      validationErrors.weight
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                    } bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2`}
                  />
                  {validationErrors.weight && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.weight}
                    </p>
                  )}
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
                        className={`w-full rounded-xl border ${
                          validationErrors.price
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                        } bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2`}
                      />
                      {validationErrors.price && (
                        <p className="mt-1 text-sm text-red-600">
                          {validationErrors.price}
                        </p>
                      )}
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
                      {validationErrors.currency && (
                        <p className="mt-1 text-sm text-red-600">
                          {validationErrors.currency}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Cette devise sera utilisée pour tous les montants
                  </p>
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => (currentStep > 1 ? prevStep() : onClose())}
                >
                  ‹ {t("common.back")}
                </button>
                <button className="text-sm text-gray-500">
                  {t("common.save")} {t("common.as")} {t("common.unfinished")}
                </button>
              </div>
              {currentStep < 2 ? (
                <button
                  onClick={nextStep}
                  // Button is disabled if step is not complete
                  disabled={!isStepComplete()}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors ${
                    isStepComplete()
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  }`}
                >
                  {t("common.next")} ›
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  // Button is disabled if submitting OR step 2 is incomplete
                  disabled={submitting || !isStepComplete()}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white ${
                    !submitting && isStepComplete()
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {submitting
                    ? "Création en cours..."
                    : t("dialogs.createAnnounce.create")}
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StepsNavPackage({ step }: { step: 1 | 2 }) {
  const Item = ({
    index,
    title,
    subtitle,
  }: {
    index: 1 | 2;
    title: string;
    subtitle: string;
  }) => (
    <div className="flex items-start gap-3 py-4">
      <div
        className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
          index <= step
            ? "border-green-500 text-green-600"
            : "border-gray-300 text-gray-400"
        }`}
      >
        {index <= step ? (
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span className="h-2 w-2 rounded-full bg-gray-300"></span>
        )}
      </div>
      <div>
        <div
          className={`text-base font-semibold ${
            index <= step ? "text-gray-900 dark:text-white" : "text-gray-400"
          }`}
        >
          {title}
        </div>
        <div className="text-sm text-gray-400">{subtitle}</div>
      </div>
    </div>
  );

  return (
    <div>
      <Item index={1} title="General" subtitle="Select basic settings" />
      <div className="ml-2 h-6 w-px bg-gray-200 dark:bg-gray-800" />
      <Item
        index={2}
        title="Pictures & Price"
        subtitle="Add photos and set price"
      />
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
