// components/questions/question6-client.tsx
"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

type Tx = {
  id: string;
  amount: number;
  currency: "ZAR" | "USD" | "EUR";
  paymentType: "card" | "bank" | "wallet";
  scheme?: "visa" | "mastercard" | "amex";
  createdAt: string;
  fee?: number;
};

const transactions: Tx[] = [
  {
    id: "t_1",
    amount: 125000,
    currency: "ZAR",
    paymentType: "card",
    scheme: "visa",
    createdAt: "2025-09-10T10:00:00Z",
  },
  {
    id: "t_2",
    amount: 56000,
    currency: "USD",
    paymentType: "card",
    scheme: "mastercard",
    createdAt: "2025-09-11T12:15:00Z",
    fee: 290,
  },
  {
    id: "t_3",
    amount: 99000,
    currency: "ZAR",
    paymentType: "bank",
    createdAt: "2025-09-12T09:30:00Z",
  },
  {
    id: "t_4",
    amount: 45000,
    currency: "EUR",
    paymentType: "wallet",
    createdAt: "2025-09-12T10:05:00Z",
  },
  {
    id: "t_5",
    amount: 200000,
    currency: "ZAR",
    paymentType: "card",
    scheme: "amex",
    createdAt: "2025-09-12T12:00:00Z",
  },
];

interface GroupedData {
  [currency: string]: {
    [paymentType: string]: {
      [scheme: string]: {
        count: number;
        totalAmount: number;
        totalFee: number;
      };
    };
  };
}

// Fee utility functions
const getFeeBps = (tx: Tx): number => {
  if (tx.fee !== undefined) return tx.fee;
  if (tx.paymentType === "card") return 260;
  if (tx.paymentType === "bank") return 90;
  if (tx.paymentType === "wallet") return 150;
  return 0;
};

const bpsToPercent = (bps: number): string => {
  return `${(bps / 100).toFixed(2)}%`;
};

const calcFeeAmount = (amount: number, bps: number): number => {
  return Math.round((amount * bps) / 10000);
};

export default function Question6Client() {
  const [isDark, setIsDark] = useState(false);
  const [showGrouped, setShowGrouped] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

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

  // Build nested aggregate map
  const groupedData = useMemo((): GroupedData => {
    const result: GroupedData = {};

    transactions.forEach((tx) => {
      const currency = tx.currency;
      const paymentType = tx.paymentType;
      const scheme = tx.scheme || "none";

      const feeBps = getFeeBps(tx);
      const feeAmount = calcFeeAmount(tx.amount, feeBps);

      // Initialize nested structure
      if (!result[currency]) result[currency] = {};
      if (!result[currency][paymentType]) result[currency][paymentType] = {};
      if (!result[currency][paymentType][scheme]) {
        result[currency][paymentType][scheme] = {
          count: 0,
          totalAmount: 0,
          totalFee: 0,
        };
      }

      // Aggregate values
      result[currency][paymentType][scheme].count += 1;
      result[currency][paymentType][scheme].totalAmount += tx.amount;
      result[currency][paymentType][scheme].totalFee += feeAmount;
    });

    return result;
  }, []);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
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
              Question 6
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
              Senior
            </span>
          </div>

          <h2
            className={`text-3xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Grouping + Aggregates
          </h2>

          <div
            className={`space-y-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <p className="text-lg">
              <span className="font-semibold">What you need to do:</span> Add a
              grouped view toggle that shows aggregates by currency → payment
              type → scheme with count, total amount, and total fee collected.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Key Requirements:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Create nested groups: currency → paymentType → scheme</li>
                <li>
                  Show count of transactions, total amount, and total fee for
                  each group
                </li>
                <li>Make it collapsible (accordion style)</li>
                <li>Handle missing scheme gracefully</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">What good looks like:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Pure functions to build nested aggregate map</li>
                <li>UI handles missing scheme gracefully</li>
                <li>Reasonable performance for 10-50k rows</li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl shadow-2xl p-4 md:p-8 transition-colors ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              Solution
            </h3>

            <button
              onClick={() => setShowGrouped(!showGrouped)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all w-full sm:w-auto ${
                showGrouped
                  ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                  : isDark
                  ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {showGrouped ? "Show Table View" : "Show Grouped View"}
            </button>
          </div>

          {!showGrouped ? (
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
                    {transactions.map((tx) => {
                      const feeBps = getFeeBps(tx);
                      const feeAmount = calcFeeAmount(tx.amount, feeBps);

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
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-500">
                                {bpsToPercent(feeBps)}
                              </span>
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
                {transactions.map((tx) => {
                  const feeBps = getFeeBps(tx);
                  const feeAmount = calcFeeAmount(tx.amount, feeBps);

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
          ) : (
            // Grouped View (works well on both mobile and desktop)
            <div className="space-y-4">
              {Object.entries(groupedData).map(([currency, paymentTypes]) => (
                <div
                  key={currency}
                  className={`rounded-lg border ${
                    isDark
                      ? "border-gray-700 bg-gray-750"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <button
                    onClick={() => toggleGroup(currency)}
                    className="w-full flex items-center justify-between p-4 hover:bg-opacity-80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          expandedGroups.has(currency) ? "rotate-90" : ""
                        } ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span
                        className={`text-lg font-bold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {currency}
                      </span>
                    </div>
                  </button>

                  {expandedGroups.has(currency) && (
                    <div className="px-4 pb-4 space-y-3">
                      {Object.entries(paymentTypes).map(
                        ([paymentType, schemes]) => (
                          <div
                            key={paymentType}
                            className={`rounded-lg border ${
                              isDark
                                ? "border-gray-600 bg-gray-800"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            <button
                              onClick={() =>
                                toggleGroup(`${currency}-${paymentType}`)
                              }
                              className="w-full flex items-center justify-between p-3 hover:bg-opacity-80 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <svg
                                  className={`w-4 h-4 transition-transform ${
                                    expandedGroups.has(
                                      `${currency}-${paymentType}`
                                    )
                                      ? "rotate-90"
                                      : ""
                                  } ${
                                    isDark ? "text-gray-500" : "text-gray-500"
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                                <span
                                  className={`font-semibold capitalize ${
                                    isDark ? "text-gray-200" : "text-gray-800"
                                  }`}
                                >
                                  {paymentType}
                                </span>
                              </div>
                            </button>

                            {expandedGroups.has(
                              `${currency}-${paymentType}`
                            ) && (
                              <div className="px-3 pb-3 space-y-2">
                                {Object.entries(schemes).map(
                                  ([scheme, data]) => (
                                    <div
                                      key={scheme}
                                      className={`p-3 rounded ${
                                        isDark ? "bg-gray-700" : "bg-gray-50"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span
                                          className={`text-sm font-medium ${
                                            isDark
                                              ? "text-gray-300"
                                              : "text-gray-700"
                                          }`}
                                        >
                                          {scheme === "none"
                                            ? "No Scheme"
                                            : scheme}
                                        </span>
                                        <span
                                          className={`text-xs px-2 py-1 rounded-full ${
                                            isDark
                                              ? "bg-gray-600 text-gray-300"
                                              : "bg-gray-200 text-gray-600"
                                          }`}
                                        >
                                          {data.count}{" "}
                                          {data.count === 1
                                            ? "transaction"
                                            : "transactions"}
                                        </span>
                                      </div>
                                      <div
                                        className={`grid grid-cols-2 gap-3 text-sm ${
                                          isDark
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        <div>
                                          <div className="text-xs opacity-75">
                                            Total Amount
                                          </div>
                                          <div
                                            className={`font-semibold ${
                                              isDark
                                                ? "text-gray-200"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            {formatAmount(data.totalAmount)}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-xs opacity-75">
                                            Total Fee
                                          </div>
                                          <div
                                            className={`font-semibold ${
                                              isDark
                                                ? "text-gray-200"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            {formatAmount(data.totalFee)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

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
                1. Pure Function for Aggregation
              </h4>
              <p>
                The{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  groupedData
                </code>{" "}
                is built using useMemo with a pure function that creates nested
                objects. This keeps the logic testable and reusable.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Nested Data Structure</h4>
              <p>
                Uses a three-level nested object structure: currency →
                paymentType → scheme. This naturally represents the hierarchy
                and makes lookups efficient.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                3. Collapsible Accordion UI
              </h4>
              <p>
                Uses Set to track expanded groups, allowing users to drill down
                into the data progressively. This makes large datasets
                manageable and works naturally on both mobile and desktop.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                4. Graceful Handling of Missing Data
              </h4>
              <p>
                Transactions without a scheme are grouped under &quot;none&quot;
                and displayed as &quot;No Scheme&quot;, preventing errors and
                maintaining data integrity.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                5. Responsive Toggle Button
              </h4>
              <p>
                The view toggle button adapts to screen size with{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  w-full sm:w-auto
                </code>
                , taking full width on mobile for better touch targets.
              </p>
            </div>
          </div>
        </div>

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
            Follow-up Discussion
          </h3>

          <div
            className={`space-y-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <div>
              <h4 className="font-semibold mb-2">
                When to Move Aggregation Server-Side?
              </h4>
              <p className="mb-2">
                For this small dataset (5 transactions), client-side aggregation
                is fine. Consider moving to server-side when:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Dataset exceeds 10,000 transactions</li>
                <li>
                  Aggregations become complex (multiple metrics, time-based
                  grouping)
                </li>
                <li>Need to support pagination within groups</li>
                <li>Want to cache aggregated results</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Performance Considerations</h4>
              <p>
                The current implementation using useMemo will handle up to 50k
                rows reasonably well. For larger datasets, consider using
                libraries like Apache Arrow or moving computation to the server
                with Next.js Server Components.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
