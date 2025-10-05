// components/questions/(question8-client-group)/question8-client.tsx
"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransactionsWithPolicy } from "@/lib/hooks/use-transactions-with-policy";
import type { TransactionWithPolicyFilters } from "@/lib/hooks/use-transactions-with-policy";
import CurrencyFilter from "../CurrencyFilter";
import PaymentTypeFilter from "../PaymentTypeFilter";
import PolicyResolutionTable from "./PolicyResolutionTable";
import PolicyPagination from "./PolicyPagination";
import PolicyExplainabilityModal from "./PolicyExplainabilityModal";
import type { Country, PaymentType } from "@/lib/types/shared-types";

interface Question8ClientProps {
  filters: TransactionWithPolicyFilters;
}

export default function Question8Client({ filters }: Question8ClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null
  );

  // Use the React Query hook - it will use the prefetched data from the server
  const { data, isLoading } = useTransactionsWithPolicy(filters);

  // Current filters from URL
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
    if (!data?.pagination.nextCursor) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("cursor", data.pagination.nextCursor);

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

  const transactionsWithPolicy = data?.results || [];
  const showPending = isPending || isLoading;

  const selectedTxData = selectedTransaction
    ? transactionsWithPolicy.find(
        (t) => t.transaction.id === selectedTransaction
      )
    : null;

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
              Question 8
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              Principal
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Multi-Tenant Fee Policy + Overrides Matrix
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg">
              <span className="font-semibold">What you need to do:</span> Build
              a policy system with deterministic fee resolution, specificity
              scoring, and full explainability.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Key Features Implemented:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Tenant-based policy system with base fees + override rules
                </li>
                <li>
                  Specificity scoring: merchantId &gt; scheme &gt; currency &gt;
                  paymentType
                </li>
                <li>Tiered pricing support (progressive rates by amount)</li>
                <li>Conflict detection when multiple rules match equally</li>
                <li>
                  &quot;Why this fee?&quot; explainability with full resolution
                  trace
                </li>
                <li>Date-range support for time-limited promotions</li>
                <li>API-based resolution with TanStack Query caching</li>
                <li>URL-driven filters with server-side prefetching</li>
                <li>Cursor-based pagination</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tenant Info */}
        <div className="rounded-xl shadow-2xl p-6 mb-8 bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">
            Current Tenant Policy
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700 dark:text-gray-300">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Tenant
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                Acme E-commerce
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Version
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                v3
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Rules
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                10 active
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Default Card Fee
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                2.60%
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table/Cards */}
        <div className="rounded-xl shadow-2xl p-4 md:p-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            Transactions with Policy Resolution
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
            Showing {data?.results.length || 0} of {data?.pagination.total || 0}{" "}
            transactions
            {showPending && (
              <span className="ml-2 text-indigo-600 dark:text-indigo-400 animate-pulse">
                (updating...)
              </span>
            )}
          </div>

          {/* Table Component */}
          <PolicyResolutionTable
            transactionsWithPolicy={transactionsWithPolicy}
            isPending={showPending}
            onExplainClick={setSelectedTransaction}
          />
        </div>

        {/* Pagination Component */}
        {data && data.results.length > 0 && (
          <PolicyPagination
            currentPage={currentPage}
            hasMore={data.pagination.hasMore}
            isPending={showPending}
            onNext={handleNextPage}
            onPrevious={handlePreviousPage}
          />
        )}

        {/* Explainability Modal Component */}
        <PolicyExplainabilityModal
          selectedTxData={selectedTxData || null}
          onClose={() => setSelectedTransaction(null)}
        />

        {/* Key Concepts */}
        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Key Concepts Demonstrated
          </h3>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold mb-2">
                1. Deterministic Policy Resolution
              </h4>
              <p>
                The resolver function uses specificity scoring to
                deterministically choose which rule applies. merchantId (1000)
                &gt; scheme (100) &gt; currency (10) &gt; paymentType (1).
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Conflict Detection</h4>
              <p>
                When multiple rules have the same specificity (e.g., USD
                Mastercard rules 6 & 7), the system detects the conflict, logs
                it, and uses first-match as fallback. Production systems would
                alert on this.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Full Explainability</h4>
              <p>
                Every fee calculation includes a complete trace showing: base
                policy → matching rules → conflicts → final decision. Critical
                for audit, compliance, and debugging.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Tiered Pricing Support</h4>
              <p>
                Rules can define progressive rates (e.g., first R50k at 2.6%,
                rest at 2.4%). The resolver calculates the effective blended
                rate and shows the breakdown.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Server-Side Prefetching</h4>
              <p>
                Data is prefetched on the server using QueryClient.prefetchQuery
                and dehydrated into the page. The client rehydrates this data
                instantly, eliminating loading states on initial page load.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">6. URL-Driven State</h4>
              <p>
                Filters are stored in URL query parameters, making the page
                shareable and bookmarkable. Combined with TanStack Query caching
                for instant navigation between previously visited filter
                combinations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">7. Component Composition</h4>
              <p>
                UI is split into reusable components (PolicyResolutionTable,
                PolicyPagination, PolicyExplainabilityModal) that receive props,
                making the code maintainable and testable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
