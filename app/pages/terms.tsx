import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useTranslation } from 'react-i18next';

export default function TermsPrivacy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">{t('pages.terms.title')}</h1>
          <p className="mt-3 text-gray-600">{t('pages.terms.description')}</p>
          <div className="mt-6 space-y-4 text-gray-700">
            <p>{t('pages.terms.section1')}</p>
            <p>{t('pages.terms.section2')}</p>
            <p>{t('pages.terms.section3')}</p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-gray-900">{t('pages.terms.privacyTitle')}</h2>
          <p className="mt-3 text-gray-600">{t('pages.terms.privacyDescription')}</p>
          <div className="mt-6 space-y-4 text-gray-700">
            <p>{t('pages.terms.privacySection1')}</p>
            <p>{t('pages.terms.privacySection2')}</p>
            <p>{t('pages.terms.privacySection3')}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
