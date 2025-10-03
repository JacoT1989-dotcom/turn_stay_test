// components/questions/filterUtils.ts

import { Country, PaymentType, Tx } from "./shared-types";

/**
 * Filters transactions by country
 */
export function filterByCountry(transactions: Tx[], country: Country): Tx[] {
  if (country === "All") return transactions;
  return transactions.filter((tx) => tx.country === country);
}

/**
 * Filters transactions by payment type
 */
export function filterByPaymentType(
  transactions: Tx[],
  paymentType: PaymentType
): Tx[] {
  if (paymentType === "All") return transactions;
  return transactions.filter((tx) => tx.paymentType === paymentType);
}

/**
 * Filters transactions by multiple criteria
 * This is composable and avoids nested if-statements
 */
export function filterTransactions(
  transactions: Tx[],
  filters: {
    country?: Country;
    paymentType?: PaymentType;
  }
): Tx[] {
  return transactions.filter((tx) => {
    const matchesCountry =
      !filters.country ||
      filters.country === "All" ||
      tx.country === filters.country;
    const matchesPaymentType =
      !filters.paymentType ||
      filters.paymentType === "All" ||
      tx.paymentType === filters.paymentType;

    return matchesCountry && matchesPaymentType;
  });
}

/**
 * Calculate transaction counts by country
 */
export function getCountryCounts(
  transactions: Tx[],
  countries: Country[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  countries.forEach((country) => {
    if (country !== "All") {
      counts[country] = transactions.filter(
        (tx) => tx.country === country
      ).length;
    }
  });
  return counts;
}

/**
 * Calculate transaction counts by payment type
 */
export function getPaymentTypeCounts(
  transactions: Tx[],
  paymentTypes: PaymentType[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  paymentTypes.forEach((type) => {
    if (type !== "All") {
      counts[type] = transactions.filter(
        (tx) => tx.paymentType === type
      ).length;
    }
  });
  return counts;
}
