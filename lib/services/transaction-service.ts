// lib/services/transaction-service.ts
import {
  type TransactionResponse,
  type TransactionFilters,
  mockTransactions,
} from "@/lib/types/transaction";

// Mock database - in production this would be a real database connection

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
