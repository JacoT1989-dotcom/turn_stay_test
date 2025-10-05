// lib/hooks/use-transactions-with-policy.ts
import { useQuery } from "@tanstack/react-query";
import type { Transaction } from "@/lib/types/shared-types";
import type { PolicyResolution } from "@/lib/types/policy";

export type TransactionWithPolicyFilters = {
  currency?: "ZAR" | "USD" | "EUR";
  paymentType?: "card" | "bank" | "wallet";
  cursor?: string;
  limit?: number;
  tenantId?: string;
};

export type TransactionWithPolicyResult = {
  transaction: Transaction;
  resolution: PolicyResolution;
};

export type TransactionWithPolicyResponse = {
  results: TransactionWithPolicyResult[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    total: number;
  };
};

async function fetchTransactionsWithPolicy(
  filters: TransactionWithPolicyFilters
): Promise<TransactionWithPolicyResponse> {
  const params = new URLSearchParams();

  if (filters.currency) params.set("currency", filters.currency);
  if (filters.paymentType) params.set("paymentType", filters.paymentType);
  if (filters.cursor) params.set("cursor", filters.cursor);
  if (filters.limit) params.set("limit", filters.limit.toString());
  if (filters.tenantId) params.set("tenantId", filters.tenantId);

  const response = await fetch(
    `/api/transactions-with-policy?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions with policy");
  }

  return response.json();
}

export function useTransactionsWithPolicy(
  filters: TransactionWithPolicyFilters,
  initialData?: TransactionWithPolicyResponse
) {
  return useQuery({
    queryKey: [
      "transactions-with-policy",
      filters.currency,
      filters.paymentType,
      filters.cursor,
      filters.tenantId,
    ],
    queryFn: () => fetchTransactionsWithPolicy(filters),
    initialData,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
  });
}
