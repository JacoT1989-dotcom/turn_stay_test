// components\questions\(question2-client-group)\question2-client.tsx

"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Country } from "./question2-types";
import { transactions } from "./transactions-data";
import {
  formatAmount,
  formatDate,
  getCurrencyFromCountry,
} from "../formatters";
import CurrencyFilter from "./CurrencyFilter";

const countries: Country[] = ["All", "ZA", "US", "EUR"];

export default function Question2Client() {
  const [selectedCountry, setSelectedCountry] = useState<Country>("All");

  const filteredTransactions =
    selectedCountry === "All"
      ? transactions
      : transactions.filter((tx) => tx.country === selectedCountry);

  // Calculate transaction counts for each country
  const transactionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    countries.forEach((country) => {
      if (country !== "All") {
        counts[country] = transactions.filter(
          (tx) => tx.country === country
        ).length;
      }
    });
    return counts;
  }, []);

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
              Question 2
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Junior
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Split by Currency
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg">
              <span className="font-semibold">What you need to do:</span> Add a
              currency filter (tabs or dropdown) that shows &quot;All&quot; by
              default and allows filtering to ZAR, USD, EUR.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Key Requirements:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Add filter UI (tabs or dropdown) showing &quot;All&quot;,
                  &quot;ZAR&quot;, &quot;USD&quot;, &quot;EUR&quot;
                </li>
                <li>Default to &quot;All&quot; showing all transactions</li>
                <li>
                  When a currency is selected, only show transactions in that
                  currency
                </li>
                <li>Use controlled state for the filter</li>
                <li>
                  Create a derived filtered list (don&apos;t mutate original
                  data)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">What good looks like:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Clean controlled component state</li>
                <li>No unnecessary re-renders</li>
                <li>Clear separation between data and presentation</li>
                <li>Simple filter logic</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-2xl p-4 md:p-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            Solution
          </h3>

          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CurrencyFilter
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              countries={countries}
              transactionCounts={transactionCounts}
            />

            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Showing {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </span>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="py-20 text-center text-gray-500 dark:text-gray-400">
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
                Try selecting a different currency filter
              </p>
            </div>
          ) : (
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
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredTransactions.map((tx) => (
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

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(tx.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Key Concepts Demonstrated
          </h3>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold mb-2">1. Component Composition</h4>
              <p>
                The filter UI is extracted into a separate{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  CurrencyFilter
                </code>{" "}
                component, demonstrating separation of concerns and reusability.
                Props are passed down for state and callbacks.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                2. Controlled Component State
              </h4>
              <p>
                Uses{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  useState
                </code>{" "}
                to manage the selected currency. The filter state is controlled
                by React, making it predictable and easy to debug.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                3. Derived State (Filtered List)
              </h4>
              <p>
                Creates a filtered list using a simple ternary expression. This
                is a derived value, not stored in state, which prevents
                unnecessary state management and keeps data flow clear.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Memoized Calculations</h4>
              <p>
                Uses{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  useMemo
                </code>{" "}
                to calculate transaction counts once and avoid recalculation on
                every render.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Responsive Design</h4>
              <p>
                Uses separate layouts for mobile (cards) and desktop (table).
                The filter buttons also adapt with{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  flex-col sm:flex-row
                </code>{" "}
                to stack vertically on very small screens.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">6. Empty State Handling</h4>
              <p>
                Displays a friendly message when no transactions match the
                filter, improving user experience.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Follow-up Considerations
          </h3>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold mb-2">URL Query vs Local State?</h4>
              <p className="mb-2">
                <span className="font-medium">
                  Local State (current approach):
                </span>
              </p>
              <ul className="list-disc ml-6 mb-2">
                <li>Pros: Simple, no URL complexity, immediate</li>
                <li>Cons: Not shareable, lost on refresh</li>
              </ul>
              <p className="mb-2">
                <span className="font-medium">URL Query Parameters:</span>
              </p>
              <ul className="list-disc ml-6">
                <li>
                  Pros: Shareable links, persists on refresh, browser
                  back/forward works
                </li>
                <li>Cons: More complex setup, needs URL synchronization</li>
              </ul>
              <p className="mt-2">
                For a simple filter like this, local state is fine. For more
                complex filtering or if sharing filters is important, URL state
                would be better.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
