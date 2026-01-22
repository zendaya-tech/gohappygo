import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '~/hooks/useLanguage';

interface Language {
    code: string;
    name: string;
    countryCode: string;
}

export default function LanguageDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const { currentLanguage, changeLanguage } = useLanguage();

    const languages: Language[] = [
        { code: 'fr', name: t('languages.fr'), countryCode: 'FR' },
        { code: 'en', name: t('languages.en'), countryCode: 'GB' },
        { code: 'de', name: t('languages.de'), countryCode: 'DE' },
        { code: 'es', name: t('languages.es'), countryCode: 'ES' },
        { code: 'it', name: t('languages.it'), countryCode: 'IT' },
        { code: 'pt', name: t('languages.pt'), countryCode: 'PT' },
        { code: 'ru', name: t('languages.ru'), countryCode: 'RU' },
        { code: 'tr', name: t('languages.tr'), countryCode: 'TR' },
        { code: 'zh', name: t('languages.zh'), countryCode: 'CN' },
        { code: 'ar', name: t('languages.ar'), countryCode: 'AE' },
        { code: 'hi', name: t('languages.hi'), countryCode: 'IN' },
        { code: 'bn', name: t('languages.bn'), countryCode: 'BD' },
        { code: 'pa', name: t('languages.pa'), countryCode: 'IN' },
        { code: 'te', name: t('languages.te'), countryCode: 'IN' },
        { code: 'ta', name: t('languages.ta'), countryCode: 'IN' },
        { code: 'th', name: t('languages.th'), countryCode: 'TH' },
        { code: 'vi', name: t('languages.vi'), countryCode: 'VN' },
        { code: 'id', name: t('languages.id'), countryCode: 'ID' },
        { code: 'ms', name: t('languages.ms'), countryCode: 'MY' },
        { code: 'fil', name: t('languages.fil'), countryCode: 'PH' },
        { code: 'ja', name: t('languages.ja'), countryCode: 'JP' },
        { code: 'ko', name: t('languages.ko'), countryCode: 'KR' },
        { code: 'ar', name: t('languages.ar'), countryCode: 'AE' },
        { code: 'hi', name: t('languages.hi'), countryCode: 'IN' },
        { code: 'bn', name: t('languages.bn'), countryCode: 'BD' },
        { code: 'pa', name: t('languages.pa'), countryCode: 'IN' },
        { code: 'te', name: t('languages.te'), countryCode: 'IN' },
        { code: 'ta', name: t('languages.ta'), countryCode: 'IN' },
        { code: 'th', name: t('languages.th'), countryCode: 'TH' },
        { code: 'vi', name: t('languages.vi'), countryCode: 'VN' },
        { code: 'id', name: t('languages.id'), countryCode: 'ID' },
        { code: 'ms', name: t('languages.ms'), countryCode: 'MY' },
        { code: 'fil', name: t('languages.fil'), countryCode: 'PH' },
        { code: 'ja', name: t('languages.ja'), countryCode: 'JP' },
        { code: 'ko', name: t('languages.ko'), countryCode: 'KR' },
        { code: 'ar', name: t('languages.ar'), countryCode: 'AE' },
        { code: 'hi', name: t('languages.hi'), countryCode: 'IN' },
        { code: 'bn', name: t('languages.bn'), countryCode: 'BD' },
        { code: 'pa', name: t('languages.pa'), countryCode: 'IN' },
        { code: 'te', name: t('languages.te'), countryCode: 'IN' },
        { code: 'ta', name: t('languages.ta'), countryCode: 'IN' },
        { code: 'th', name: t('languages.th'), countryCode: 'TH' },
        { code: 'vi', name: t('languages.vi'), countryCode: 'VN' },
        { code: 'id', name: t('languages.id'), countryCode: 'ID' },
        { code: 'ms', name: t('languages.ms'), countryCode: 'MY' },
        { code: 'fil', name: t('languages.fil'), countryCode: 'PH' },
        { code: 'ja', name: t('languages.ja'), countryCode: 'JP' },
        { code: 'ko', name: t('languages.ko'), countryCode: 'KR' },
        { code: 'ar', name: t('languages.ar'), countryCode: 'AE' },
        { code: 'hi', name: t('languages.hi'), countryCode: 'IN' },
        { code: 'bn', name: t('languages.bn'), countryCode: 'BD' },
        { code: 'pa', name: t('languages.pa'), countryCode: 'IN' },
        { code: 'te', name: t('languages.te'), countryCode: 'IN' },
        { code: 'ta', name: t('languages.ta'), countryCode: 'IN' },
        { code: 'th', name: t('languages.th'), countryCode: 'TH' },
        { code: 'vi', name: t('languages.vi'), countryCode: 'VN' },
        { code: 'id', name: t('languages.id'), countryCode: 'ID' },
        { code: 'ms', name: t('languages.ms'), countryCode: 'MY' },
        { code: 'fil', name: t('languages.fil'), countryCode: 'PH' }
    ];

    const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isOpen && !target.closest('.language-dropdown')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleLanguageSelect = (languageCode: string) => {
        changeLanguage(languageCode);
        setIsOpen(false);
    };

    return (
        <div className="relative language-dropdown">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover px-3 py-1.5 rounded-lg hover transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
            >
                <img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${currentLang.countryCode}.svg`} alt={currentLang.name} className="w-5 h-4 object-cover rounded-sm" />

                <span>{currentLang.name}</span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {/* Language Menu Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => handleLanguageSelect(language.code)}
                            className={`w-full px-4 py-3 text-left hover transition-colors duration-200 flex items-center gap-3 ${currentLanguage === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                }`}
                        >
                            <img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${language.countryCode}.svg`} alt={language.name} className="w-5 h-4 object-cover rounded-sm" />
                            <span className="font-medium">{language.name}</span>
                            {currentLanguage === language.code && (
                                <svg className="w-4 h-4 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
