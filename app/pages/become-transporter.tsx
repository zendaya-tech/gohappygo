import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import { Trans, useTranslation } from 'react-i18next';

const EtreHappyvoyageur = () => {
  const { t } = useTranslation();
  const manifestoSections = [
    {
      intro: t('pages.becomeTransporter.section1.intro', { returnObjects: true }) as string[],
    },
    {
      title: t('pages.becomeTransporter.section2.title'),
      lines: t('pages.becomeTransporter.section2.lines', { returnObjects: true }) as string[],
    },
    {
      title: t('pages.becomeTransporter.section3.title'),
      lines: t('pages.becomeTransporter.section3.lines', { returnObjects: true }) as string[],
    },
    {
      title: t('pages.becomeTransporter.section4.title'),
      lines: t('pages.becomeTransporter.section4.lines', { returnObjects: true }) as string[],
    },
  ];

  return (
    <div className="md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-16 font-sans bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none ">
        {/* Titre Principal Manifeste */}
        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-blue-600 leading-tight uppercase italic tracking-tighter whitespace-pre-wrap">
            <Trans
              i18nKey="pages.becomeTransporter.header"
              components={{ br: <br />, span: <span className="ml-6" /> }}
            />
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
              {t('pages.becomeTransporter.footer')}
            </p>
          </footer>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EtreHappyvoyageur;
