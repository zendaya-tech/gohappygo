import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const OutilVoyageur = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="relative grow w-full max-w-6xl mx-auto px-6 py-4 mb-16 font-sans z-10 bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        {/* Header Section */}
        <header className="mb-20 max-w-4xl text-left">
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
            {t('travelerTools.main.subtitle')}
          </h2>

          <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed max-w-3xl">
            {t('travelerTools.main.description')}
          </p>
        </header>

        {/* 3 Columns Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mt-16">
          {/* Column 1 */}
          <div className="flex flex-col items-center text-center">
            <Link
              to="/bonnes-pratiques"
              className="h-40 flex items-center justify-center mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                className="w-55 h-55"
                src="/images/bonnesPratiques-removebg-preview.webp"
                alt={t('travelerTools.main.sections.goodPractices.title')}
              />
            </Link>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4">
              {t('travelerTools.main.sections.goodPractices.title')
                .split(' ')
                .map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i === 1 && <br />}
                    {i !== 1 && i < arr.length - 1 && ' '}
                  </span>
                ))}
            </h3>
            <p className="text-sm font-medium text-gray-600 leading-relaxed px-2">
              {t('travelerTools.main.sections.goodPractices.description')}
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center text-center">
            <Link
              to="/articles-interdits"
              className="h-40 flex items-center justify-center mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                className="w-55 h-55"
                src="/images/articlesInterdits-removebg-preview.webp"
                alt={t('travelerTools.main.sections.forbiddenArticles.title')}
              />
            </Link>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4">
              {t('travelerTools.main.sections.forbiddenArticles.title')
                .split('/')
                .join('/\n')
                .split('\n')
                .map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <br />}
                    {i < arr.length - 1 && part.endsWith('/') ? '' : ''}
                  </span>
                ))}
            </h3>
            <p className="text-sm font-medium text-gray-600 leading-relaxed px-2">
              {t('travelerTools.main.sections.forbiddenArticles.description')}
            </p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center text-center">
            <Link
              to="/securite-et-accompagnement"
              className="h-40 flex items-center justify-center mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                className="w-55 h-55"
                src="/images/securiteAccompagnements-removebg-preview.webp"
                alt={t('travelerTools.main.sections.security.title')}
              />
            </Link>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4">
              {t('travelerTools.main.sections.security.title')
                .split(' et ')
                .join(' et\n')
                .split('\n')
                .map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
            </h3>
            <p className="text-sm font-medium text-gray-600 leading-relaxed px-2">
              {t('travelerTools.main.sections.security.description')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OutilVoyageur;
