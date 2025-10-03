// utils/formatters.ts

/**
 * Format amount from minor units (cents) to major units with thousand separators
 * @param amount - Amount in cents
 * @returns Formatted string with 2 decimal places
 */
export const formatAmount = (amount: number): string => {
  const majorUnits = amount / 100;
  return majorUnits.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
