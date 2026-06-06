import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CustomsRestrictionsMap from '~/components/CustomsRestrictionsMap';
import { useTranslation } from 'react-i18next';

const ArticlesInterdits = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="relative grow w-full max-w-6xl mx-auto px-6 py-4 font-sans z-10 bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        <header className="mb-8">
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
            {t('travelerTools.forbiddenArticles.subtitle')}
          </h2>
          <p className="text-lg md:text-xl font-bold text-gray-800 leading-relaxed max-w-2xl">
            {t('travelerTools.forbiddenArticles.description')}
          </p>
        </header>

        {/* World Map Section */}
        <CustomsRestrictionsMap />
      </main>

      <Footer />
    </div>
  );
};

export default ArticlesInterdits;
