"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { TransactionResponse } from "@/lib/types/transaction";
import PaymentTypeFilter from "@/components/questions/PaymentTypeFilter";
import type { Country, PaymentType } from "@/components/questions/shared-types";
import CurrencyFilter from "../CurrencyFilter";
import TransactionTable from "./TransactionTable";

interface Question7ClientProps {
  initialData: TransactionResponse;
}

export default function Question7Client({ initialData }: Question7ClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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

  // Use initialData directly
  const transactionData = initialData;

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
            Server Data, Caching, and URL State
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg">
              <span className="font-semibold">What you need to do:</span> Move
              to server-side rendering with cursor pagination, URL-driven
              filters, caching strategy, and smooth transitions.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Key Features Implemented:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Server-side data fetching with Next.js App Router</li>
                <li>URL as single source of truth (shareable links)</li>
                <li>Cursor-based pagination</li>
                <li>Server-side rendering with no client fetching</li>
                <li>Smooth transitions with useTransition</li>
                <li>Input validation with Zod</li>
                <li>Reusable filter components</li>
                <li>Separated table display component</li>
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
              isPending ? "opacity-50 pointer-events-none" : ""
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
              isPending ? "opacity-50 pointer-events-none" : ""
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
            {isPending && (
              <span className="ml-2 text-indigo-600 dark:text-indigo-400 animate-pulse">
                (updating...)
              </span>
            )}
          </div>

          {/* Transaction Table */}
          <TransactionTable
            transactions={transactionData?.data || []}
            isPending={isPending}
          />
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
              } bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              ← Previous
            </button>

            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage}
            </span>

            <button
              onClick={handleNextPage}
              disabled={!transactionData?.pagination.hasMore || isPending}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                !transactionData?.pagination.hasMore || isPending
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
                clear state management. No client-side fetching is needed.
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
                4. Server-Side Rendering Benefits
              </h4>
              <p>
                Data is fetched on the server and passed as initialData. Filter
                changes trigger server re-renders through URL updates, ensuring
                fresh data without client-side API calls.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Smooth Transitions</h4>
              <p>
                Uses useTransition hook to provide non-blocking updates when
                filters change. The UI remains interactive while the server
                fetches new data, with visual feedback through opacity changes.
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
                7. Component Separation and Reusability
              </h4>
              <p>
                Uses shared CurrencyFilter, PaymentTypeFilter, and
                TransactionTable components for consistent UI patterns and
                better code organization. Each component has a single
                responsibility.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                8. No Over-Fetching Pattern
              </h4>
              <p>
                By using server components and URL state, we eliminate
                unnecessary client-side fetching. Data is only fetched once per
                page load on the server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
