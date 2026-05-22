import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router';

const OutilVoyageur = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="relative grow w-full max-w-6xl mx-auto px-6 py-4 font-sans z-10 bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        {/* Header Section */}
        <header className="mb-20 max-w-4xl text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-600 leading-tight uppercase tracking-tight mb-6">
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
              className="h-40 flex items-center justify-center mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                className="w-55 h-55"
                src="/images/bonnesPratiques-removebg-preview.png"
                alt="blue thumbs up with 3 stars at the top"
              />
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
              className="h-40 flex items-center justify-center mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                className="w-55 h-55"
                src="/images/articlesInterdits-removebg-preview.png"
                alt="forbidden blue cupcake"
              />
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
              className="h-40 flex items-center justify-center mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                className="w-55 h-55"
                src="/images/securiteAccompagnements-removebg-preview.png"
                alt="blue and red people holding"
              />
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
