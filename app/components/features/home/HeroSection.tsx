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
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-poppins leading-tight">
                        Emportez autant de bagages que vous le desirez avec{" "}
                        <span className="text-blue-600 text-3xl sm:text-4xl md:text-5xl font-black">
                            GoHappyGo
                        </span>{" "}
                        lors de votre voyage
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-2">
                        {t('home.hero.subtitle')}
                    </p>
                </div>

                {/* Hero Images */}
                <div className="order-1 lg:order-2 grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-3 sm:space-y-4">
                        <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-32 sm:h-40 md:h-48 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <img src="/images/history-converted.webp" alt="Avion en vol" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-28 sm:h-36 md:h-42 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <img src="/images/rencontre2-converted.webp" alt="Valise" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                        <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-24 sm:h-28 md:h-32 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <img src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&h=200&fit=crop" alt="Colis" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-32 sm:h-38 md:h-44 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <img src="/images/rencontre1-converted.webp" alt="Aéroport" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Form */}
            <div className="mt-8 sm:mt-10 md:mt-12">
                <SearchFiltersBar />
            </div>
        </section>
    );
} 