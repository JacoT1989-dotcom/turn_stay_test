// components/questions/shared/types.ts

export type Country = "All" | "ZA" | "US" | "EUR";
export type PaymentType = "All" | "card" | "bank" | "wallet";

export type Tx = {
  id: string;
  amount: number;
  country: "ZA" | "US" | "EUR";
  paymentType: "card" | "bank" | "wallet";
  scheme?: "visa" | "mastercard" | "amex";
  createdAt: string;
  fee?: number;
};

export const countryCurrencyMap: Record<
  string,
  { code: string; locale: string }
> = {
  ZA: { code: "ZAR", locale: "en-ZA" },
  US: { code: "USD", locale: "en-US" },
  EUR: { code: "EUR", locale: "de-DE" },
};
