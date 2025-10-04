// components/questions/(question7-client-group)/question7-client.tsx

"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { TransactionFilters } from "@/lib/types/transaction";
import PaymentTypeFilter from "@/components/questions/PaymentTypeFilter";
import type { Country, PaymentType } from "@/components/questions/shared-types";
import CurrencyFilter from "../CurrencyFilter";
import TransactionTable from "./TransactionTable";
import { useTransactions } from "@/lib/hooks/use-transactions";

interface Question7ClientProps {
  filters: TransactionFilters;
}

export default function Question7Client({ filters }: Question7ClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Use the React Query hook - it will use the prefetched data from the server
  // On first render, this data comes from HydrationBoundary (no loading state!)
  // On subsequent filter changes, it fetches from the API route
  const { data: transactionData, isLoading } = useTransactions(filters);

  // Current filters from URL - these are our source of truth
  const currentCurrency = searchParams.get("currency");
  const currentPaymentType = searchParams.get("paymentType");

  // Map currency to country format for the filter component
  const getCountryFromCurrency = (currency: string | null): Country => {
    if (!currency) return "All";
    switch (currency) {
      case "ZAR":
        return "ZA";
      case "USD":
        return "US";
      case "EUR":
        return "EUR";
      default:
        return "All";
    }
  };

  // Map country back to currency for URL params
  const getCurrencyFromCountry = (country: Country): string | undefined => {
    if (country === "All") return undefined;
    switch (country) {
      case "ZA":
        return "ZAR";
      case "US":
        return "USD";
      case "EUR":
        return "EUR";
      default:
        return undefined;
    }
  };

  // Map payment type with "All" option
  const getPaymentTypeWithAll = (paymentType: string | null): PaymentType => {
    if (!paymentType) return "All";
    return paymentType as PaymentType;
  };

  const selectedCountry = getCountryFromCurrency(currentCurrency);
  const selectedPaymentType = getPaymentTypeWithAll(currentPaymentType);

  const handleCurrencyChange = (country: Country) => {
    const params = new URLSearchParams(searchParams.toString());

    const currency = getCurrencyFromCountry(country);
    if (currency) {
      params.set("currency", currency);
    } else {
      params.delete("currency");
    }

    // Reset cursor when filters change
    params.delete("cursor");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handlePaymentTypeChange = (paymentType: PaymentType) => {
    const params = new URLSearchParams(searchParams.toString());

    if (paymentType === "All") {
      params.delete("paymentType");
    } else {
      params.set("paymentType", paymentType);
    }

    // Reset cursor when filters change
    params.delete("cursor");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleNextPage = () => {
    if (!transactionData?.pagination.nextCursor) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("cursor", transactionData.pagination.nextCursor);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handlePreviousPage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cursor");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const countries: Country[] = ["All", "ZA", "US", "EUR"];
  const paymentTypes: PaymentType[] = ["All", "card", "bank", "wallet"];
  const currentPage = searchParams.get("cursor") ? 2 : 1;

  // Show loading state while transitioning OR while React Query is fetching
  const showPending = isPending || isLoading;

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>

        {/* Question Header */}
        <div className="rounded-xl shadow-2xl p-8 mb-8 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              Question 7
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              Principal
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            React Query with Server Preloading
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg">
              <span className="font-semibold">What you need to do:</span> Use
              React Query with server-side data preloading, URL-driven filters,
              and smooth client-side transitions.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Key Features Implemented:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>React Query with server-side prefetching</li>
                <li>HydrationBoundary for seamless SSR to CSR transition</li>
                <li>URL as single source of truth (shareable links)</li>
                <li>Client-side caching and optimistic updates</li>
                <li>Cursor-based pagination</li>
                <li>Smooth transitions with useTransition</li>
                <li>Automatic background refetching</li>
                <li>Input validation with Zod</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className="rounded-xl shadow-2xl p-4 md:p-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            Solution
          </h3>

          {/* Currency Filter */}
          <div
            className={`mb-4 ${
              showPending ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <CurrencyFilter
              selectedCountry={selectedCountry}
              onCountryChange={handleCurrencyChange}
              countries={countries}
              variant="buttons"
              showLabel={true}
            />
          </div>

          {/* Payment Type Filter */}
          <div
            className={`mb-6 ${
              showPending ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <PaymentTypeFilter
              selectedPaymentType={selectedPaymentType}
              onPaymentTypeChange={handlePaymentTypeChange}
              paymentTypes={paymentTypes}
              showLabel={true}
            />
          </div>

          {/* Info Bar */}
          <div className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            Showing {transactionData?.data.length || 0} of{" "}
            {transactionData?.pagination.total || 0} transactions
            {showPending && (
              <span className="ml-2 text-indigo-600 dark:text-indigo-400 animate-pulse">
                (updating...)
              </span>
            )}
          </div>

          {/* Transaction Table */}
          <TransactionTable
            transactions={transactionData?.data || []}
            isPending={showPending}
          />
        </div>

        {/* Pagination - Below the table card */}
        {transactionData && transactionData.data.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || showPending}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                currentPage === 1 || showPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              ← Previous
            </button>

            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage}
            </span>

            <button
              onClick={handleNextPage}
              disabled={!transactionData?.pagination.hasMore || showPending}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                !transactionData?.pagination.hasMore || showPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              Next →
            </button>
          </div>
        )}

        {/* Key Concepts */}
        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Key Concepts Demonstrated
          </h3>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold mb-2">
                1. React Query Server Prefetching
              </h4>
              <p>
                Data is prefetched on the server using QueryClient.prefetchQuery
                and dehydrated into the page. The client rehydrates this data
                instantly, eliminating loading states on initial page load.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. HydrationBoundary</h4>
              <p>
                Wraps the client component to seamlessly transfer server-fetched
                data to the client-side React Query cache. This provides instant
                data availability without additional network requests.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                3. Automatic Cache Management
              </h4>
              <p>
                React Query handles caching, stale-while-revalidate patterns,
                and background refetching. Filter changes automatically fetch
                fresh data while keeping the UI responsive.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                4. URL-Driven State with Client Caching
              </h4>
              <p>
                URL params drive the query key, ensuring shareable links while
                React Query provides intelligent caching. Navigation between
                previously visited filter combinations is instant.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Optimistic UI Updates</h4>
              <p>
                useTransition provides non-blocking navigation while React Query
                manages loading states. Users can continue interacting with the
                UI while data fetches in the background.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">6. Type-Safe Query Keys</h4>
              <p>
                Query keys are derived from validated filter parameters,
                ensuring type safety and cache consistency across the
                application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
