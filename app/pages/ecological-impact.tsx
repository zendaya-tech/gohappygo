import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import { useTranslation, Trans } from 'react-i18next';

const ImpactEcologique = () => {
  const { t } = useTranslation();
  const sections = [
    {
      id: 1,
      icon: '♻️',
      title: t('pages.ecologicalImpact.sections.0.title'),
      intro: t('pages.ecologicalImpact.sections.0.intro'),
      items: t('pages.ecologicalImpact.sections.0.items', { returnObjects: true }) as string[],
      highlightTitle: t('pages.ecologicalImpact.sections.0.highlightTitle'),
      highlights: t('pages.ecologicalImpact.sections.0.highlights', {
        returnObjects: true,
      }) as string[],
      footerText: t('pages.ecologicalImpact.sections.0.footerText'),
      // Position de l'image de fond (Globe)
      bgImage: 'https://placehold.co/400x400/eef2ff/3b82f6?text=GLOBE',
      bgPos: 'right-[-5%] top-[0%]',
    },
    {
      id: 2,
      icon: '🤝',
      title: t('pages.ecologicalImpact.sections.1.title'),
      intro: t('pages.ecologicalImpact.sections.1.intro'),
      items: t('pages.ecologicalImpact.sections.1.items', { returnObjects: true }) as string[],
      footerText: t('pages.ecologicalImpact.sections.1.footerText'),
      // Position de l'image de fond (Avion)
      bgImage: 'https://placehold.co/300x300/eef2ff/3b82f6?text=AVION',
      bgPos: 'left-[-5%] top-[40%]',
    },
    {
      id: 3,
      icon: '🌱',
      title: t('pages.ecologicalImpact.sections.2.title'),
      intro: t('pages.ecologicalImpact.sections.2.intro'),
      items: t('pages.ecologicalImpact.sections.2.items', { returnObjects: true }) as string[],
      footerText: t('pages.ecologicalImpact.sections.2.footerText'),
      // Position de l'image de fond (Ticket)
      bgImage: 'https://placehold.co/300x200/eef2ff/3b82f6?text=TICKET',
      bgPos: 'right-[-5%] bottom-[5%]',
    },
  ];

  return (
    <div className="md:bg-[url('./images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="relative flex-grow w-full max-w-5xl mx-auto px-6 py-16 font-sans overflow-hidden bg-[url('./images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        {/* Titre Principal */}
        <header className="relative z-10 mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-blue-600 leading-tight uppercase italic tracking-tighter">
            <Trans
              i18nKey="pages.ecologicalImpact.title"
              components={{ br: <br />, span: <span className="ml-6" /> }}
            />
          </h1>
        </header>

        {/* Sections de contenu */}
        <div className="space-y-20 relative z-10">
          {sections.map((section) => (
            <section key={section.id} className="relative">
              <div className="max-w-3xl">
                {/* Header Section avec Icône */}
                <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-black mb-6">
                  <span className="text-3xl">{section.icon}</span>
                  {section.title}
                </h2>

                <p className="text-sm md:text-base font-bold text-gray-500 mb-4 tracking-wide">
                  {section.intro}
                </p>

                {/* Liste des points */}
                <ul className="space-y-2 mb-6 ml-4">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm md:text-base font-extrabold text-gray-800"
                    >
                      <span className="block w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Sous-section optionnelle (pour la section 1) */}
                {section.highlights && (
                  <div className="mt-8 mb-6">
                    <p className="text-sm md:text-base font-bold text-gray-500 mb-4">
                      {section.highlightTitle}
                    </p>
                    <ul className="space-y-2 ml-4">
                      {section.highlights.map((high, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm md:text-base font-extrabold text-gray-800 italic"
                        >
                          <span className="block w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></span>
                          {high}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conclusion de section (Texte avec la main 👉) */}
                <div className="flex items-start gap-3 mt-8 p-4 bg-gray-50/50 rounded-2xl">
                  <span className="text-orange-400 text-xl">👉</span>
                  <p className="text-sm md:text-base font-black text-gray-700 leading-snug tracking-tight">
                    {section.footerText}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImpactEcologique;
