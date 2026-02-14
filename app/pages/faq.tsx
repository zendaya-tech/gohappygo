import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import { Trans, useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const faqData = t('pages.faqPage.questions', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <div className="md:bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover bg-center">
      <Header />

      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-16 font-sans bg-[url('/images/footerLinksbackground.jpeg')] bg-no-repeat bg-cover md:bg-none">
        {/* Titre Principal - Style identique aux autres pages */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-blue-600 leading-tight uppercase italic tracking-tighter whitespace-pre-line">
            <Trans
              i18nKey="pages.faqPage.title"
              components={{ br: <br />, span: <span className="ml-6" /> }}
            />
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
