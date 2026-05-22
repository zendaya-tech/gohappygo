import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router';

const SecuriteEtAccompagnement = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Header />

      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] opacity-30 pointer-events-none">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="180" stroke="#93C5FD" strokeWidth="3" strokeDasharray="12 12" />
          <path d="M200 20C280 20 340 100 340 200C340 300 280 380 200 380C120 380 60 300 60 200C60 100 120 20 200 20Z" stroke="#93C5FD" strokeWidth="3" />
          <path d="M20 200H380M200 20V380" stroke="#93C5FD" strokeWidth="3" />
          <path d="M240 60C280 80 320 160 300 220C280 280 220 340 180 320C140 300 160 200 200 160C240 120 220 80 240 60Z" stroke="#93C5FD" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M80 120C120 100 160 140 140 180C120 220 80 200 80 120Z" stroke="#93C5FD" strokeWidth="3" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="absolute top-[35%] left-[-15%] w-[400px] h-[400px] opacity-30 pointer-events-none transform -rotate-12">
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M250 150C250 150 280 150 280 160C280 170 250 170 250 170L150 170L70 220L50 220L100 170L40 170L20 190L10 190L30 160L10 130L20 130L40 150L100 150L50 100L70 100L150 150L250 150Z" stroke="#93C5FD" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M120 150L70 100" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round"/>
          <path d="M280 160C300 160 320 165 340 175" stroke="#93C5FD" strokeWidth="3" strokeDasharray="8 8" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="absolute bottom-[5%] left-[5%] w-[350px] h-[350px] opacity-30 pointer-events-none transform -rotate-12">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="60" width="120" height="90" rx="10" stroke="#93C5FD" strokeWidth="3"/>
          <path d="M70 60V40C70 30 130 30 130 40V60" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round"/>
          <path d="M60 60V150M140 60V150" stroke="#93C5FD" strokeWidth="3"/>
          <rect x="85" y="90" width="30" height="30" stroke="#93C5FD" strokeWidth="3"/>
          <circle cx="50" cy="155" r="5" stroke="#93C5FD" strokeWidth="3"/>
          <circle cx="150" cy="155" r="5" stroke="#93C5FD" strokeWidth="3"/>
        </svg>
      </div>

      <div className="absolute bottom-[5%] right-[10%] w-[300px] h-[300px] opacity-30 pointer-events-none transform rotate-12">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 70H160V130H40Z" stroke="#93C5FD" strokeWidth="3"/>
          <circle cx="40" cy="100" r="10" fill="white" stroke="#93C5FD" strokeWidth="3"/>
          <circle cx="160" cy="100" r="10" fill="white" stroke="#93C5FD" strokeWidth="3"/>
          <path d="M120 70V130" stroke="#93C5FD" strokeWidth="3" strokeDasharray="6 6"/>
          <path d="M60 100L90 100M80 90L90 100L80 110" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="130" y="80" width="20" height="40" stroke="#93C5FD" strokeWidth="2"/>
        </svg>
      </div>

      <main className="relative flex-grow w-full max-w-4xl mx-auto px-6 py-16 md:py-24 font-sans z-10">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2f4cb0] leading-tight uppercase tracking-tight mb-6">
            OUTILS POUR<br />
            LES HAPPYVOYAGEURS
          </h1>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Sécurité et Accompagnement
          </h2>
          <p className="text-lg md:text-xl font-bold text-gray-800 leading-relaxed max-w-2xl">
            Vous vous êtes rencontrés à l'aéroport, avez effectué votre selfie à 2, ce n'est pas fini..
          </p>
        </header>

        <div className="space-y-10 text-gray-700 font-medium">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              S'enregistrer à 2 à la suite
            </h3>
            <p className="ml-5 leading-relaxed">
              Il est recommandé que les deux voyageurs se présentent ensemble au comptoir d'enregistrement et enregistrent leurs bagages l'un à la suite de l'autre. Cette étape permet de confirmer le voyage, et sécurise, renforce la traçabilité de la transaction jusqu'à l'embarquement.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              Paiement sécurisé
            </h3>
            <div className="ml-5 space-y-4">
              <p className="leading-relaxed">
                <span className="font-bold text-gray-900">Tous les paiements doivent être effectués exclusivement via la plateforme GoHappyGo.</span> Le paiement intégré permet de protéger les voyageurs tout en assurant la traçabilité des transactions.
              </p>
              <p className="leading-relaxed">
                Le paiement est sécurisé et conservé sur la plateforme jusqu'à la validation de la remise du bagage. Cette procédure permet de limiter les risques de fraude, de sécuriser les accords entre utilisateurs et de renforcer la confiance au sein de la communauté.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              Signalez un comportement
            </h3>
            <div className="ml-5 space-y-4">
              <p className="leading-relaxed">
                Si vous observez un comportement suspect, irrespectueux ou contraire aux règles de la plateforme, nous vous encourageons à le signaler immédiatement via le <Link to="/support" className="text-[#2f4cb0] font-bold hover:underline">formulaire de signalement</Link>.
              </p>
              <div>
                <p className="mb-2">Un signalement peut concerner :</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>un refus de selfie de vérification,</li>
                  <li>une demande de paiement en dehors de la plateforme,</li>
                  <li>une pression inhabituelle,</li>
                  <li>un contenu de bagage différent de celui annoncé,</li>
                  <li>un comportement agressif ou inapproprié.</li>
                </ul>
              </div>
              <p className="leading-relaxed">
                Chaque signalement contribue à protéger l'ensemble de la communauté et à garantir des échanges plus sûrs et plus transparents.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SecuriteEtAccompagnement;
