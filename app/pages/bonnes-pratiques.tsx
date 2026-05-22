import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router';

const BonnesPratiques = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="relative grow w-full max-w-4xl mx-auto px-6 py-4 font-sans z-10 bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-600 leading-tight uppercase tracking-tight mb-6">
            OUTILS POUR
            <br />
            LES HAPPYVOYAGEURS
          </h1>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Les Bonnes Pratiques
          </h2>
        </header>

        <div className="space-y-8 text-gray-700 font-medium">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              S&apos;inscrire
            </h3>
            <p className="ml-5 leading-relaxed">
              La première étape pour rejoindre GoHappyGo consiste à créer votre compte utilisateur.
              Pour garantir la sécurité et la conformité des échanges, les voyageurs doivent être
              âgés d&apos;au moins 18 ans et disposer d&apos;une pièce d&apos;identité valide, quel
              que soit leur pays de résidence.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              Créer votre annonce
            </h3>
            <p className="ml-5 leading-relaxed">
              Rédigez une annonce claire et précise en indiquant vos attentes et éventuelles
              contraintes. Mentionnez notamment vos horaires d&apos;arrivée, les types
              d&apos;articles refusés (produits alimentaires, colis fermés, objets sensibles, etc.)
              ou toute autre information utile. Une annonce détaillée permet d&apos;éviter les
              malentendus.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              Vérifiez les règles douanières
            </h3>
            <p className="ml-5 leading-relaxed">
              Avant votre voyage, prenez le temps de consulter les réglementations douanières
              applicables dans votre pays de destination. Les restrictions varient selon les pays :
              certains produits peuvent être interdits ou soumis à déclaration, comme l&apos;alcool,
              les médicaments ou certains aliments. Retrouvez les principales informations dans
              notre section{' '}
              <Link to="/articles-interdits" className="text-blue-600 font-bold hover:underline">
                « Articles interdits / réglementés »
              </Link>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              Communiquez via la messagerie
            </h3>
            <p className="ml-5 leading-relaxed">
              Utilisez exclusivement la messagerie interne GoHappyGo pour organiser votre rencontre
              et échanger avec les autres voyageurs. Ces échanges constituent une preuve en cas de
              besoin. Pour votre sécurité, évitez de partager vos coordonnées personnelles ou votre
              adresse privée.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              Soyez ponctuel
            </h3>
            <p className="ml-5 leading-relaxed">
              La ponctualité facilite des échanges sereins et fluides. Les rencontres sont fortement
              recommandées dans l&apos;enceinte de l&apos;aéroport, considéré comme un lieu sécurisé
              et facilement identifiable. Convenez ensemble d&apos;un horaire précis afin
              d&apos;éviter tout retard ou incompréhension.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              Prenez obligatoirement le selfie à 2
            </h3>
            <p className="ml-5 leading-relaxed">
              Lors de votre rencontre à l&apos;aéroport, prenez un selfie à 2 via l&apos;application
              mobile GoHappyGo. Cette étape permet de sécuriser et tracer la transaction. En cas de
              refus de prendre le selfie, il est recommandé d&apos;interrompre l&apos;échange. Le
              selfie est conservé de manière sécurisée sur la plateforme et supprimé automatiquement
              après 90 jours. Il n&apos;est pas consultable ou partagé.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BonnesPratiques;
