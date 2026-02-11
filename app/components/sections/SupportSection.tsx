import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router';
import { useAuth } from '~/hooks/useAuth';
import { createSupportRequest } from '~/services/supportService';
import SupportDialog from '~/components/dialogs/SupportDialog';

export default function SupportSection() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [quickFormData, setQuickFormData] = useState({
    email: '',
    message: '',
  });
  const [quickFormSubmitting, setQuickFormSubmitting] = useState(false);
  const [quickFormSuccess, setQuickFormSuccess] = useState(false);
  const [quickFormError, setQuickFormError] = useState<string | null>(null);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);

  const handleQuickFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quickFormData.email.trim() || !quickFormData.message.trim()) {
      setQuickFormError(t('home.supportSection.errors.fillAll'));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(quickFormData.email)) {
      setQuickFormError(t('home.supportSection.errors.invalidEmail'));
      return;
    }

    setQuickFormSubmitting(true);
    setQuickFormError(null);

    try {
      await createSupportRequest({
        email: quickFormData.email,
        message: quickFormData.message,
        supportCategory: 'GENERAL',
        requesterType: isAuthenticated ? 'USER' : 'VISITOR',
      });

      setQuickFormSuccess(true);
      setQuickFormData({ email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setQuickFormSuccess(false);
      }, 5000);
    } catch (error: any) {
      setQuickFormError(error.message || t('home.supportSection.errors.sendError'));
    } finally {
      setQuickFormSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuickFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (quickFormError) {
      setQuickFormError(null);
    }
  };

  return (
    <section className="px-4 py-12 mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        <Trans
          i18nKey="home.supportSection.title"
          components={{ span: <span className="text-blue-600" /> }}
        />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-600 flex flex-col justify-between text-white p-8 rounded-2xl min-h-[220px]">
          <h3 className="text-xl font-bold mb-4">{t('home.supportSection.support247.title')}</h3>
          <p className="text-blue-100 text-2xl mb-6">
            {t('home.supportSection.support247.description')}
          </p>
          <Link
            to="/support"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover transition-colors text-center"
          >
            {t('home.supportSection.support247.cta')}
          </Link>
        </div>

        <Link
          to="/assurance-colis"
          className="bg-gray-900 flex flex-col justify-between text-white p-8 rounded-2xl min-h-[220px]"
        >
          <h3 className="text-xl font-bold mb-4">{t('home.supportSection.insurance.title')}</h3>
          <p className="text-gray-300 text-2xl mb-6">
            {t('home.supportSection.insurance.description')}
          </p>
        </Link>

        <div className="bg-gray-100 col-span-1 md:col-span-2 flex flex-col justify-between text-gray-900 p-6 md:p-8 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 uppercase">
            {t('home.supportSection.online.title')}
          </h3>
          <p className="text-gray-800 mb-6 text-xl md">
            {t('home.supportSection.online.description')}
          </p>

          {quickFormSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-green-800 font-medium">
                {t('home.supportSection.successMessage')}
              </p>
              <p className="text-green-600 text-sm mt-1">{t('home.supportSection.successDesc')}</p>
            </div>
          ) : (
            <form onSubmit={handleQuickFormSubmit} className="flex flex-col gap-3">
              {quickFormError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{quickFormError}</p>
                </div>
              )}

              <div>
                <label htmlFor="support-email" className="sr-only">
                  Email
                </label>
                <input
                  id="support-email"
                  name="email"
                  type="email"
                  value={quickFormData.email}
                  onChange={handleInputChange}
                  placeholder="Votre email"
                  className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label htmlFor="support-message" className="sr-only">
                  {t('home.supportSection.online.placeholder')}
                </label>
                <input
                  id="support-message"
                  name="message"
                  type="text"
                  value={quickFormData.message}
                  onChange={handleInputChange}
                  placeholder={t('home.supportSection.online.placeholder')}
                  className="flex-1 px-4 py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={quickFormSubmitting}
                  className={`px-5 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                    quickFormSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-slate-800 text-white hover'
                  }`}
                >
                  {quickFormSubmitting
                    ? t('home.supportSection.submitting')
                    : t('home.supportSection.online.send')}
                </button>
              </div>

              <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setSupportDialogOpen(true)}
                  className="text-blue-600 hover text-sm font-medium transition-colors text-left cursor-pointer"
                >
                  {t('home.supportSection.detailedHelp')}
                </button>
                <Link
                  to="/support"
                  className="text-blue-600 hover text-sm font-medium transition-colors"
                >
                  {t('home.supportSection.learnMore')}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Support Dialog */}
      <SupportDialog open={supportDialogOpen} onClose={() => setSupportDialogOpen(false)} />
    </section>
  );
}
