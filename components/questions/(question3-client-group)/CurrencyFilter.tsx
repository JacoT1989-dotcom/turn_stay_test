// components\questions\(question3-client-group)\CurrencyFilter.tsx

import { Country } from "./question3-types";

interface CurrencyFilterProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  countries: Country[];
}

export default function CurrencyFilter({
  selectedCountry,
  onCountryChange,
  countries,
}: CurrencyFilterProps) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Filter by Currency
      </label>
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
            {country}
          </button>
        ))}
      </div>
    </div>
  );
}
