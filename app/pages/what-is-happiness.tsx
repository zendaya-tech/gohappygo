import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const LeBonheur = () => {
  const { t } = useTranslation();

  const sections = [
    {
      id: 1,
      icon: '❤️',
      title: t('pages.whatIsHappiness.section1.title'),
      content: t('pages.whatIsHappiness.section1.content'),
      items: t('pages.whatIsHappiness.section1.items', { returnObjects: true }) as string[],
      footer: t('pages.whatIsHappiness.section1.footer'),
    },
    {
      id: 2,
      icon: '🌍',
      title: t('pages.whatIsHappiness.section2.title'),
      content: t('pages.whatIsHappiness.section2.content'),
      items: t('pages.whatIsHappiness.section2.items', { returnObjects: true }) as string[],
      footer: t('pages.whatIsHappiness.section2.footer'),
    },
    {
      id: 3,
      icon: '✨',
      title: t('pages.whatIsHappiness.section3.title'),
      content: t('pages.whatIsHappiness.section3.content'),
      items: t('pages.whatIsHappiness.section3.items', { returnObjects: true }) as string[],
      footer: t('pages.whatIsHappiness.section3.footer'),
    },
  ];

  return (
    <div className="md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-16 font-sans bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        {/* Titre Principal */}
        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-blue-600 leading-tight uppercase italic tracking-tighter whitespace-pre-line">
            <Trans
              i18nKey="pages.whatIsHappiness.title"
              components={{ br: <br />, span: <span className="ml-6" /> }}
            />
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
          <p className="text-lg md:text-xl font-black text-blue-600 uppercase italic tracking-tighter leading-tight whitespace-pre-line">
            {t('pages.whatIsHappiness.footer')}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LeBonheur;
