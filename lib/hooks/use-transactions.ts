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
  initialData?: TransactionResponse // Initial data for SSR or prefetching or Pre-loaded data to show immediately:
) {
  return useQuery({
    queryKey: [
      "transactions", // Purpose: Unique identifier for this query in the cache. Multiple components can share the same cache if they have the same key
      filters.currency,
      filters.paymentType,
      filters.cursor,
      // limit is not included in the key to allow fetching more pages with the same base query, Including it would cause a new fetch every time limit changes
    ],
    queryFn: () => fetchTransactions(filters),
    initialData,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
  });
}
