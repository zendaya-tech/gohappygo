import { useState, useEffect } from "react";
import { createSupportRequest, type CreateSupportRequestData } from "~/services/supportService";
import { useAuth } from "~/hooks/useAuth";
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SupportDialog({ open, onClose }: SupportDialogProps) {
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState<CreateSupportRequestData>({
    email: "",
    message: "",
    supportCategory: "GENERAL",
    requesterType: "VISITOR"
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        email: user?.email || "",
        message: "",
        supportCategory: "GENERAL",
        requesterType: isAuthenticated ? "USER" : "VISITOR"
      });
      setSuccess(false);
      setError(null);
      setSubmitting(false);
    }
  }, [open, isAuthenticated, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email.trim() || !formData.message.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createSupportRequest(formData);
      setSuccess(true);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi de votre demande.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Contactez notre support
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover hover rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            // Success state
            <div className="text-center py-8">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Message envoyé avec succès !
              </h3>
              <p className="text-gray-600 mb-4">
                Votre demande de support a été envoyée. Nous vous répondrons dans les plus brefs délais à l'adresse email fournie.
              </p>
              <p className="text-sm text-gray-500">
                Cette fenêtre se fermera automatiquement...
              </p>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus transition-colors"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="supportCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  id="supportCategory"
                  name="supportCategory"
                  value={formData.supportCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus transition-colors"
                >
                  <option value="GENERAL">Question générale</option>
                  <option value="TECHNICAL">Problème technique</option>
                  <option value="BILLING">Facturation</option>
                  <option value="FINANCIAL">Financier</option>
                  <option value="INFORMATIONAL">Information</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus transition-colors resize-none"
                  placeholder="Décrivez votre demande en détail..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.message.length}/1000 caractères
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover"
                  }`}
                >
                  {submitting ? "Envoi en cours..." : "Envoyer"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}