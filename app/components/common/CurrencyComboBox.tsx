import { useEffect, useState } from "react";
import type { Currency } from "~/services/currencyService";
import { getAllCurrencies } from "~/services/currencyService";

type CurrencyComboBoxProps = {
  label?: string;
  value?: string; // currency code
  selectedCurrency?: Currency | null; // full currency object for better display
  onChange: (currency: Currency | null) => void;
  placeholder?: string;
  compact?: boolean; // For inline display beside price inputs
};

export default function CurrencyComboBox({
  label,
  value,
  selectedCurrency,
  onChange,
  placeholder = "Select currency",
  compact = false,
}: CurrencyComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all currencies on mount
  useEffect(() => {
    const loadCurrencies = async () => {
      setLoading(true);
      try {
        const result = await getAllCurrencies();
        setCurrencies(result);
      } catch (error) {
        console.error("Error loading currencies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.currency-dropdown')) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleSelect = (currency: Currency) => {
    onChange(currency);
    setOpen(false);
  };

  const displayValue = selectedCurrency 
    ? (compact ? selectedCurrency.code : `${selectedCurrency.name} (${selectedCurrency.code})`)
    : "";

  if (compact) {
    return (
      <div className="relative currency-dropdown">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-xl px-3 py-3 text-left outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between"
        >
          <span className={displayValue ? "" : "text-gray-400"}>
            {displayValue || placeholder}
          </span>
          <svg
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-64 rounded-md border border-gray-200 bg-white shadow-lg max-h-72 overflow-auto">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
            ) : currencies.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No currencies available</div>
            ) : (
              currencies.map((currency) => (
                <button
                  key={currency.id}
                  onClick={() => handleSelect(currency)}
                  className={`w-full text-left px-3 py-2 text-sm hover ${
                    selectedCurrency?.id === currency.id 
                      ? "bg-gray-100 text-indigo-600" 
                      : "text-gray-800"
                  }`}
                >
                  <div className="font-medium">
                    {currency.code} <span className="text-gray-500">({currency.symbol})</span>
                  </div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative currency-dropdown">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-xl px-3 py-2 text-left outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between"
        >
          <span className={displayValue ? "" : "text-gray-400"}>
            {displayValue || placeholder}
          </span>
          <svg
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-72 overflow-auto">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
            ) : currencies.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No currencies available</div>
            ) : (
              currencies.map((currency) => (
                <button
                  key={currency.id}
                  onClick={() => handleSelect(currency)}
                  className={`w-full text-left px-3 py-2 text-sm hover ${
                    selectedCurrency?.id === currency.id 
                      ? "bg-gray-100 text-indigo-600" 
                      : "text-gray-800"
                  }`}
                >
                  <div className="font-medium">
                    {currency.name} <span className="text-gray-500">({currency.code})</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {currency.symbol} - {currency.country}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
