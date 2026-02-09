import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const LeBonheur = () => {
  const sections = [
    {
      id: 1,
      icon: '❤️',
      title: "Voyager utile, c'est voyager heureux",
      content:
        "Le bonheur, ce n'est pas seulement arriver à destination. C'est savoir que, pendant votre trajet, <b>vous avez aidé quelqu'un.</b>",
      items: [
        'Un bagage qui arrive à temps',
        "Un voyage plus léger pour quelqu'un d'autre",
        'Un stress évité',
        'Un sourire au bout du chemin',
      ],
      footer: 'Chez GoHappyGo, chaque trajet peut devenir <b>une bonne et belle action.</b>',
    },
    {
      id: 2,
      icon: '🌍',
      title: 'Le bonheur de faire partie de quelque chose de plus grand',
      content:
        "En utilisant GoHappyGo, vous n'êtes pas juste un utilisateur. Vous faites partie d'une <b>communauté solidaire de voyageurs</b> qui :",
      items: [
        "S'entraident naturellement",
        'Optimisent ce qui existe déjà',
        'Donnent du sens à leurs déplacements',
      ],
      footer: 'Le bonheur naît souvent quand on se sent <b>utile, connecté et engagé.</b>',
    },
    {
      id: 3,
      icon: '✨',
      title: 'De petits gestes. De grands effets.',
      content:
        "Porter un bagage, ce n'est pas grand-chose. Mais pour quelqu'un d'autre, c'est parfois :",
      items: ['Une solution à un problème', 'Un voyage plus serein', 'Une confiance retrouvée'],
      footer:
        'Le bonheur, ce sont ces <b>petits gestes ordinaires</b> qui créent des effets extraordinaires.',
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
              <p
                className="text-sm md:text-base font-bold text-gray-700 mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />

              {/* Liste à puces */}
              <ul className="space-y-3 mb-8 ml-4">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm md:text-bas font-bold text-gray-700 tracking-wide"
                  >
                    <span className="block w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Conclusion de section (Ligne avec la main 👉) */}
              <div className="flex items-start gap-3 mt-6">
                <span className="text-orange-400 text-xl shrink-0">👉</span>
                <p
                  className="text-sm md:text-base font-bold text-gray-700 leading-snug tracking-tight"
                  dangerouslySetInnerHTML={{ __html: section.footer }}
                />
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
