import { useState, useRef, useEffect } from "react";

export interface Country {
  code: string; // ISO 3166-1 alpha-2 code
  name: string;
  phoneCode: string; // International dialing code
  flag: string; // Unicode flag emoji
}

// Pays supportés par Stripe Connect (basé sur l'enum backend)
const STRIPE_COUNTRIES: Country[] = [
  { code: "AU", name: "Australie", phoneCode: "+61", flag: "🇦🇺" },
  { code: "AT", name: "Autriche", phoneCode: "+43", flag: "🇦🇹" },
  { code: "BE", name: "Belgique", phoneCode: "+32", flag: "🇧🇪" },
  { code: "BR", name: "Brésil", phoneCode: "+55", flag: "🇧🇷" },
  { code: "BG", name: "Bulgarie", phoneCode: "+359", flag: "🇧🇬" },
  { code: "CA", name: "Canada", phoneCode: "+1", flag: "🇨🇦" },
  { code: "HR", name: "Croatie", phoneCode: "+385", flag: "🇭🇷" },
  { code: "CY", name: "Chypre", phoneCode: "+357", flag: "🇨🇾" },
  { code: "CZ", name: "République tchèque", phoneCode: "+420", flag: "🇨🇿" },
  { code: "DK", name: "Danemark", phoneCode: "+45", flag: "🇩🇰" },
  { code: "EE", name: "Estonie", phoneCode: "+372", flag: "🇪🇪" },
  { code: "FI", name: "Finlande", phoneCode: "+358", flag: "🇫🇮" },
  { code: "FR", name: "France", phoneCode: "+33", flag: "🇫🇷" },
  { code: "DE", name: "Allemagne", phoneCode: "+49", flag: "🇩🇪" },
  { code: "GI", name: "Gibraltar", phoneCode: "+350", flag: "🇬🇮" },
  { code: "GR", name: "Grèce", phoneCode: "+30", flag: "🇬🇷" },
  { code: "HK", name: "Hong Kong", phoneCode: "+852", flag: "🇭🇰" },
  { code: "HU", name: "Hongrie", phoneCode: "+36", flag: "🇭🇺" },
  { code: "IE", name: "Irlande", phoneCode: "+353", flag: "🇮🇪" },
  { code: "IT", name: "Italie", phoneCode: "+39", flag: "🇮🇹" },
  { code: "JP", name: "Japon", phoneCode: "+81", flag: "🇯🇵" },
  { code: "LV", name: "Lettonie", phoneCode: "+371", flag: "🇱🇻" },
  { code: "LI", name: "Liechtenstein", phoneCode: "+423", flag: "🇱🇮" },
  { code: "LT", name: "Lituanie", phoneCode: "+370", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", phoneCode: "+352", flag: "🇱🇺" },
  { code: "MY", name: "Malaisie", phoneCode: "+60", flag: "🇲🇾" },
  { code: "MT", name: "Malte", phoneCode: "+356", flag: "🇲🇹" },
  { code: "MX", name: "Mexique", phoneCode: "+52", flag: "🇲🇽" },
  { code: "NL", name: "Pays-Bas", phoneCode: "+31", flag: "🇳🇱" },
  { code: "NZ", name: "Nouvelle-Zélande", phoneCode: "+64", flag: "🇳🇿" },
  { code: "NO", name: "Norvège", phoneCode: "+47", flag: "🇳🇴" },
  { code: "PL", name: "Pologne", phoneCode: "+48", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", phoneCode: "+351", flag: "🇵🇹" },
  { code: "RO", name: "Roumanie", phoneCode: "+40", flag: "🇷🇴" },
  { code: "SG", name: "Singapour", phoneCode: "+65", flag: "🇸🇬" },
  { code: "SK", name: "Slovaquie", phoneCode: "+421", flag: "🇸🇰" },
  { code: "SI", name: "Slovénie", phoneCode: "+386", flag: "🇸🇮" },
  { code: "ES", name: "Espagne", phoneCode: "+34", flag: "🇪🇸" },
  { code: "SE", name: "Suède", phoneCode: "+46", flag: "🇸🇪" },
  { code: "CH", name: "Suisse", phoneCode: "+41", flag: "🇨🇭" },
  { code: "TH", name: "Thaïlande", phoneCode: "+66", flag: "🇹🇭" },
  { code: "AE", name: "Émirats arabes unis", phoneCode: "+971", flag: "🇦🇪" },
  { code: "GB", name: "Royaume-Uni", phoneCode: "+44", flag: "🇬🇧" },
  { code: "US", name: "États-Unis", phoneCode: "+1", flag: "🇺🇸" },
];

interface CountryComboBoxProps {
  label?: string;
  value?: string; // Country code
  onChange: (country: Country | null) => void;
  placeholder?: string;
  selectedCountry?: Country | null;
}

export default function CountryComboBox({
  label,
  value,
  onChange,
  placeholder = "Sélectionnez un pays",
  selectedCountry,
}: CountryComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCountries = STRIPE_COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayCountry = selectedCountry || STRIPE_COUNTRIES.find(c => c.code === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    onChange(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="mb-2 block text-sm font-semibold text-gray-900">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus transition-colors bg-white text-left flex items-center justify-between"
      >
        <div className="flex items-center">
          {displayCountry ? (
            <>
              <span className="mr-2 text-lg">{displayCountry.flag}</span>
              <span className="text-gray-900">{displayCountry.name}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-hidden">
          <div className="p-2">
            <input
              type="text"
              placeholder="Rechercher un pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full px-4 py-2 text-left hover flex items-center transition-colors ${
                    displayCountry?.code === country.code ? "bg-green-50 text-green-700" : "text-gray-900"
                  }`}
                >
                  <span className="mr-3 text-lg">{country.flag}</span>
                  <span className="flex-1">{country.name}</span>
                  <span className="text-sm text-gray-500">{country.phoneCode}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                Aucun pays trouvé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { STRIPE_COUNTRIES };