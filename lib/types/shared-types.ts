// lib\types\shared-types.ts

export type Country = "All" | "ZA" | "US" | "EUR";
export type PaymentType = "All" | "card" | "bank" | "wallet";

export type Tx = {
  id: string;
  amount: number;
  country: "ZA" | "US" | "EUR";
  paymentType: "card" | "bank" | "wallet";
  scheme?: "visa" | "mastercard" | "amex";
  createdAt: string;
  hasCustomFee?: boolean; // Boolean flag to indicate custom fee override
};

export const countryCurrencyMap: Record<
  string,
  { code: string; locale: string }
> = {
  ZA: { code: "ZAR", locale: "en-ZA" },
  US: { code: "USD", locale: "en-US" },
  EUR: { code: "EUR", locale: "de-DE" },
};

export type Transaction = {
  id: string;
  amount: number;
  currency: "ZAR" | "USD" | "EUR";
  paymentType: "card" | "bank" | "wallet";
  scheme?: "visa" | "mastercard" | "amex";
  createdAt: string;
  fee?: number;
};

export type PaginationInfo = {
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
};

export type TransactionResponse = {
  data: Transaction[];
  pagination: PaginationInfo;
};

export type TransactionFilters = {
  currency?: "ZAR" | "USD" | "EUR";
  paymentType?: "card" | "bank" | "wallet";
  cursor?: string;
  limit?: number;
};
