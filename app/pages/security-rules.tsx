import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import type { Route } from '../+types/root';

import { useTranslation } from 'react-i18next';

export default function SecurityRules() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('pages.security.title')}</h1>
          <p className="text-gray-600 mb-8">{t('pages.security.subtitle')}</p>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('pages.security.items.allowedItems.title')}
              </h2>
              <p className="text-gray-700">{t('pages.security.items.allowedItems.desc')}</p>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('pages.security.items.identityVerification.title')}
              </h2>
              <p className="text-gray-700">{t('pages.security.items.identityVerification.desc')}</p>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('pages.security.items.packaging.title')}
              </h2>
              <p className="text-gray-700">{t('pages.security.items.packaging.desc')}</p>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('pages.security.items.payment.title')}
              </h2>
              <p className="text-gray-700">{t('pages.security.items.payment.desc')}</p>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('pages.security.items.communication.title')}
              </h2>
              <p className="text-gray-700">{t('pages.security.items.communication.desc')}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Règles de sécurité - GoHappyGo' },
    {
      name: 'description',
      content: 'Consignes et bonnes pratiques de sécurité pour les échanges sur GoHappyGo.',
    },
  ];
};
