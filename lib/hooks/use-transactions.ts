// lib/hooks/use-transactions.ts
import { useQuery } from "@tanstack/react-query";
import type {
  TransactionResponse,
  TransactionFilters,
} from "@/lib/types/transaction";

async function fetchTransactions(
  filters: TransactionFilters
): Promise<TransactionResponse> {
  const params = new URLSearchParams();

  if (filters.currency) params.set("currency", filters.currency);
  if (filters.paymentType) params.set("paymentType", filters.paymentType);
  if (filters.cursor) params.set("cursor", filters.cursor);
  if (filters.limit) params.set("limit", filters.limit.toString());

  const response = await fetch(`/api/transactions?${params.toString()}`);
  // Input currency: "ZAR", limit: 10 } => Output URL string: "currency=ZAR&limit=10"

  // Handle HTTP errors and retry depending on your settings in the query provider
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  // Converts response body from JSON string to JavaScript object
  return response.json();
}

export function useTransactions(
  filters: TransactionFilters, //  What to filter by: currency, paymentType, cursor, limit
  initialData?: TransactionResponse // Initial data for SSR or prefetching
) {
  return useQuery({
    queryKey: [
      "transactions",
      filters.currency,
      filters.paymentType,
      filters.cursor,
    ],
    queryFn: () => fetchTransactions(filters),
    initialData,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
  });
}
