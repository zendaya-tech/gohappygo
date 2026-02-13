import { useTranslation } from 'react-i18next';

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      id: 1,
      title: t('home.features.profitability.title'),
      description: t('home.features.profitability.description'),
      image: '/images/renta.jpg',
    },
    {
      id: 2,
      title: t('home.features.security.title'),
      description: t('home.features.security.description'),
      image: '/images/voyage.jpg',
    },
    {
      id: 3,
      title: t('home.features.simplicity.title'),
      description: t('home.features.simplicity.description'),
      image: '/images/bonheur.jpg',
    },
  ];

  return (
    <section className="py-20  ">
      <div className=" mx-auto px-4 flex flex-col items-center relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature) => {
            const IconComponent = feature.image;
            return (
              <div key={feature.id} className="group relative h-full">
                <div className="group rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col text-gray-900">
                  <div className="relative transition-colors duration-300">
                    <div className="mb-8">
                      <div className="relative text-center">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="text-white h-36 m-auto object-cover"
                        />
                      </div>
                    </div>

                    {/* Utilisation de group-hover sur les éléments enfants */}
                    <h3 className="text-xl font-bold mb-4 transition-colors duration-300 group-hover:text-blue-600">
                      {feature.title}
                    </h3>

                    <p className="text-justify leading-relaxed text-sm transition-colors duration-300 group-hover:text-blue-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="hidden md:flex absolute items-end mt-4  top-120 lg:top-95 left-[50%] transition-all duration-300 transform hover:scale-105">
          <img src="/images/arrowPink.png" alt="Aéroport" className="w-35 h-15 object-cover" />
          <span className="text-[#de179c] font-bold text-md lg:text-xl w-[55%] text-center">
            {t('home.features.verifiedTickets')}
          </span>
        </div>
      </div>
    </section>
  );
}
