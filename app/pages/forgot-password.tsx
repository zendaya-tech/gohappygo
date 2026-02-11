import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useState } from 'react';
import { forgotPassword } from '~/services/authService';
import { Link } from 'react-router';
import { useTranslation, Trans } from 'react-i18next';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || t('pages.forgotPassword.errorDefault'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">{t('pages.forgotPassword.title')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('pages.forgotPassword.subtitle')}</p>

          {sent ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-green-50 p-4 text-green-700">
                <Trans
                  i18nKey="pages.forgotPassword.sentMessage"
                  values={{ email }}
                  components={{ strong: <strong /> }}
                />
              </div>
              <Link
                to="/reset-password"
                className="block w-full text-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                {t('pages.forgotPassword.resetLink')}
              </Link>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('pages.forgotPassword.emailLabel')}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 placeholder-gray-400 focus focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  placeholder={t('pages.forgotPassword.emailPlaceholder')}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('pages.forgotPassword.submitting') : t('pages.forgotPassword.submit')}
              </button>
              <div className="text-center">
                <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-700">
                  {t('pages.forgotPassword.backHome')}
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
