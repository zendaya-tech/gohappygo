import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

interface HelpCard {
  to: string;
  src: string;
  alt: string;
  // eslint-disable-next-line no-undef
  heading: React.ReactNode;
}

const CentreAide = () => {
  const { t } = useTranslation();

  // Matrice de données pour les 6 blocs du Centre d'Aide
  const helpCards: HelpCard[] = [
    {
      to: '/aide/compte-inscription',
      src: '/images/compt-et-inscription.webp',
      alt: t('helpCenter.alts.account'),
      heading: (
        <>
          {t('helpCenter.cards.account')
            .split(' & ')
            .map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <>
                    {' & '}
                    <br />
                  </>
                )}
              </span>
            ))}
        </>
      ),
    },
    {
      to: '/aide/annonces',
      src: '/images/publier-et-rechercher-annonce.webp',
      alt: t('helpCenter.alts.ads'),
      heading: (
        <>
          {t('helpCenter.cards.ads')
            .split('une annonce')
            .join('une \nannonce')
            .split('\n')
            .map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
        </>
      ),
    },
    {
      to: '/aide/messagerie',
      src: '/images/messagerie-et-communication.webp',
      alt: t('helpCenter.alts.messaging'),
      heading: (
        <>
          {t('helpCenter.cards.messaging')
            .split(' & ')
            .map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <>
                    {' & '}
                    <br />
                  </>
                )}
              </span>
            ))}
        </>
      ),
    },
    {
      to: '/aide/confidentialite',
      src: '/images/confidentialite-des-donnees.webp',
      alt: t('helpCenter.alts.privacy'),
      heading: (
        <>
          {t('helpCenter.cards.privacy')
            .split(' des ')
            .join(' \ndes ')
            .split('\n')
            .map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
        </>
      ),
    },
    {
      to: '/aide/paiement-protection',
      src: '/images/paiements-et-protection.webp',
      alt: t('helpCenter.alts.payment'),
      heading: <>{t('helpCenter.cards.payment')}</>,
    },
    {
      to: '/aide/annulation-imprevus',
      src: '/images/annulation&imprevus.webp',
      alt: t('helpCenter.alts.cancellation'),
      heading: (
        <>
          {t('helpCenter.cards.cancellation')
            .split(' & ')
            .map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <>
                    {' & '}
                    <br />
                  </>
                )}
              </span>
            ))}
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="relative grow w-full max-w-6xl mx-auto px-6 py-12 font-sans z-10 bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        {/* Hero Header Section & Search Bar */}
        <header className="mb-12 max-w-4xl text-left flex flex-col">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-600 leading-tight uppercase tracking-tight mb-4">
            {t('helpCenter.title')}
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {t('helpCenter.subtitle')}
          </h2>
        </header>
        {/* Rechercher Button Capsule */}
        <div className="flex justify-center">
          <div className="bg-blue-600 text-white font-extrabold text-lg md:text-xl tracking-wide px-16 py-2.5 rounded-full shadow-md select-none ">
            {t('helpCenter.search')}
          </div>
        </div>

        {/* The 6-Column Help Center Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16 mt-12">
          {helpCards.map((card, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <Link
                to={card.to}
                className="w-full aspect-square max-w-[240px] bg-blue-50/50 border border-blue-100/40 rounded-xl p-4 flex items-center justify-center mb-5 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-sm"
              >
                <img className="w-44 h-44 object-contain" src={card.src} alt={card.alt} />
              </Link>
              <h3 className="text-base md:text-lg font-bold text-gray-900 px-2 leading-snug tracking-tight mt-1">
                {card.heading}
              </h3>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CentreAide;
