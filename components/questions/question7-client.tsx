// components/questions/question7-client.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition, useOptimistic } from "react";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { bpsToPercent, calcFeeAmount, getFeeBps } from "@/lib/utils/fee-utils";
import type { TransactionResponse, Transaction } from "@/lib/types/transaction";

interface Question7ClientProps {
  initialData: TransactionResponse;
}

type Currency = "ZAR" | "USD" | "EUR" | undefined;
type PaymentType = "card" | "bank" | "wallet" | undefined;

export default function Question7Client({ initialData }: Question7ClientProps) {
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Current filters from URL
  const currentFilters = {
    currency: searchParams.get("currency") as Currency,
    paymentType: searchParams.get("paymentType") as PaymentType,
  };

  // Optimistic UI state
  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    currentFilters,
    (
      state,
      newFilters: { currency?: Currency; paymentType?: PaymentType }
    ) => ({
      ...state,
      ...newFilters,
    })
  );

  // Fetch data with custom hook
  const { data: transactionData, isLoading } = useTransactions(
    {
      currency: currentFilters.currency,
      paymentType: currentFilters.paymentType,
      cursor: searchParams.get("cursor") || undefined,
      limit: 5,
    },
    initialData
  );

  const formatAmount = (amount: number): string => {
    const majorUnits = amount / 100;
    return majorUnits.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if transaction has override fee
  const hasOverride = (tx: Transaction): boolean => {
    return tx.fee !== undefined;
  };

  const updateFilters = (updates: {
    currency?: Currency;
    paymentType?: PaymentType;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update optimistic state immediately
    startTransition(() => {
      setOptimisticFilters(updates);
    });

    // Update URL params
    if (updates.currency) {
      params.set("currency", updates.currency);
    } else if (updates.currency === undefined) {
      params.delete("currency");
    }

    if (updates.paymentType) {
      params.set("paymentType", updates.paymentType);
    } else if (updates.paymentType === undefined) {
      params.delete("paymentType");
    }

    // Reset cursor when filters change
    params.delete("cursor");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleNextPage = () => {
    if (!transactionData?.pagination.nextCursor) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("cursor", transactionData.pagination.nextCursor);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handlePreviousPage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cursor");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const currencies: ("All" | Currency)[] = ["All", "ZAR", "USD", "EUR"];
  const paymentTypes: ("All" | PaymentType)[] = [
    "All",
    "card",
    "bank",
    "wallet",
  ];
  const currentPage = searchParams.get("cursor") ? 2 : 1;

  return (
    <div
      className={`min-h-screen py-12 px-4 transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`fixed top-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
            isDark ? "bg-gray-700 text-yellow-400" : "bg-white text-gray-800"
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        {/* Back Button */}
        <Link
          href="/"
          className={`inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-colors ${
            isDark
              ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
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
        <div
          className={`rounded-xl shadow-2xl p-8 mb-8 transition-colors ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-4xl font-bold ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              Question 7
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
              Principal
            </span>
          </div>

          <h2
            className={`text-3xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Server Data, Caching, and URL State
          </h2>

          <div
            className={`space-y-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <p className="text-lg">
              <span className="font-semibold">What you need to do:</span> Move
              to server-side rendering with cursor pagination, URL-driven
              filters, caching strategy, and optimistic UI.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Key Features Implemented:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Server-side data fetching with Next.js App Router</li>
                <li>URL as single source of truth (shareable links)</li>
                <li>Cursor-based pagination</li>
                <li>Stale-while-revalidate caching strategy</li>
                <li>Optimistic UI with useOptimistic</li>
                <li>Client-side caching with TanStack Query</li>
                <li>Input validation with Zod</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Solution */}
        <div
          className={`rounded-xl shadow-2xl p-4 md:p-8 transition-colors ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-2xl font-bold mb-6 ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            Solution
          </h3>

          {/* Currency Filter */}
          <div className="mb-4">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Filter by Currency
            </label>
            <div className="flex gap-2 flex-wrap">
              {currencies.map((currency) => (
                <button
                  key={currency}
                  onClick={() =>
                    updateFilters({
                      currency: currency === "All" ? undefined : currency,
                      paymentType: optimisticFilters.paymentType,
                    })
                  }
                  disabled={isPending}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    (
                      currency === "All"
                        ? !optimisticFilters.currency
                        : optimisticFilters.currency === currency
                    )
                      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                      : isDark
                      ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Type Filter */}
          <div className="mb-6">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Filter by Payment Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {paymentTypes.map((paymentType) => (
                <button
                  key={paymentType}
                  onClick={() =>
                    updateFilters({
                      currency: optimisticFilters.currency,
                      paymentType:
                        paymentType === "All" ? undefined : paymentType,
                    })
                  }
                  disabled={isPending}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize ${
                    (
                      paymentType === "All"
                        ? !optimisticFilters.paymentType
                        : optimisticFilters.paymentType === paymentType
                    )
                      ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                      : isDark
                      ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {paymentType}
                </button>
              ))}
            </div>
          </div>

          {/* Info Bar */}
          <div
            className={`mb-4 text-sm font-medium ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Showing {transactionData?.data.length || 0} of{" "}
            {transactionData?.pagination.total || 0} transactions
          </div>

          {/* Table */}
          {isLoading && !transactionData ? (
            <div className="py-20 text-center">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p>Loading transactions...</p>
            </div>
          ) : transactionData?.data.length === 0 ? (
            <div
              className={`py-20 text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <svg
                className="mx-auto h-16 w-16 mb-4 opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-semibold">No transactions found</p>
              <p className="text-sm mt-2 opacity-75">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr
                      className={`border-b-2 ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <th
                        className={`text-left py-3 px-4 font-semibold ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        ID
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-semibold ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Date
                      </th>
                      <th
                        className={`text-right py-3 px-4 font-semibold ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Amount
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-semibold ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Currency
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-semibold ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Payment Type
                      </th>
                      <th
                        className={`text-right py-3 px-4 font-semibold ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionData?.data.map((tx: Transaction) => {
                      const feeBps = getFeeBps(tx);
                      const feeAmount = calcFeeAmount(tx.amount, feeBps);
                      const isOverride = hasOverride(tx);

                      return (
                        <tr
                          key={tx.id}
                          className={`border-b transition-colors ${
                            isDark
                              ? "border-gray-700 hover:bg-gray-750"
                              : "border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <td
                            className={`py-3 px-4 font-mono text-sm ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {tx.id}
                          </td>
                          <td
                            className={`py-3 px-4 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {formatDate(tx.createdAt)}
                          </td>
                          <td
                            className={`py-3 px-4 text-right font-semibold ${
                              isDark ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {formatAmount(tx.amount)}
                          </td>
                          <td
                            className={`py-3 px-4 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {tx.currency}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                tx.paymentType === "card"
                                  ? "bg-blue-100 text-blue-800"
                                  : tx.paymentType === "bank"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {tx.paymentType}
                            </span>
                          </td>
                          <td
                            className={`py-3 px-4 text-right ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {bpsToPercent(feeBps)}
                                </span>
                                {isOverride && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                                    override
                                  </span>
                                )}
                              </div>
                              <span className="font-semibold">
                                {formatAmount(feeAmount)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {transactionData?.data.map((tx: Transaction) => {
                  const feeBps = getFeeBps(tx);
                  const feeAmount = calcFeeAmount(tx.amount, feeBps);
                  const isOverride = hasOverride(tx);

                  return (
                    <div
                      key={tx.id}
                      className={`rounded-lg p-4 border transition-colors ${
                        isDark
                          ? "bg-gray-750 border-gray-700"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className={`font-mono text-sm font-semibold ${
                            isDark ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        >
                          {tx.id}
                        </span>
                        <div className="flex items-center gap-2">
                          {isOverride && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                              override
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tx.paymentType === "card"
                                ? "bg-blue-100 text-blue-800"
                                : tx.paymentType === "bank"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {tx.paymentType}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`text-2xl font-bold mb-2 ${
                          isDark ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {tx.currency} {formatAmount(tx.amount)}
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Fee ({bpsToPercent(feeBps)})
                        </span>
                        <span
                          className={`text-lg font-semibold ${
                            isDark ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {formatAmount(feeAmount)}
                        </span>
                      </div>

                      <div
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {formatDate(tx.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Pagination - Below the table card */}
        {transactionData && transactionData.data.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isPending}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                currentPage === 1 || isPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              ← Previous
            </button>

            <span
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Page {currentPage}
            </span>

            <button
              onClick={handleNextPage}
              disabled={!transactionData?.pagination.hasMore || isPending}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                !transactionData?.pagination.hasMore || isPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Next →
            </button>
          </div>
        )}

        {/* Key Concepts */}
        <div
          className={`rounded-xl shadow-2xl p-8 mt-8 transition-colors ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-2xl font-bold mb-4 ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            Key Concepts Demonstrated
          </h3>

          <div
            className={`space-y-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <div>
              <h4 className="font-semibold mb-2">
                1. Server Components vs Client Components
              </h4>
              <p>
                The page.tsx is a Server Component that fetches data on the
                server, while question7-client.tsx handles interactivity. This
                provides better performance and SEO.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                2. URL as Single Source of Truth
              </h4>
              <p>
                All filter and pagination state lives in the URL. This makes
                links shareable, enables browser back/forward, and provides
                clear state management.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Cursor-Based Pagination</h4>
              <p>
                Uses cursor pagination instead of offset-based for better
                performance with large datasets. The cursor is the ID of the
                last item.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                4. Stale-While-Revalidate Caching
              </h4>
              <p>
                The API route sets Cache-Control headers (s-maxage=60,
                stale-while-revalidate=300). CDN serves cached data for 60s,
                then serves stale data while revalidating.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Optimistic UI Updates</h4>
              <p>
                Uses useOptimistic hook to immediately update the UI when
                filters change, before the server responds. Combined with
                useTransition for smooth UX.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">6. Responsive Design</h4>
              <p>
                Table view on desktop, card view on mobile. Pagination buttons
                stack vertically on mobile with full-width buttons for better
                touch targets, then switch to horizontal layout on larger
                screens.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                7. Multi-Layer Caching Strategy
              </h4>
              <p>
                Three layers: (1) HTTP cache at CDN/edge, (2) Next.js fetch
                cache with revalidate, (3) TanStack Query client cache with
                staleTime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
