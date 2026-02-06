import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const FAQ = () => {
  const faqData = [
    {
      question: 'Qui Peut Utiliser Gohappygo ?',
      answer:
        "Toute personne majeure disposant d'un compte vérifié peut utiliser Gohappygo pour proposer ou réserver un espace bagage.",
    },
    {
      question: 'Les Profils Sont-Ils Vérifiés ?',
      answer:
        "Oui. Tous les utilisateurs passent par une vérification d'identité lors de l'inscription afin de garantir une communauté de confiance.",
    },
    {
      question: "Qu'est-Ce Qu'Un Happyvoyageur ?",
      answer:
        "Un Happyvoyageur est un utilisateur qui choisit de voyager en aidant les autres, ou d'utiliser le service Gohappygo, dans un esprit de confiance, de partage et de bienveillance.",
    },
    {
      question: 'Qui Choisisit Le Porteur Du Bagage ?',
      answer:
        "Qu'on réserve ou propose un espace bagage, on peut choisir librement son Happyvoyageur, après avoir consulté son profil, et échangé avec lui. Une annulation est possible à tout moment avant le voyage. Toute transaction doit commencer et se terminer sur Gohappygo pour bénéficier de notre protection juridique.",
    },
    {
      question: "Comment S'Assure-T-On De La Traçabilité De La Rencontre ?",
      answer:
        "Lors de la rencontre à l'aéroport, et avant l'enregistrement, les 2 voyageurs effectuent une prise de selfie via l'application, ce qui permet de confirmer leur identité et confirmer la rencontre; ces données ne sont détenues par aucun des voyageurs.",
    },
    {
      question: 'Quel Type De Bagage Peut-On Faire Voyager ?',
      answer:
        'Seuls les bagages autorisés par la réglementation (valises, sacs personnels, effets non dangereux) peuvent être confiés via Gohappygo.',
    },
    {
      question: 'Que Se Passe-T-Il En Cas De Problème Pendant Le Voyage ?',
      answer:
        "Gohappygo est un cadre sécurisé, et de traçabilité. La plateforme prévoit une assistance technique et juridique 24/7, quelque soit l'endroit du globe.",
    },
    {
      question: 'Comment Fonctionne Le Paiement ?',
      answer:
        'Le paiement est 100 % sécurisé et conservé sous séquestre par la plateforme pendant toute la durée du voyage et viré automatiquement dès validation des 2 Happyvoyageurs.',
    },
    {
      question: 'Puis-Je Être À La Fois Réserver Et Proposer Un Espace Bagage ?',
      answer: "Oui. Gohappygo permet d'endosser les deux rôles, selon vos besoins et vos voyages.",
    },
    {
      question: 'Comment Contacter Gohappygo ?',
      answer:
        "Un service d'assistance est accessible directement via l'application pour accompagner les utilisateurs à chaque étape.",
    },
  ];
  return (
    <div className="md:bg-[url('./images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-16 font-sans bg-[url('./images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        {/* Titre Principal - Style identique aux autres pages */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-blue-600 leading-tight uppercase italic tracking-tighter">
            FOIRE AUX <br /> QUESTIONS
          </h1>
        </header>

        {/* Grille FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {faqData.map((item, index) => (
            <div key={index} className="space-y-3">
              <h2 className="text-lg md:text-xl font-black text-black  leading-tight tracking-tight uppercase">
                {item.question}
              </h2>
              <p className="text-sm md:text-base font-bold text-gray-500  leading-snug tracking-wide">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
