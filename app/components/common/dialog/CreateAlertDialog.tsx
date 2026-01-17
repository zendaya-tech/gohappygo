import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import AirportComboBox from "../AirportComboBox";
import { createAlert, type CreateAlertData } from "~/services/alertService";
import type { Airport } from "~/services/airportService";

interface CreateAlertDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: {
    from?: string;
    to?: string;
    date?: string;
    flight?: string;
  };
  onSuccess?: () => void;
}

export default function CreateAlertDialog({
  open,
  onClose,
  initialData,
  onSuccess,
}: CreateAlertDialogProps) {
  const [formData, setFormData] = useState({
    alertType: "TRAVEL" as "DEMAND" | "TRAVEL" | "BOTH",
    departureAirportId: null as number | null,
    arrivalAirportId: null as number | null,
    travelDateTime: "",
    flightNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form with initial data
  useEffect(() => {
    if (open && initialData) {
      // Convert date to datetime-local format if provided
      let dateTimeValue = "";
      if (initialData.date) {
        try {
          const date = new Date(initialData.date);
          // Format to datetime-local (YYYY-MM-DDTHH:MM)
          dateTimeValue = date.toISOString().slice(0, 16);
        } catch (error) {
          console.error("Error parsing date:", error);
        }
      }

      setFormData((prev) => ({
        ...prev,
        travelDateTime: dateTimeValue,
        flightNumber: initialData.flight || "",
      }));
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation: Both airports are required
      if (!formData.departureAirportId || !formData.arrivalAirportId) {
        setError("Les aéroports de départ et d'arrivée sont obligatoires.");
        return;
      }

      const alertData: CreateAlertData = {
        alertType: formData.alertType,
        departureAirportId: formData.departureAirportId,
        arrivalAirportId: formData.arrivalAirportId,
        travelDateTime: formData.travelDateTime
          ? new Date(formData.travelDateTime).toISOString()
          : undefined,
        flightNumber: formData.flightNumber || undefined,
      };

      await createAlert(alertData);
      setSuccess(
        "Alerte créée avec succès ! Vous serez notifié dès qu'une offre correspond."
      );

      setTimeout(() => {
        onSuccess?.();
        onClose();
        // Reset form
        setFormData({
          alertType: "TRAVEL",
          departureAirportId: null,
          arrivalAirportId: null,
          travelDateTime: "",
          flightNumber: "",
        });
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de l'alerte");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Créer une alerte
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Alert Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type d'alerte
                </label>
                <select
                  value={formData.alertType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      alertType: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TRAVEL">Voyages uniquement</option>
                  <option value="DEMAND">Demandes uniquement</option>
                  <option value="BOTH">Voyages et demandes</option>
                </select>
              </div>

              {/* Departure Airport */}
              <div>
                <AirportComboBox
                  label="Aéroport de départ *"
                  value={formData.departureAirportId ?? undefined}
                  onChange={(airportId) =>
                    setFormData((prev) => ({
                      ...prev,
                      departureAirportId: airportId,
                    }))
                  }
                  placeholder="Rechercher un aéroport de départ"
                />
              </div>

              {/* Arrival Airport */}
              <div>
                <AirportComboBox
                  label="Aéroport d'arrivée *"
                  value={formData.arrivalAirportId ?? undefined}
                  onChange={(airportId) =>
                    setFormData((prev) => ({
                      ...prev,
                      arrivalAirportId: airportId,
                    }))
                  }
                  placeholder="Rechercher un aéroport d'arrivée"
                />
              </div>

              {/* Travel Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de voyage (optionnel)
                </label>
                <input
                  type="datetime-local"
                  value={formData.travelDateTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      travelDateTime: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Flight Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Numéro de vol (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: AF123"
                  value={formData.flightNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      flightNumber: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    loading
                      ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Création..." : "Créer l'alerte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
