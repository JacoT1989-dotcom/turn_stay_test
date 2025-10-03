// components/questions/(question6-client-group)/question6-client.tsx

"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { transactions } from "./transactions-data";
import {
  formatAmount,
  formatDate,
  getCurrencyFromCountry,
} from "../formatters";
import { bpsToPercent, calcFeeAmount, getFeeBps } from "../feeUtils";
import { buildGroupedData } from "../aggregationUtils";
import GroupedAccordion from "./GroupedAccordion";

export default function Question6Client() {
  const [showGrouped, setShowGrouped] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const groupedData = useMemo(() => {
    return buildGroupedData(transactions);
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
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
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

        <div className="rounded-xl shadow-2xl p-8 mb-8 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              Question 6
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              Senior
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Grouping + Aggregates
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
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

        <div className="rounded-xl shadow-2xl p-4 md:p-8 bg-white dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Solution
            </h3>

            <button
              onClick={() => setShowGrouped(!showGrouped)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all w-full sm:w-auto ${
                showGrouped
                  ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        Date
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        Currency
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        Payment Type
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
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
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                            {tx.id}
                          </td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                            {formatDate(tx.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800 dark:text-gray-200">
                            {formatAmount(tx.amount, tx.country)}
                          </td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                            {getCurrencyFromCountry(tx.country)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                tx.paymentType === "card"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  : tx.paymentType === "bank"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              }`}
                            >
                              {tx.paymentType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {bpsToPercent(feeBps)}
                              </span>
                              <span className="font-semibold text-gray-800 dark:text-gray-200">
                                {formatAmount(feeAmount, tx.country)}
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
                      className="rounded-lg p-4 border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          {tx.id}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.paymentType === "card"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : tx.paymentType === "bank"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          }`}
                        >
                          {tx.paymentType}
                        </span>
                      </div>

                      <div className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                        {formatAmount(tx.amount, tx.country)}
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Fee ({bpsToPercent(feeBps)})
                        </span>
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          {formatAmount(feeAmount, tx.country)}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(tx.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <GroupedAccordion
              groupedData={groupedData}
              expandedGroups={expandedGroups}
              onToggleGroup={toggleGroup}
            />
          )}
        </div>

        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Key Concepts Demonstrated
          </h3>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold mb-2">1. Component Extraction</h4>
              <p>
                The grouped accordion UI is extracted into{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  GroupedAccordion
                </code>
                , demonstrating separation of concerns and making the component
                reusable.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Shared Utilities</h4>
              <p>
                Uses{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  buildGroupedData
                </code>{" "}
                from aggregationUtils, along with fee utilities and formatters.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                3. Pure Function for Aggregation
              </h4>
              <p>
                The{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  buildGroupedData
                </code>{" "}
                function is a pure function that creates nested objects, keeping
                logic testable and reusable.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Nested Data Structure</h4>
              <p>
                Uses a three-level nested object structure: currency →
                paymentType → scheme, naturally representing the hierarchy.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                5. Collapsible Accordion UI
              </h4>
              <p>
                Uses Set to track expanded groups, allowing progressive
                drill-down that works well on mobile and desktop.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                6. Graceful Handling of Missing Data
              </h4>
              <p>
                Transactions without a scheme are grouped under &quot;none&quot;
                and displayed as &quot;No Scheme&quot;.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Follow-up Discussion
          </h3>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold mb-2">
                When to Move Aggregation Server-Side?
              </h4>
              <p className="mb-2">
                For this small dataset, client-side aggregation is fine.
                Consider moving to server-side when:
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
                libraries like Apache Arrow or moving computation to the server.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Complete Architecture</h4>
              <p className="mb-2">All Questions 1-6 now share:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Shared types and data structures</li>
                <li>Reusable filter and aggregation utilities</li>
                <li>Consistent fee calculation logic</li>
                <li>Common formatting functions</li>
              </ul>
              <p className="mt-2">
                This demonstrates production-ready, enterprise-level code
                organization with maximum maintainability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
