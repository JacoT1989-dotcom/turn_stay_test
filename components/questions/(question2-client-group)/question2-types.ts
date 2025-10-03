// types/question2.ts

export type Tx = {
  id: string;
  amount: number;
  country: "ZA" | "US" | "EUR";
  paymentType: "card" | "bank" | "wallet";
  scheme?: "visa" | "mastercard" | "amex";
  createdAt: string;
  fee?: number;
};

export type Country = "All" | "ZA" | "US" | "EUR";

/**
 * Map country codes to their currencies
 */
export const countryCurrencyMap: Record<
  string,
  { code: string; locale: string }
> = {
  ZA: { code: "ZAR", locale: "en-ZA" },
  US: { code: "USD", locale: "en-US" },
  EUR: { code: "EUR", locale: "de-DE" },
};
