import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import type { Route } from '../+types/root';

import { useTranslation } from 'react-i18next';

export default function AssuranceColis() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('pages.insurance.title')}</h1>
          <p className="text-gray-600 mb-8">{t('pages.insurance.subtitle')}</p>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('pages.insurance.coverage.title')}
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                {(t('pages.insurance.coverage.items', { returnObjects: true }) as string[]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('pages.insurance.exclusions.title')}
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                {(t('pages.insurance.exclusions.items', { returnObjects: true }) as string[]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('pages.insurance.claims.title')}
              </h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-1">
                {(t('pages.insurance.claims.items', { returnObjects: true }) as string[]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ol>
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
    { title: 'Assurance colis - GoHappyGo' },
    { name: 'description', content: "Informations sur l'assurance et la couverture des colis." },
  ];
};
