// app/transactions/question7/page.tsx
import { Suspense } from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Question7Client from "@/components/questions/(question7-client-group)/question7-client";
import { getTransactions } from "@/lib/services/transaction-service";
import { transactionQuerySchema } from "@/lib/validation/transaction-schema";
import type { TransactionFilters } from "@/lib/types/transaction";

interface Question7PageProps {
  searchParams: Promise<TransactionFilters>;
}

export default async function Question7Page({
  searchParams,
}: Question7PageProps) {
  // Await searchParams before accessing its properties
  const params = await searchParams;

  // Validate and parse search params
  const validatedParams = transactionQuerySchema.parse({
    currency: params.currency,
    paymentType: params.paymentType,
    cursor: params.cursor,
    limit: params.limit,
  });

  // Create a new QueryClient instance for this request
  // This is important: each request gets its own client to avoid sharing state
  const queryClient = new QueryClient();

  // Prefetch data on the server and populate the cache
  // This runs on the server before the page is sent to the client
  await queryClient.prefetchQuery({
    queryKey: [
      "transactions",
      validatedParams.currency,
      validatedParams.paymentType,
      validatedParams.cursor,
    ],
    queryFn: () => getTransactions(validatedParams),
  });

  // dehydrate() serializes the QueryClient cache so it can be sent to the client
  // HydrationBoundary rehydrates this data on the client side
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Question7Client filters={validatedParams} />
      </HydrationBoundary>
    </Suspense>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: Question7PageProps) {
  const params = await searchParams;
  const currency = params.currency || "All";
  const paymentType = params.paymentType || "All";

  return {
    title: `Transactions - ${currency} - ${paymentType}`,
    description: `View ${currency} transactions for ${paymentType} payment type`,
  };
}
