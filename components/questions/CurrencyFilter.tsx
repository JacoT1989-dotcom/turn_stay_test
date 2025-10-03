// components/questions/shared/CurrencyFilter.tsx

import { getCurrencyFromCountry } from "./formatters";
import { Country } from "./shared-types";

interface CurrencyFilterProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  countries: Country[];
  transactionCounts?: Record<string, number>;
  variant?: "tabs" | "buttons";
  showLabel?: boolean;
}

export default function CurrencyFilter({
  selectedCountry,
  onCountryChange,
  countries,
  transactionCounts,
  variant = "tabs",
  showLabel = false,
}: CurrencyFilterProps) {
  const getCountryDisplay = (country: Country): string => {
    if (country === "All") return "All";
    return getCurrencyFromCountry(country as "ZA" | "US" | "EUR");
  };

  if (variant === "buttons") {
    return (
      <div>
        {showLabel && (
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Filter by Currency
          </label>
        )}
        <div className="flex gap-2 flex-wrap">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => onCountryChange(country)}
              className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCountry === country
                  ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              {getCountryDisplay(country)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Tab variant (default)
  return (
    <div className="inline-flex rounded-xl p-1 w-full sm:w-auto overflow-x-auto bg-gray-100 dark:bg-gray-700">
      {countries.map((country) => (
        <button
          key={country}
          onClick={() => onCountryChange(country)}
          className={`relative px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
            selectedCountry === country
              ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <span className="flex items-center gap-2">
            {getCountryDisplay(country)}
            {country !== "All" && transactionCounts && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCountry === country
                    ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                }`}
              >
                {transactionCounts[country] || 0}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
