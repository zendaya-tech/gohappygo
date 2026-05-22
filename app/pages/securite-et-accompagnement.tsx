import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router';

const SecuriteEtAccompagnement = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden  md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="relative grow w-full max-w-4xl mx-auto px-6 py-4 font-sans z-10 bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-600 leading-tight uppercase tracking-tight mb-6">
            OUTILS POUR
            <br />
            LES HAPPYVOYAGEURS
          </h1>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Sécurité et Accompagnement
          </h2>
          <p className="text-lg md:text-xl font-bold text-gray-800 leading-relaxed max-w-2xl">
            Vous vous êtes rencontrés à l&apos;aéroport, avez effectué votre selfie à 2, ce
            n&apos;est pas fini..
          </p>
        </header>

        <div className="space-y-10 text-gray-700 font-medium">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              S&apos;enregistrer à 2 à la suite
            </h3>
            <p className="ml-5 leading-relaxed">
              Il est recommandé que les deux voyageurs se présentent ensemble au comptoir
              d&apos;enregistrement et enregistrent leurs bagages l&apos;un à la suite de
              l&apos;autre. Cette étape permet de confirmer le voyage, et sécurise, renforce la
              traçabilité de la transaction jusqu&apos;à l&apos;embarquement.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3"></span>
              Paiement sécurisé
            </h3>
            <div className="ml-5 space-y-4">
              <p className="leading-relaxed">
                <span className="font-bold text-gray-900">
                  Tous les paiements doivent être effectués exclusivement via la plateforme
                  GoHappyGo.
                </span>{' '}
                Le paiement intégré permet de protéger les voyageurs tout en assurant la traçabilité
                des transactions.
              </p>
              <p className="leading-relaxed">
                Le paiement est sécurisé et conservé sur la plateforme jusqu&apos;à la validation de
                la remise du bagage. Cette procédure permet de limiter les risques de fraude, de
                sécuriser les accords entre utilisateurs et de renforcer la confiance au sein de la
                communauté.
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
                Si vous observez un comportement suspect, irrespectueux ou contraire aux règles de
                la plateforme, nous vous encourageons à le signaler immédiatement via le{' '}
                <Link to="/support" className="text-blue-600 font-bold hover:underline">
                  formulaire de signalement
                </Link>
                .
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
                Chaque signalement contribue à protéger l&apos;ensemble de la communauté et à
                garantir des échanges plus sûrs et plus transparents.
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
