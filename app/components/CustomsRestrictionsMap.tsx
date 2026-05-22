import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { customsData, type RestrictionTag } from '../data/customsData';

// Constrain exactly the 10 specifically calibrated targets via ID mapping
const customsCoordinates: Record<string, { top: string; left: string }> = {
  // --- North & South America ---
  CA: { top: '23.5%', left: '19.8%' }, // Ottawa / Montreal Region
  US: { top: '35.0%', left: '21.0%' }, // Washington D.C. / East Coast Hub
  BR: { top: '63.5%', left: '33.8%' }, // Brasília / Central Atlantic Coast
  AR: { top: '78.5%', left: '30.2%' }, // Buenos Aires / La Plata Region

  // --- Europe ---
  GB: { top: '24.0%', left: '46.8%' }, // London Hub
  FR: { top: '28.5%', left: '48.5%' }, // Paris / Central France

  // --- Africa ---
  CI: { top: '56.0%', left: '46.1%' }, // Abidjan Airport Hub
  ZA: { top: '77.5%', left: '53.8%' }, // Johannesburg / Pretoria Region

  // --- Middle East & Asia ---
  SA: { top: '44.5%', left: '59.8%' }, // Riyadh Terminal
  AE: { top: '43.0%', left: '61.8%' }, // Dubai / Abu Dhabi Interface
};

export default function CustomsRestrictionsMap() {
  const { t } = useTranslation();

  // Create a filtered list of only the 10 specified countries
  const activeCountries = customsData.filter((c) => customsCoordinates[c.id]);

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    activeCountries[0]?.id || 'US'
  );

  const selectedCountry =
    activeCountries.find((c) => c.id === selectedCountryCode) || activeCountries[0];

  const renderTags = (tags: RestrictionTag[]) => (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => {
        const text = tag.translationKey ? t(tag.translationKey, tag.label) : tag.label;
        let colorClasses = '';
        switch (tag.color) {
          case 'red':
            colorClasses = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
            break;
          case 'amber':
            colorClasses = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
            break;
          case 'blue':
            colorClasses = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
            break;
          default:
            colorClasses = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
        return (
          <span
            key={idx}
            className={`text-[11px] px-2.5 py-1 flex items-center rounded-md font-medium leading-tight border border-transparent ${
              tag.color === 'red'
                ? 'dark:border-red-800/50'
                : tag.color === 'amber'
                  ? 'dark:border-amber-800/50'
                  : 'dark:border-blue-800/50'
            } ${colorClasses}`}
          >
            {text}
          </span>
        );
      })}
    </div>
  );

  if (!selectedCountry) return null;

  return (
    <section className="flex flex-col w-full max-w-5xl mx-auto px-4 py-6">
      {/* THE MAP BOUNDING BOX */}
      <div className="relative w-full aspect-21/9 max-h-[340px] sm:max-h-[380px] md:max-h-[420px] bg-gray-50/60 border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-8">
        <img
          src="/images/map.svg"
          alt={t('customs.map.alt', 'World map showing customs restrictions by country')}
          className="w-full h-full object-contain pointer-events-none select-none opacity-80"
          style={{ filter: 'brightness(0.7)' }}
        />

        {activeCountries.map((country) => {
          const isActive = selectedCountryCode === country.id;
          const coords = customsCoordinates[country.id];

          return (
            <div
              key={country.id}
              onClick={() => setSelectedCountryCode(country.id)}
              className="absolute cursor-pointer flex items-center justify-center group -translate-x-1/2 -translate-y-1/2"
              style={{
                top: coords.top,
                left: coords.left,
              }}
              title={country.name}
            >
              {/* Glowing Dot Ring for Active State */}
              <div
                className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'w-7 h-7 bg-blue-500/20 shadow-xl'
                    : 'w-5 h-5 bg-transparent group-hover:bg-blue-500/10'
                }`}
              >
                {/* Ping animation wrapper when active */}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping"
                    style={{ animationDuration: '3s' }}
                  ></div>
                )}

                {/* Core Dot (Exactly mapped via Translate-x/y of the container) */}
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 relative z-10 ${
                    isActive
                      ? 'bg-blue-600 shadow-[0_0_10px_2px_rgba(59,130,246,0.9)] scale-110'
                      : 'bg-blue-400'
                  }`}
                />
              </div>

              {/* Tooltip on active */}
              {isActive && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white dark:bg-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-sm font-semibold px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 z-30 pointer-events-none animate-in fade-in slide-in-from-top-2">
                  <span className="mr-2 text-lg leading-none">{country.flag}</span>
                  {country.nameKey ? t(country.nameKey, country.name) : country.name}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* THE DATA CONTAINER (Directly Below) */}
      <div className="w-full bg-white rounded-xl border border-gray-100 p-6 shadow-sm transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
        {/* Responsive Table Implementation avoiding severe squishing */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left align-top min-w-[900px]">
            <thead className="bg-gray-50/50 dark:bg-gray-800/40 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
              <tr>
                <th className="px-5 py-4 w-[180px] rounded-tl-lg border-b border-gray-100 dark:border-gray-800">
                  {t('customs.table.country', 'Pays')}
                </th>
                <th className="px-5 py-4 w-[240px] border-b border-gray-100 dark:border-gray-800">
                  {t('customs.table.prohibited', 'Produits interdits / réglementés')}
                </th>
                <th className="px-5 py-4 w-[240px] border-b border-gray-100 dark:border-gray-800">
                  {t('customs.table.rules', 'Règles devises & alimentaires')}
                </th>
                <th className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  {t('customs.table.specificities', 'Spécificités douanières notables')}
                </th>
                <th className="px-5 py-4 w-[140px] rounded-tr-lg border-b border-gray-100 dark:border-gray-800">
                  {t('customs.table.liquids', 'Liquides cabine')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-5 py-6 align-top">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl leading-none">{selectedCountry.flag}</span>
                    <span className="font-bold text-base whitespace-nowrap text-gray-900 dark:text-gray-100">
                      {selectedCountry.nameKey
                        ? t(selectedCountry.nameKey, selectedCountry.name)
                        : selectedCountry.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 inline-block px-2 py-1 rounded">
                    {selectedCountry.subtitleKey
                      ? t(selectedCountry.subtitleKey, selectedCountry.subtitle)
                      : selectedCountry.subtitle}
                  </div>
                </td>
                <td className="px-5 py-6 align-top">{renderTags(selectedCountry.prohibited)}</td>
                <td className="px-5 py-6 align-top">{renderTags(selectedCountry.currencyFood)}</td>
                <td className="px-5 py-6 align-top">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[13px]">
                    {selectedCountry.specificitiesKey
                      ? t(selectedCountry.specificitiesKey, selectedCountry.specificities)
                      : selectedCountry.specificities}
                  </p>
                </td>
                <td className="px-5 py-6 align-top">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[13px]">
                    {selectedCountry.liquidsKey
                      ? t(selectedCountry.liquidsKey, selectedCountry.liquids)
                      : selectedCountry.liquids}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
