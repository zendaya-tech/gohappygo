import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const EtreHappyvoyageur = () => {
  const manifestoSections = [
    {
      intro: [
        "Nous croyons que voyager peut être plus qu'un simple déplacement.",
        'Nous croyons que chaque trajet est une opportunité.',
        "Une opportunité d'aider.",
        'Une opportunité de partager.',
        'Une opportunité de créer du lien.',
      ],
    },
    {
      title: 'ÊTRE HAPPYVOYAGEUR,',
      lines: [
        "C'est choisir de voyager autrement.",
        "C'est voir dans un espace libre une chance de rendre service.",
        'Dans une rencontre, une confiance à construire.',
        'Dans un bagage, une histoire à porter.',
        'Nous voyageons déjà.',
        'Alors autant <b>voyager utile</b>.',
        "Utile pour quelqu'un qui attend.",
        'Utile pour une planète à préserver.',
        'Utile pour redonner du sens à nos déplacements.',
      ],
    },
    {
      title: 'ÊTRE HAPPYVOYAGEUR,',
      lines: [
        "C'est croire en la force des petits gestes.",
        'Un accord.',
        'Un sourire.',
        'Un bagage qui arrive à destination.',
        'Et souvent, bien plus que ça.',
        'Nous avançons ensemble, dans un cadre sûr, transparent et respectueux.',
        "Parce que la confiance n'est pas une option.",
        "C'est notre fondation.",
      ],
    },
    {
      title: 'ÊTRE HAPPYVOYAGEUR,',
      lines: [
        "C'est un état d'esprit.",
        "Celui de celles et ceux qui choisissent la solidarité plutôt que l'indifférence, le lien plutôt que l'isolement, le sens plutôt que la routine.",
        'Nous sommes les HappyVoyageurs.',
        'Nous portons plus que des bagages.',
        'Nous portons de la bienveillance.',
        'Nous portons de la confiance.',
        'Nous portons du bonheur.',
      ],
    },
  ];

  return (
    <div className="md:bg-[url('./images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-16 font-sans bg-[url('./images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none ">
        {/* Titre Principal Manifeste */}
        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-blue-600 leading-tight uppercase italic tracking-tighter">
            ÊTRE HAPPYVOYAGEUR, <br />
            ÊTRE SIMPLEMENT HEUREUX
          </h1>
        </header>

        {/* Corps du Manifeste */}
        <div className="space-y-16 max-w-4xl">
          {manifestoSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1 w-[65%]">
              {/* Titre de section "ÊTRE HAPPYVOYAGEUR," */}
              {section.title && (
                <h2 className="text-xl md:text-2xl font-black text-black  tracking-tight mb-2">
                  {section.title}
                </h2>
              )}

              {/* Lignes de texte (Intro ou Corps) */}
              {(section.intro || section.lines).map((line, lineIdx) => (
                <p
                  key={lineIdx}
                  className={`text-sm md:text-base font-bold leading-snug tracking-wide
                    text-gray-700
                  `}
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              ))}
            </div>
          ))}

          {/* Signature Finale */}
          <footer className="mt-20 pt-8">
            <p className="text-xl font-black text-black uppercase tracking-tighter">GOHAPPYGO</p>
            <p className="text-lg font-black text-blue-600 uppercase italic tracking-tighter">
              SOYEZ UN PORTEUR DE BONHEUR.
            </p>
          </footer>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EtreHappyvoyageur;
