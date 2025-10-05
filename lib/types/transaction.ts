// lib/types/transaction.ts

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
