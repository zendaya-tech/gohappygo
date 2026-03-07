import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AirportComboBox from '~/components/forms/AirportComboBox';
import { createAlert, type CreateAlertData } from '~/services/alertService';
import { useTranslation } from 'react-i18next';

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
    alertType: 'TRAVEL' as 'DEMAND' | 'TRAVEL' | 'BOTH',
    departureAirportId: null as number | null,
    arrivalAirportId: null as number | null,
    travelDateTime: '',
    flightNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { t } = useTranslation();

  // Initialize form with initial data
  useEffect(() => {
    if (open && initialData) {
      // Convert date to date format if provided (without time)
      let dateValue = '';
      if (initialData.date) {
        try {
          const date = new Date(initialData.date);
          // Format to date only (YYYY-MM-DD)
          dateValue = date.toISOString().slice(0, 10);
        } catch (error) {
          console.error('Error parsing date:', error);
        }
      }

      setFormData((prev) => ({
        ...prev,
        departureAirportId: initialData.from ? parseInt(initialData.from) : null,
        arrivalAirportId: initialData.to ? parseInt(initialData.to) : null,
        travelDateTime: dateValue,
        flightNumber: initialData.flight || '',
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
        setError(t('dialogs.createAlert.errors.airportsRequired'));
        return;
      }

      const alertData: CreateAlertData = {
        alertType: formData.alertType,
        departureAirportId: formData.departureAirportId,
        arrivalAirportId: formData.arrivalAirportId,
        travelDateTime: formData.travelDateTime
          ? new Date(formData.travelDateTime + 'T00:00:00').toISOString()
          : undefined,
        flightNumber: formData.flightNumber || undefined,
      };

      await createAlert(alertData);
      setSuccess(t('dialogs.createAlert.successMessage'));

      setTimeout(() => {
        onSuccess?.();
        onClose();
        // Reset form
        setFormData({
          alertType: 'TRAVEL',
          departureAirportId: null,
          arrivalAirportId: null,
          travelDateTime: '',
          flightNumber: '',
        });
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('dialogs.createAlert.errors.createFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {t('dialogs.createAlert.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover transition-colors cursor-pointer"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50/20 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50/20 border border-green-200 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Alert Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dialogs.createAlert.alertTypeLabel')}
                </label>
                <select
                  value={formData.alertType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      alertType: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TRAVEL">
                    {t('dialogs.createAlert.alertType.travelOnly')}
                  </option>
                  <option value="DEMAND">
                    {t('dialogs.createAlert.alertType.demandOnly')}
                  </option>
                  <option value="BOTH">
                    {t('dialogs.createAlert.alertType.both')}
                  </option>
                </select>
              </div>

              {/* Departure Airport */}
              <div>
                <AirportComboBox
                  label={t('dialogs.createAlert.departureAirportLabel')}
                  value={formData.departureAirportId ?? undefined}
                  onChange={(airportId) =>
                    setFormData((prev) => ({
                      ...prev,
                      departureAirportId: airportId,
                    }))
                  }
                  placeholder={t('dialogs.createAlert.departureAirportPlaceholder')}
                />
              </div>

              {/* Arrival Airport */}
              <div>
                <AirportComboBox
                  label={t('dialogs.createAlert.arrivalAirportLabel')}
                  value={formData.arrivalAirportId ?? undefined}
                  onChange={(airportId) =>
                    setFormData((prev) => ({
                      ...prev,
                      arrivalAirportId: airportId,
                    }))
                  }
                  placeholder={t('dialogs.createAlert.arrivalAirportPlaceholder')}
                />
              </div>

              {/* Travel Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dialogs.createAlert.travelDateLabel')}
                </label>
                <input
                  type="date"
                  value={formData.travelDateTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      travelDateTime: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Flight Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dialogs.createAlert.flightNumberLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('dialogs.createAlert.flightNumberPlaceholder')}
                  value={formData.flightNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      flightNumber: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover transition-colors cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    loading
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-blue-600 text-white hover'
                  }`}
                >
                  {loading ? t('dialogs.createAlert.submitting') : t('dialogs.createAlert.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
