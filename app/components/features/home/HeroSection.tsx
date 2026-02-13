import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import SearchFiltersBar from '~/components/forms/SearchFiltersBar';

export default function HeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = () => {
    navigate('/annonces');
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="order-2 lg:order-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {t('home.hero.subtitle')}
          </h1>
          <p className="text-blue-600 text-xl sm:text-2xl mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-2 font-regular mt-10">
            Emportez autant de bagages que vous le desirez avec{' '}
            <span className="text-[#de179c] font-regular">GoHappyGo</span> lors de votre voyage
          </p>
        </div>

        {/* Hero Images */}
        <div className="order-1 lg:order-2 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-32 sm:h-40 md:h-48 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src="/images/history-converted.webp"
                alt="Avion en vol"
                className="w-full h-full object-cover "
              />
            </div>
            <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-28 sm:h-36 md:h-42 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src="/images/rencontre2-converted.webp"
                alt="Valise"
                className="w-full h-full object-cover "
              />
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
            <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-24 sm:h-28 md:h-32 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&h=200&fit=crop"
                alt="Colis"
                className="w-full h-full object-cover "
              />
            </div>
            <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-32 sm:h-38 md:h-44 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src="/images/rencontre1-converted.webp"
                alt="Aéroport"
                className="w-full h-full object-cover "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="mt-8 sm:mt-10 md:mt-12 relative">
        <SearchFiltersBar />
        <div className="hidden md:flex absolute top-18 justify-around gap-[5%] lg:gap-[45%] w-full ">
          <div className="flex flex-col items-center mt-4">
            <img
              src="/images/arrowBlue.png"
              alt="Aéroport"
              className="w-35 h-15 object-cover hover:scale-105 transition-transform duration-300"
            />
            <span className="text-blue-600 font-bold text-md lg:text-xl text-nowrap">
              Recherche par destination
            </span>
          </div>
          <div className="flex flex-col lg:flex-row justify-center items-center  ">
            <img
              src="/images/arrowYelow.png"
              alt="Aéroport"
              className="w-20 h-30 ml-10 lg:ml-0 lg:w-25 lg:h-35 object-cover hover:scale-105 transition-transform duration-300"
            />
            <span className="text-yellow-500 font-bold text-md lg:text-xl text-nowrap">
              Recherche par Numéro de vol
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
