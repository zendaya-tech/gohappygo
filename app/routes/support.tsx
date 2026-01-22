import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SupportDialog from "~/components/common/dialog/SupportDialog";
import { useTranslation } from "react-i18next";
import { useAuth } from "~/hooks/useAuth";
import { createSupportRequest } from "~/services/supportService";

export default function Support() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    category: 'GENERAL'
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      await createSupportRequest({
        email: formData.email,
        message: formData.message,
        supportCategory: formData.category as any,
        requesterType: isAuthenticated ? "USER" : "VISITOR"
      });

      setSuccess(true);
      setFormData({ email: '', message: '', category: 'GENERAL' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error: any) {
      setError(error.message || "Erreur lors de l'envoi du message.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md font-bold text-gray-900 mb-4">
            Centre d'aide GoHappyGo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nous sommes là pour vous aider ! Trouvez des réponses à vos questions ou contactez notre équipe de support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Support Info */}
          <div className="space-y-8">
            {/* Support Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Notre support 24/7
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Disponible 24h/24, 7j/7</h3>
                    <p className="text-gray-600">Notre équipe est toujours là pour vous aider, peu importe l'heure.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Réponse rapide</h3>
                    <p className="text-gray-600">Nous nous engageons à répondre à vos demandes dans les plus brefs délais.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Support multilingue</h3>
                    <p className="text-gray-600">Notre équipe parle plusieurs langues pour mieux vous servir.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Autres moyens de contact
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a href="mailto:support@gohappygo.fr" className="text-blue-600 hover:underline">
                      support@gohappygo.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">FAQ</p>
                    <a href="/faq" className="text-blue-600 hover:underline">
                      Consultez notre foire aux questions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contactez-nous
            </h2>

            {success ? (
              <div className="bg-green-50/20 border border-green-200 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Message envoyé avec succès !
                </h3>
                <p className="text-green-600">
                  Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50/20 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus"
                  >
                    <option value="GENERAL">Question générale</option>
                    <option value="TECHNICAL">Problème technique</option>
                    <option value="BILLING">Facturation</option>
                    <option value="ACCOUNT">Compte utilisateur</option>
                    <option value="BOOKING">Réservation</option>
                    <option value="OTHER">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus resize-none"
                    placeholder="Décrivez votre question ou problème en détail..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover text-white'
                  }`}
                >
                  {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setSupportDialogOpen(true)}
                    className="text-blue-600 hover text-sm font-medium transition-colors"
                  >
                    Préférez-vous utiliser notre formulaire avancé ?
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Support Dialog */}
      <SupportDialog 
        open={supportDialogOpen} 
        onClose={() => setSupportDialogOpen(false)} 
      />
    </div>
  );
}