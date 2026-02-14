import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import React from 'react';

import { useTranslation, Trans } from 'react-i18next';

const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = [
    {
      id: 1,
      number: '1',
      icon: '✨',
      title: t('pages.howItWorks.steps.0.title'),
      items: t('pages.howItWorks.steps.0.items', { returnObjects: true }) as string[],
      description: t('pages.howItWorks.steps.0.description'),
      numberPosition: 'right-[90%] top-[-30px] md:right-45 md:top-0',
      numbercirclePosition: 'right-0 top-0 md:right-[-80px] md:top-[-10px]',
    },
    {
      id: 2,
      number: '2',
      icon: '🤝',
      title: t('pages.howItWorks.steps.1.title'),
      items: t('pages.howItWorks.steps.1.items', { returnObjects: true }) as string[],
      description: t('pages.howItWorks.steps.1.description'),
      numberPosition: 'left-4 top-[-30px] md:left-20 md:top-0',
      numbercirclePosition: 'right-0 top-0 md:right-[-25px] md:top-20',
    },
    {
      id: 3,
      number: '3',
      icon: '💳',
      title: t('pages.howItWorks.steps.2.title'),
      items: t('pages.howItWorks.steps.2.items', { returnObjects: true }) as string[],
      description: t('pages.howItWorks.steps.2.description'),
      numberPosition: 'right-[90%] top-[-30px] md:right-45 md:top-0',
      numbercirclePosition: 'right-0 top-0 md:right-[-64px] md:top-[-10px]',
    },
  ];

  return (
    <div className="md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <div className="relative w-full max-w-4xl mx-auto px-6 py-12 font-sans overflow-hidden bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        {/* Titre Principal */}
        <h1 className="text-4xl md:text-5xl font-black text-blue-600 mb-16 leading-tight uppercase italic">
          <Trans
            i18nKey="pages.howItWorks.title"
            components={{ br: <br />, span: <span className="ml-6" /> }}
          />
        </h1>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Grand Numéro Bleu en Arrière-plan */}
              <div className={`absolute ${step.numberPosition} z-0 select-none`}>
                <span className="text-[3rem] md:text-[12rem] font-black text-blue-600 leading-none italic">
                  {step.number}
                </span>
                {/* Cercle décoratif autour du numéro */}
                <div
                  className={`absolute ${step.numbercirclePosition} border-[3px] border-blue-600 rounded-full scale-125 opacity-80 h-[30px] w-[30px] md:h-[120px] md:w-[120px]`}
                />
              </div>

              {/* Contenu de l'étape */}
              <div className={`flex flex-col items-start ${index === 1 && 'md:items-end'}`}>
                <div className="max-w-xl">
                  <h2 className="flex items-center  text-xl md:text-2xl font-extrabold text-black mb-4">
                    <span>{step.icon}</span>
                    {step.title}
                  </h2>

                  <ul className="space-y-2 mb-6">
                    {step.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm md:text-base font-bold text-gray-800"
                      >
                        <span className="block w-2 h-2 bg-black rounded-full shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 text-xl mt-1">👉</span>
                    <p className="text-sm md:text-base font-bold text-gray-600 tracking-wide leading-snug">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
