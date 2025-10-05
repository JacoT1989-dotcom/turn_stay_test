// lib/hooks/usePolicyResolution.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Transaction } from "@/lib/types/shared-types";
import type { PolicyResolution } from "@/lib/types/policy";

// ============================================
// Types
// ============================================
export type BatchPolicyResolutionRequest = {
  transactions: Transaction[];
  merchantId?: string;
  tenantId?: string;
};

export type BatchPolicyResolutionResponse = {
  results: {
    transaction: Transaction;
    resolution: PolicyResolution;
  }[];
};

// ============================================
// API Functions
// ============================================
async function resolvePolicyForBatch(
  request: BatchPolicyResolutionRequest
): Promise<BatchPolicyResolutionResponse> {
  const response = await fetch("/api/policy-resolution/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to resolve policies");
  }

  return response.json();
}

// ============================================
// TanStack Query Hook
// ============================================
export function useBatchPolicyResolution() {
  return useMutation({
    mutationFn: resolvePolicyForBatch,
    onError: (error) => {
      console.error("Policy resolution error:", error);
    },
  });
}

// ============================================
// Pre-fetch hook for static transactions (optional)
// ============================================
export function usePolicyResolutionQuery(
  transactions: Transaction[],
  options?: {
    merchantId?: string;
    tenantId?: string;
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: [
      "policy-resolution",
      transactions,
      options?.merchantId,
      options?.tenantId,
    ],
    queryFn: () =>
      resolvePolicyForBatch({
        transactions,
        merchantId: options?.merchantId,
        tenantId: options?.tenantId,
      }),
    enabled: options?.enabled !== false && transactions.length > 0,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });
}
