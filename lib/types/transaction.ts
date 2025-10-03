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

export const mockTransactions: Transaction[] = [
  {
    id: "t_1",
    amount: 125000,
    currency: "ZAR",
    paymentType: "card",
    scheme: "visa",
    createdAt: "2025-09-10T10:00:00Z",
  },
  {
    id: "t_2",
    amount: 56000,
    currency: "USD",
    paymentType: "card",
    scheme: "mastercard",
    createdAt: "2025-09-11T12:15:00Z",
    fee: 290,
  },
  {
    id: "t_3",
    amount: 99000,
    currency: "ZAR",
    paymentType: "bank",
    createdAt: "2025-09-12T09:30:00Z",
  },
  {
    id: "t_4",
    amount: 45000,
    currency: "EUR",
    paymentType: "wallet",
    createdAt: "2025-09-12T10:05:00Z",
  },
  {
    id: "t_5",
    amount: 200000,
    currency: "ZAR",
    paymentType: "card",
    scheme: "amex",
    createdAt: "2025-09-12T12:00:00Z",
  },
  {
    id: "t_6",
    amount: 75000,
    currency: "USD",
    paymentType: "card",
    scheme: "visa",
    createdAt: "2025-09-13T14:20:00Z",
  },
  {
    id: "t_7",
    amount: 150000,
    currency: "ZAR",
    paymentType: "bank",
    createdAt: "2025-09-13T16:45:00Z",
  },
  {
    id: "t_8",
    amount: 89000,
    currency: "EUR",
    paymentType: "wallet",
    createdAt: "2025-09-14T09:10:00Z",
  },
  {
    id: "t_9",
    amount: 120000,
    currency: "USD",
    paymentType: "card",
    scheme: "mastercard",
    createdAt: "2025-09-14T11:30:00Z",
  },
  {
    id: "t_10",
    amount: 95000,
    currency: "ZAR",
    paymentType: "card",
    scheme: "visa",
    createdAt: "2025-09-15T13:25:00Z",
  },
];
