// lib/services/transaction-policy-service.ts
import type {
  TransactionWithPolicyResponse,
  TransactionWithPolicyFilters,
} from "@/lib/hooks/use-transactions-with-policy";
import { mockTransactions } from "@/lib/data/mock-transactions";
import { mockTenantPolicy } from "@/lib/data/mock-policies";
import { resolveFeePolicy } from "@/lib/services/policy-resolver";

export async function getTransactionsWithPolicy(
  filters: TransactionWithPolicyFilters
): Promise<TransactionWithPolicyResponse> {
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

  const limit = filters.limit || 20;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < filtered.length;
  const nextCursor = hasMore
    ? paginatedData[paginatedData.length - 1].id
    : null;

  // Resolve policy for each transaction
  // In production, you'd fetch the tenant policy from database based on tenantId
  const results = paginatedData.map((tx) => ({
    transaction: tx,
    resolution: resolveFeePolicy({
      transaction: tx,
      tenantPolicy: mockTenantPolicy,
      merchantId: tx.id === "t_1" ? "merchant_premium" : undefined,
    }),
  }));

  return {
    results,
    pagination: {
      nextCursor,
      hasMore,
      total: filtered.length,
    },
  };
}
