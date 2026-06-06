import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const SecuriteEtAccompagnement = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden  md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="relative grow w-full max-w-4xl mx-auto px-6 py-4 font-sans z-10 bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-600 leading-tight uppercase tracking-tight mb-6">
            {t('travelerTools.common.title')
              .split(' POUR ')
              .join(' POUR\n')
              .split('\n')
              .map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
          </h1>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            {t('travelerTools.security.subtitle')}
          </h2>
          <p className="text-lg md:text-xl font-bold text-gray-800 leading-relaxed max-w-2xl">
            {t('travelerTools.security.intro')}
          </p>
        </header>

        <div className="space-y-10 text-gray-700 font-medium">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              {t('travelerTools.security.checkIn.title')}
            </h3>
            <p className="ml-5 leading-relaxed">
              {t('travelerTools.security.checkIn.description')}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              {t('travelerTools.security.payment.title')}
            </h3>
            <div className="ml-5 space-y-4">
              <p className="leading-relaxed">
                <span className="font-bold text-gray-900">
                  {t('travelerTools.security.payment.bold')}
                </span>{' '}
                {t('travelerTools.security.payment.p1')}
              </p>
              <p className="leading-relaxed">{t('travelerTools.security.payment.p2')}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              {t('travelerTools.security.report.title')}
            </h3>
            <div className="ml-5 space-y-4">
              <p className="leading-relaxed">
                {t('travelerTools.security.report.description')}
                <Link to="/support" className="text-blue-600 font-bold hover:underline">
                  {t('travelerTools.security.report.link')}
                </Link>
                .
              </p>
              <div>
                <p className="mb-2">{t('travelerTools.security.report.listTitle')}</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>{t('travelerTools.security.report.items.selfie')}</li>
                  <li>{t('travelerTools.security.report.items.payment')}</li>
                  <li>{t('travelerTools.security.report.items.pressure')}</li>
                  <li>{t('travelerTools.security.report.items.content')}</li>
                  <li>{t('travelerTools.security.report.items.behavior')}</li>
                </ul>
              </div>
              <p className="leading-relaxed">{t('travelerTools.security.report.footer')}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SecuriteEtAccompagnement;
