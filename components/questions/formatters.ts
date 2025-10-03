// utils/formatters.ts

import { countryCurrencyMap } from "./(question2-client-group)/question2-types";

/**
 * Format amount from minor units (cents) to major units with currency symbol
 * @param amount - Amount in cents
 * @param country - Country code (ZA, US, EUR)
 * @returns Formatted string with currency symbol
 */
export const formatAmount = (
  amount: number,
  country: "ZA" | "US" | "EUR"
): string => {
  const majorUnits = amount / 100;
  const currencyInfo = countryCurrencyMap[country];

  return majorUnits.toLocaleString(currencyInfo.locale, {
    style: "currency",
    currency: currencyInfo.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Get currency code from country
 * @param country - Country code
 * @returns Currency code (ZAR, USD, EUR)
 */
export const getCurrencyFromCountry = (
  country: "ZA" | "US" | "EUR"
): string => {
  return countryCurrencyMap[country].code;
};

/**
 * Format ISO date to readable format
 * @param isoDate - ISO 8601 date string
 * @returns Formatted date string
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
