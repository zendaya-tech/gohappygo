import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const EtreHappyvoyageur = () => {
  const manifestoSections = [
    {
      intro: [
        "NOUS CROYONS QUE VOYAGER PEUT ÊTRE PLUS QU'UN DÉPLACEMENT.",
        'NOUS CROYONS QUE CHAQUE TRAJET EST UNE OPPORTUNITÉ.',
        "UNE OPPORTUNITÉ D'AIDER.",
        'UNE OPPORTUNITÉ DE PARTAGER.',
        'UNE OPPORTUNITÉ DE CRÉER DU LIEN.',
      ],
    },
    {
      title: 'ÊTRE HAPPYVOYAGEUR,',
      lines: [
        "C'EST CHOISIR DE VOYAGER AUTREMENT.",
        "C'EST VOIR DANS UN ESPACE LIBRE UNE CHANCE DE RENDRE SERVICE.",
        'DANS UNE RENCONTRE, UNE CONFIANCE À CONSTRUIRE.',
        'DANS UN BAGAGE, UNE HISTOIRE À PORTER.',
        'NOUS VOYAGEONS DÉJÀ.',
        'ALORS AUTANT VOYAGER UTILE.',
        "UTILE POUR QUELQU'UN QUI ATTEND.",
        'UTILE POUR UNE PLANÈTE À PRÉSERVER.',
        'UTILE POUR REDONNER DU SENS À NOS DÉPLACEMENTS.',
      ],
    },
    {
      title: 'ÊTRE HAPPYVOYAGEUR,',
      lines: [
        "C'EST CROIRE EN LA FORCE DES PETITS GESTES.",
        'UN ACCORD.',
        'UN SOURIRE.',
        'UN BAGAGE QUI ARRIVE À DESTINATION.',
        'ET SOUVENT, BIEN PLUS QUE ÇA.',
        'NOUS AVANÇONS ENSEMBLE,',
        'DANS UN CADRE SÛR, TRANSPARENT ET RESPECTUEUX.',
        "PARCE QUE LA CONFIANCE N'EST PAS UNE OPTION.",
        "C'EST NOTRE FONDATION.",
      ],
    },
    {
      title: 'ÊTRE HAPPYVOYAGEUR,',
      lines: [
        "C'EST UN ÉTAT D'ESPRIT.",
        "CELUI DE CELLES ET CEUX QUI CHOISISSEST LA SOLIDARITÉ PLUTÔT QUE L'INDIFFÉRENCE,",
        "LE LIEN PLUTÔT QUE L'ISOLEMENT,",
        'LE SENS PLUTÔT QUE LA ROUTINE.',
        'NOUS SOMMES LES HAPPYVOYAGEURS.',
        'NOUS PORTONS PLUS QUE DES BAGAGES.',
        'NOUS PORTONS DE LA BIENVEILLANCE.',
        'NOUS PORTONS DE LA CONFIANCE.',
        'NOUS PORTONS DU BONHEUR.',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-16 font-sans">
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
            <div key={idx} className="flex flex-col gap-1">
              {/* Titre de section "ÊTRE HAPPYVOYAGEUR," */}
              {section.title && (
                <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight mb-2">
                  {section.title}
                </h2>
              )}

              {/* Lignes de texte (Intro ou Corps) */}
              {(section.intro || section.lines).map((line, lineIdx) => (
                <p
                  key={lineIdx}
                  className={`text-sm md:text-base font-bold uppercase leading-snug tracking-wide ${
                    section.intro ? 'text-gray-500' : 'text-gray-600'
                  }`}
                >
                  {line}
                </p>
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
