// app/transactions/question8/page.tsx
import { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Question8Client from "@/components/questions/(question8-client-group)/question8-client";
import { getTransactionsWithPolicy } from "@/lib/services/transaction-policy-service";
import type { TransactionWithPolicyFilters } from "@/lib/hooks/use-transactions-with-policy";

interface Question8PageProps {
  searchParams: Promise<{
    currency?: "ZAR" | "USD" | "EUR";
    paymentType?: "card" | "bank" | "wallet";
    cursor?: string;
    limit?: string;
  }>;
}

function Question8Loading() {
  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl shadow-2xl p-8 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Question8Page({
  searchParams,
}: Question8PageProps) {
  // Await searchParams in Next.js 15
  const params = await searchParams;

  // Build filters from URL params
  const filters: TransactionWithPolicyFilters = {
    currency: params.currency,
    paymentType: params.paymentType,
    cursor: params.cursor,
    limit: params.limit ? parseInt(params.limit) : 5,
  };

  // Create a new QueryClient for this request
  const queryClient = new QueryClient();

  // Prefetch the data on the server
  await queryClient.prefetchQuery({
    queryKey: [
      "transactions-with-policy",
      filters.currency,
      filters.paymentType,
      filters.cursor,
      filters.tenantId,
    ],
    queryFn: () => getTransactionsWithPolicy(filters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Question8Loading />}>
        <Question8Client filters={filters} />
      </Suspense>
    </HydrationBoundary>
  );
}

export const metadata = {
  title: "Question 8 - Multi-Tenant Fee Policy",
  description:
    "Policy resolution system with explainability and conflict detection",
};
