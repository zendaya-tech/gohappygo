import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router';

const BonnesPratiques = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Header />

      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] opacity-30 pointer-events-none">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="200"
            cy="200"
            r="180"
            stroke="#93C5FD"
            strokeWidth="3"
            strokeDasharray="12 12"
          />
          <path
            d="M200 20C280 20 340 100 340 200C340 300 280 380 200 380C120 380 60 300 60 200C60 100 120 20 200 20Z"
            stroke="#93C5FD"
            strokeWidth="3"
          />
          <path d="M20 200H380M200 20V380" stroke="#93C5FD" strokeWidth="3" />
          <path
            d="M240 60C280 80 320 160 300 220C280 280 220 340 180 320C140 300 160 200 200 160C240 120 220 80 240 60Z"
            stroke="#93C5FD"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M80 120C120 100 160 140 140 180C120 220 80 200 80 120Z"
            stroke="#93C5FD"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="absolute top-[35%] left-[-15%] w-[400px] h-[400px] opacity-30 pointer-events-none transform -rotate-12">
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M250 150C250 150 280 150 280 160C280 170 250 170 250 170L150 170L70 220L50 220L100 170L40 170L20 190L10 190L30 160L10 130L20 130L40 150L100 150L50 100L70 100L150 150L250 150Z"
            stroke="#93C5FD"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M120 150L70 100" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M280 160C300 160 320 165 340 175"
            stroke="#93C5FD"
            strokeWidth="3"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="absolute bottom-[5%] left-[5%] w-[350px] h-[350px] opacity-30 pointer-events-none transform -rotate-12">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="60" width="120" height="90" rx="10" stroke="#93C5FD" strokeWidth="3" />
          <path
            d="M70 60V40C70 30 130 30 130 40V60"
            stroke="#93C5FD"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M60 60V150M140 60V150" stroke="#93C5FD" strokeWidth="3" />
          <rect x="85" y="90" width="30" height="30" stroke="#93C5FD" strokeWidth="3" />
          <circle cx="50" cy="155" r="5" stroke="#93C5FD" strokeWidth="3" />
          <circle cx="150" cy="155" r="5" stroke="#93C5FD" strokeWidth="3" />
        </svg>
      </div>

      <div className="absolute bottom-[5%] right-[10%] w-[300px] h-[300px] opacity-30 pointer-events-none transform rotate-12">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 70H160V130H40Z" stroke="#93C5FD" strokeWidth="3" />
          <circle cx="40" cy="100" r="10" fill="white" stroke="#93C5FD" strokeWidth="3" />
          <circle cx="160" cy="100" r="10" fill="white" stroke="#93C5FD" strokeWidth="3" />
          <path d="M120 70V130" stroke="#93C5FD" strokeWidth="3" strokeDasharray="6 6" />
          <path
            d="M60 100L90 100M80 90L90 100L80 110"
            stroke="#93C5FD"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="130" y="80" width="20" height="40" stroke="#93C5FD" strokeWidth="2" />
        </svg>
      </div>

      <main className="relative flex-grow w-full max-w-4xl mx-auto px-6 py-16 md:py-24 font-sans z-10">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2f4cb0] leading-tight uppercase tracking-tight mb-6">
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
              <Link to="/articles-interdits" className="text-[#2f4cb0] hover:underline">
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
