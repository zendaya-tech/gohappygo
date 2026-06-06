import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const BonnesPratiques = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {t('travelerTools.goodPractices.subtitle')}
          </h2>
        </header>

        <div className="space-y-8 text-gray-700 font-medium">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              {t('travelerTools.goodPractices.sections.register.title')}
            </h3>
            <p className="ml-5 leading-relaxed">
              {t('travelerTools.goodPractices.sections.register.description')}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              {t('travelerTools.goodPractices.sections.announce.title')}
            </h3>
            <p className="ml-5 leading-relaxed">
              {t('travelerTools.goodPractices.sections.announce.description')}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              {t('travelerTools.goodPractices.sections.customs.title')}
            </h3>
            <p className="ml-5 leading-relaxed">
              {t('travelerTools.goodPractices.sections.customs.description')}
              <Link to="/articles-interdits" className="text-blue-600 font-bold hover:underline">
                {t('travelerTools.goodPractices.sections.customs.link')}
              </Link>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              {t('travelerTools.goodPractices.sections.messaging.title')}
            </h3>
            <p className="ml-5 leading-relaxed">
              {t('travelerTools.goodPractices.sections.messaging.description')}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              {t('travelerTools.goodPractices.sections.punctuality.title')}
            </h3>
            <p className="ml-5 leading-relaxed">
              {t('travelerTools.goodPractices.sections.punctuality.description')}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              {t('travelerTools.goodPractices.sections.selfie.title')}
            </h3>
            <p className="ml-5 leading-relaxed">
              {t('travelerTools.goodPractices.sections.selfie.description')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BonnesPratiques;
