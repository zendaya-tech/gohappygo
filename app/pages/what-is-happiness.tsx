import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const LeBonheur = () => {
  const sections = [
    {
      id: 1,
      icon: '❤️',
      title: "VOYAGER UTILE, C'EST VOYAGER HEUREUX",
      content:
        "LE BONHEUR, CE N'EST PAS SEULEMENT ARRIVER À DESTINATION. C'EST SAVOIR QUE, PENDANT VOTRE TRAJET, VOUS AVEZ AIDÉ QUELQU'UN.",
      items: [
        'UN BAGAGE QUI ARRIVE À TEMPS',
        "UN VOYAGE PLUS LÉGER POUR QUELQU'UN D'AUTRE",
        'UN STRESS ÉVITÉ',
        'UN SOURIRE AU BOUT DU CHEMIN',
      ],
      footer: 'CHEZ GOHAPPYGO, CHAQUE TRAJET PEUT DEVENIR UNE BONNE ET BELLE ACTION.',
    },
    {
      id: 2,
      icon: '🌍',
      title: 'LE BONHEUR DE FAIRE PARTIE DE QUELQUE CHOSE DE PLUS GRAND',
      content:
        "EN UTILISANT GOHAPPYGO, VOUS N'ÊTES PAS JUSTE UN UTILISATEUR. VOUS FAITES PARTIE D'UNE COMMUNAUTÉ SOLIDAIRE DE VOYAGEURS QUI :",
      items: [
        "S'ENTRAIDENT NATURELLEMENT",
        'OPTIMISENT CE QUI EXISTE DÉJÀ',
        'DONNENT DU SENS À LEURS DÉPLACEMENTS',
      ],
      footer: 'LE BONHEUR NAÎT SOUVENT QUAND ON SE SENT UTILE, CONNECTÉ ET ENGAGÉ.',
    },
    {
      id: 3,
      icon: '✨',
      title: 'DE PETITS GESTES. DE GRANDS EFFETS.',
      content:
        "PORTER UN BAGAGE, CE N'EST PAS GRAND-CHOSE. MAIS POUR QUELQU'UN D'AUTRE, C'EST PARFOIS :",
      items: ['UNE SOLUTION À UN PROBLÈME', 'UN VOYAGE PLUS SEREIN', 'UNE CONFIANCE RETROUVÉE'],
      footer:
        'LE BONHEUR, CE SONT CES PETITS GESTES ORDINAIRES QUI CRÉENT DES EFFETS EXTRAORDINAIRES.',
    },
  ];

  return (
    <div className="md:bg-[url('./images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-16 font-sans bg-[url('./images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        {/* Titre Principal */}
        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-blue-600 leading-tight uppercase italic tracking-tighter">
            LE BONHEUR, <br />
            ÇA SE PARTAGE AUSSI !
          </h1>
        </header>

        {/* Sections de contenu */}
        <div className="space-y-24">
          {sections.map((section) => (
            <section key={section.id} className="max-w-4xl">
              {/* Titre de Section avec Icône */}
              <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-black mb-6 uppercase tracking-tight">
                <span className="text-3xl">{section.icon}</span>
                {section.title}
              </h2>

              {/* Texte d'introduction de section */}
              <p className="text-sm md:text-base font-bold text-gray-500 mb-6 uppercase leading-relaxed">
                {section.content}
              </p>

              {/* Liste à puces */}
              <ul className="space-y-3 mb-8 ml-4">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm md:text-base font-extrabold text-gray-800 uppercase tracking-wide"
                  >
                    <span className="block w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Conclusion de section (Ligne avec la main 👉) */}
              <div className="flex items-start gap-3 mt-6">
                <span className="text-orange-400 text-xl shrink-0">👉</span>
                <p className="text-sm md:text-base font-black text-gray-700 uppercase leading-snug tracking-tight">
                  {section.footer}
                </p>
              </div>
            </section>
          ))}
        </div>

        {/* Message de clôture final */}
        <div className="mt-24 pt-12 border-t border-gray-100">
          <p className="text-lg md:text-xl font-black text-blue-600 uppercase italic tracking-tighter leading-tight">
            SOYEZ UN PORTEUR DE BONHEUR. <br />
            POUR LES AUTRES. POUR VOUS. POUR LE VOYAGE AUTREMENT.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LeBonheur;
