import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router';

const OutilVoyageur = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Header />

      <main className="relative flex-grow w-full max-w-6xl mx-auto px-6 py-16 md:py-24 font-sans z-10">
        {/* Header Section */}
        <header className="mb-20 max-w-4xl text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2f4cb0] leading-tight uppercase tracking-tight mb-6">
            OUTILS POUR
            <br />
            LES HAPPYVOYAGEURS
          </h1>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Gagnez en confiance et en bonheur
          </h2>

          <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed max-w-3xl">
            Vous trouverez ici toutes les ressources essentielles pour voyager sereinement, gagner
            du temps et éviter les imprévus, tout en donnant du bonheur...
          </p>
        </header>

        {/* 3 Columns Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mt-16">
          {/* Column 1 */}
          <div className="flex flex-col items-center text-center">
            <Link
              to="/bonnes-pratiques"
              className="h-40 flex items-center justify-center mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer block"
            >
              <svg
                width="160"
                height="160"
                viewBox="0 0 140 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(10, 10)">
                  <rect
                    x="15"
                    y="30"
                    width="85"
                    height="26"
                    rx="4"
                    fill="#6B8EB8"
                    stroke="#3A506B"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M30 49l2-6 5-5-7 1-3-6-3 6-7-1 5 5 2 6 5-3z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M57 49l2-6 5-5-7 1-3-6-3 6-7-1 5 5 2 6 5-3z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M84 49l2-6 5-5-7 1-3-6-3 6-7-1 5 5 2 6 5-3z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />

                  <rect
                    x="25"
                    y="60"
                    width="16"
                    height="36"
                    rx="3"
                    fill="#6B8EB8"
                    stroke="#3A506B"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <circle cx="33" cy="78" r="3" fill="white" />

                  <path
                    d="M41 96h24c4 0 6-2 6-6v-4c0-2 2-4 4-4h8c4 0 7-3 7-7V68c0-4-3-7-7-7H65c0 0 0-14 0-16 0-4-3-7-7-7-4 0-6 3-6 7v15H41v36z"
                    fill="#DCE8F5"
                    stroke="#3A506B"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M83 68H65M79 77H65M75 86H65"
                    stroke="#3A506B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </Link>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4">
              Les Bonnes
              <br />
              Pratiques
            </h3>
            <p className="text-sm font-medium text-gray-600 leading-relaxed px-2">
              Découvrez les conseils essentiels de la communauté GoHappyGo pour garantir des
              échanges fluides, respectueux et sécurisés. Adoptez les bons réflexes avant, pendant
              et après chaque transport de bagage.
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center text-center">
            <Link
              to="/articles-interdits"
              className="h-40 flex items-center justify-center mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer block"
            >
              <svg
                width="160"
                height="160"
                viewBox="0 0 140 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(10, 10)">
                  <circle cx="60" cy="60" r="48" fill="white" stroke="#1E3A8A" strokeWidth="7" />
                  <path
                    d="M38 56C38 42 48 34 60 34C72 34 82 42 82 56"
                    fill="#8FAADC"
                    stroke="#111827"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M42 56L46 82H74L78 56H42Z"
                    fill="white"
                    stroke="#111827"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <circle cx="50" cy="46" r="3" fill="#1E3A8A" />
                  <circle cx="62" cy="42" r="3" fill="#1E3A8A" />
                  <circle cx="70" cy="48" r="3" fill="#1E3A8A" />
                  <circle cx="56" cy="51" r="3" fill="#1E3A8A" />
                  <path
                    d="M54 56V82M60 56V82M66 56V82M48 56V82M72 56V82"
                    stroke="#111827"
                    strokeWidth="2.5"
                  />
                  <path d="M26 26L94 94" stroke="#1E3A8A" strokeWidth="9" strokeLinecap="round" />
                </g>
              </svg>
            </Link>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4">
              Articles
              <br />
              Interdits/Reglémentés
            </h3>
            <p className="text-sm font-medium text-gray-600 leading-relaxed px-2">
              Consultez les règles douanières et les restrictions applicables selon les pays afin
              d&apos;éviter tout blocage, retard ou incident lors du transport de vos bagages.
            </p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center text-center">
            <Link
              to="/securite-et-accompagnement"
              className="h-40 flex items-center justify-center mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer block"
            >
              <svg
                width="160"
                height="160"
                viewBox="0 0 140 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(10, 10)">
                  <circle cx="85" cy="25" r="18" fill="white" stroke="#FF7C6B" strokeWidth="4" />
                  <path
                    d="M77 25L82 30L93 19"
                    stroke="#FF7C6B"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle cx="45" cy="55" r="15" fill="white" stroke="#2C3E50" strokeWidth="3.5" />
                  <path
                    d="M18 95C18 78 30 68 45 68C60 68 72 78 72 95H18Z"
                    fill="white"
                    stroke="#2C3E50"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />

                  <circle cx="78" cy="62" r="15" fill="white" stroke="#FF7C6B" strokeWidth="3.5" />
                  <path
                    d="M51 95C51 80 63 71 78 71C93 71 105 80 105 95H51Z"
                    fill="white"
                    stroke="#FF7C6B"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M72 75C68 73 60 76 60 80"
                    stroke="#FF7C6B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M102 85C108 85 110 90 110 95"
                    stroke="#FF7C6B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </Link>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4">
              Sécurité et
              <br />
              Accompagnement
            </h3>
            <p className="text-sm font-medium text-gray-600 leading-relaxed px-2">
              Accédez à toutes les garanties pour une expérience fluide, sécurisée et rassurante à
              chaque étape de votre voyage.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OutilVoyageur;
