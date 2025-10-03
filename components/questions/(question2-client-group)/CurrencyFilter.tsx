// components\questions\(question2-client-group)\CurrencyFilter.tsx

import { Country } from "./question2-types";
import { getCurrencyFromCountry } from "../formatters";

interface CurrencyFilterProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  countries: Country[];
  transactionCounts: Record<string, number>;
}

export default function CurrencyFilter({
  selectedCountry,
  onCountryChange,
  countries,
  transactionCounts,
}: CurrencyFilterProps) {
  const getCountryDisplay = (country: Country): string => {
    if (country === "All") return "All";
    return getCurrencyFromCountry(country as "ZA" | "US" | "EUR");
  };

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
            {country !== "All" && (
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
