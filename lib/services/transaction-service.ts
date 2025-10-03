// lib/services/transaction-service.ts
import type {
  Transaction,
  TransactionResponse,
  TransactionFilters,
} from "@/lib/types/transaction";

// Mock database - in production this would be a real database connection
const mockTransactions: Transaction[] = [
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

export async function getTransactions(
  filters: TransactionFilters
): Promise<TransactionResponse> {
  // In production, this would be a database query
  let filtered = [...mockTransactions];

  // Apply filters
  if (filters.currency) {
    filtered = filtered.filter((tx) => tx.currency === filters.currency);
  }

  if (filters.paymentType) {
    filtered = filtered.filter((tx) => tx.paymentType === filters.paymentType);
  }

  // Sort by date descending (newest first)
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Apply cursor pagination
  let startIndex = 0;
  if (filters.cursor) {
    const cursorIndex = filtered.findIndex((tx) => tx.id === filters.cursor);
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  }

  const limit = filters.limit || 5;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < filtered.length;
  const nextCursor = hasMore
    ? paginatedData[paginatedData.length - 1].id
    : null;

  return {
    data: paginatedData,
    pagination: {
      nextCursor,
      hasMore,
      total: filtered.length,
    },
  };
}
