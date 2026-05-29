import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { customsData, type RestrictionTag } from '../data/customsData';

// Constrain exactly the 10 specifically calibrated targets via ID mapping
const customsCoordinates: Record<string, { top: string; left: string }> = {
  // --- North & South America ---
  CA: { top: '37%', left: '29%' }, // Ottawa / Montreal Region
  US: { top: '52%', left: '32%' }, // Washington D.C. / East Coast Hub
  BR: { top: '73%', left: '40%' }, // Brasília / Central Atlantic Coast
  AR: { top: '84%', left: '37%' }, // Buenos Aires / La Plata Region

  // --- Europe ---
  GB: { top: '43%', left: '47.8%' }, // London Hub
  FR: { top: '47.5%', left: '48.5%' }, // Paris / Central France

  // --- Africa ---
  CI: { top: '65.7%', left: '47.2%' }, // Abidjan Airport Hub
  ZA: { top: '80.5%', left: '52.5%' }, // Johannesburg / Pretoria Region

  // --- Middle East & Asia ---
  SA: { top: '59.5%', left: '56%' }, // Riyadh Terminal
  AE: { top: '58.7%', left: '57.6%' }, // Dubai / Abu Dhabi Interface
  MX: { top: '59%', left: '31%' }, // Mexico City Hub
  IN: { top: '59%', left: '62%' }, // New Delhi / Mumbai Interface
  CN: { top: '55%', left: '66%' }, // Beijing / Shanghai Region
  JP: { top: '53%', left: '72%' }, // Tokyo / Osaka Hub
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
      {/* THE MAP BOUNDING BOX (Responsive scrollable view on mobile devices) */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        <div className="relative w-full min-w-[750px] md:min-w-0 aspect-[21/9] bg-gray-50/60 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-6">
          <img
            src="/images/map.svg"
            alt={t('customs.map.alt', 'World map showing customs restrictions by country')}
            className="w-full h-full object-contain pointer-events-none select-none opacity-80"
            style={{ filter: 'brightness(0.2)' }}
          />

          {activeCountries.map((country) => {
            const isActive = selectedCountryCode === country.id;
            const coords = customsCoordinates[country.id];

            return (
              <div
                key={country.id}
                onClick={() => setSelectedCountryCode(country.id)}
                className="absolute cursor-pointer flex flex-col items-center justify-center group -translate-x-1/2 -translate-y-1/2 select-none"
                style={{
                  top: coords.top,
                  left: coords.left,
                  zIndex: isActive ? 30 : 10,
                }}
                title={country.name}
              >
                {/* FLAG CAPSULE CONTROLLER (The main static dot button triggers) */}
                <div
                  className={`transition-all duration-200 flex items-center justify-center bg-white dark:bg-gray-800 px-1 py-1 rounded-full border shadow-[0_2px_6px_rgba(0,0,0,0.15)] ${
                    isActive
                      ? 'border-blue-600 ring-2 ring-blue-500/30 scale-110'
                      : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                  }`}
                />

                {/* Styled Indicator Label Tooltip appearing underneath the flag label capsule */}
                {isActive && (
                  <div className="flex justify-center items-center gap-2 absolute top-full mt-1.5 whitespace-nowrap bg-blue-600 text-white shadow-md text-[11px] font-bold px-4 py-1 rounded pointer-events-none animate-in fade-in slide-in-from-top-1">
                    {/* SVG Vector Flag Image Element (Replacing the original text emoji) */}
                    <img
                      src={`https://flagcdn.com/${country.id.toLowerCase()}.svg`}
                      alt={`Flag of ${country.name}`}
                      className="w-6 h-auto max-h-4 object-contain rounded-sm shadow-sm"
                    />

                    <span>{country.nameKey ? t(country.nameKey, country.name) : country.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* THE DATA CONTAINER */}
      <div className="w-full bg-white rounded-xl border border-gray-100 p-2 shadow-sm transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left align-top min-w-225">
            <thead className="bg-gray-50/50 dark:bg-gray-800/40 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
              <tr>
                <th className="px-5 py-4 w-45 rounded-tl-lg border-b border-gray-100 dark:border-gray-800">
                  {t('customs.table.country', 'Pays')}
                </th>
                <th className="px-5 py-4 w-60 border-b border-gray-100 dark:border-gray-800">
                  {t('customs.table.prohibited', 'Produits interdits / réglementés')}
                </th>
                <th className="px-5 py-4 w-60 border-b border-gray-100 dark:border-gray-800">
                  {t('customs.table.rules', 'Règles devises & alimentaires')}
                </th>
                <th className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  {t('customs.table.specificities', 'Spécificités douanières notables')}
                </th>
                <th className="px-5 py-4 w-35 rounded-tr-lg border-b border-gray-100 dark:border-gray-800">
                  {t('customs.table.liquids', 'Liquides cabine')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-5 py-6 align-top">
                  <div className="flex items-center gap-2 mb-2">
                    {/* SVG Vector Flag also applied to the detailed bottom table description row */}
                    <img
                      src={`https://flagcdn.com/${selectedCountry.id.toLowerCase()}.svg`}
                      alt=""
                      className="w-7 h-auto max-h-5 object-contain rounded-sm border border-gray-100 shadow-sm mr-1"
                    />
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
