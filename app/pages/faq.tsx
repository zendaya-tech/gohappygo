import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const FAQ = () => {
  const faqData = [
    {
      question: 'QUI PEUT UTILISER GOHAPPYGO ?',
      answer:
        "TOUTE PERSONNE MAJEURE DISPOSANT D'UN COMPTE VÉRIFIÉ PEUT UTILISER GOHAPPYGO POUR PROPOSER OU RÉSERVER UN ESPACE BAGAGE.",
    },
    {
      question: 'LES PROFILS SONT-ILS VÉRIFIÉS ?',
      answer:
        "OUI. TOUS LES UTILISATEURS PASSENT PAR UNE VÉRIFICATION D'IDENTITÉ LORS DE L'INSCRIPTION AFIN DE GARANTIR UNE COMMUNAUTÉ DE CONFIANCE.",
    },
    {
      question: "QU'EST-CE QU'UN HAPPYVOYAGEUR ?",
      answer:
        "UN HAPPYVOYAGEUR EST UN UTILISATEUR QUI CHOISIT DE VOYAGER EN AIDANT LES AUTRES, OU D'UTILISER LE SERVICE GOHAPPYGO, DANS UN ESPRIT DE CONFIANCE, DE PARTAGE ET DE BIENVEILLANCE.",
    },
    {
      question: 'QUI CHOISIT LE PORTEUR DU BAGAGE ?',
      answer:
        "QU'ON RÉSERVE OU PROPOSE UN ESPACE BAGAGE, ON PEUT CHOISIR LIBREMENT SON HAPPYVOYAGEUR, APRÈS AVOIR CONSULTÉ SON PROFIL, ET ÉCHANGÉ AVEC LUI. UNE ANNULATION EST POSSIBLE À TOUT MOMENT AVANT LE VOYAGE. TOUTE TRANSACTION DOIT COMMENCER ET SE TERMINER SUR GOHAPPYGO POUR BÉNÉFICIER DE NOTRE PROTECTION JURIDIQUE.",
    },
    {
      question: "COMMENT S'ASSURE-T-ON DE LA TRAÇABILITÉ DE LA RENCONTRE ?",
      answer:
        "LORS DE LA RENCONTRE À L'AÉROPORT, ET AVANT L'ENREGISTREMENT, LES 2 VOYAGEURS EFFECTUENT UNE PRISE DE SELFIE VIA L'APPLICATION, CE QUI PERMET DE CONFIRMER LEUR IDENTITÉ ET CONFIRMER LA RENCONTRE; CES DONNÉES NE SONT DÉTENUES PAR AUCUN DES VOYAGEURS.",
    },
    {
      question: 'QUEL TYPE DE BAGAGE PEUT-ON FAIRE VOYAGER ?',
      answer:
        'SEULS LES BAGAGES AUTORISÉS PAR LA RÉGLEMENTATION (VALISES, SACS PERSONNELS, EFFETS NON DANGEREUX) PEUVENT ÊTRE CONFIÉS VIA GOHAPPYGO.',
    },
    {
      question: 'QUE SE PASSE-T-IL EN CAS DE PROBLÈME PENDANT LE VOYAGE ?',
      answer:
        "GOHAPPYGO EST UN CADRE SÉCURISÉ, ET DE TRAÇABILITÉ. LA PLATEFORME PRÉVOIT UNE ASSISTANCE TECHNIQUE ET JURIDIQUE 24/7, QUELQUE SOIT L'ENDROIT DU GLOBE.",
    },
    {
      question: 'COMMENT FONCTIONNE LE PAIEMENT ?',
      answer:
        'LE PAIEMENT EST 100 % SÉCURISÉ ET CONSERVÉ SOUS SEQUESTRE PAR LA PLATEFORME PENDANT TOUTE LA DURÉE DU VOYAGE ET VIRER AUTOMATIQUEMENT DÈS VALIDATION DES 2 HAPPYVOYAGEURS.',
    },
    {
      question: 'PUIS-JE ÊTRE À LA FOIS RÉSERVER ET PROPOSER UN ESPACE BAGAGE ?',
      answer: "OUI. GOHAPPYGO PERMET D'ENDOSSER LES DEUX RÔLES, SELON VOS BESOINS ET VOS VOYAGES.",
    },
    {
      question: 'COMMENT CONTACTER GOHAPPYGO ?',
      answer:
        "UN SERVICE D'ASSISTANCE EST ACCESSIBLE DIRECTEMENT VIA L'APPLICATION POUR ACCOMPAGNER LES UTILISATEURS À CHAQUE ÉTAPE.",
    },
  ];

  return (
    <div className="bg-[url('./images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-16 font-sans">
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
              <h2 className="text-lg md:text-xl font-black text-black uppercase leading-tight tracking-tight">
                {item.question}
              </h2>
              <p className="text-sm md:text-base font-bold text-gray-500 uppercase leading-snug tracking-wide">
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
