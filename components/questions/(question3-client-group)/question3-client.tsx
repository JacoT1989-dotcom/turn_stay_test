// components/questions/(question3-client-group)/question3-client.tsx

"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  formatAmount,
  formatDate,
  getCurrencyFromCountry,
} from "../formatters";
import PaymentTypeFilter from "./PaymentTypeFilter";
import { transactions } from "./transactions-data";
import { Country, PaymentType } from "../shared-types";
import CurrencyFilter from "../CurrencyFilter";
import { filterTransactions } from "../filterUtils";

const countries: Country[] = ["All", "ZA", "US", "EUR"];
const paymentTypes: PaymentType[] = ["All", "card", "bank", "wallet"];

export default function Question3Client() {
  const [selectedCountry, setSelectedCountry] = useState<Country>("All");
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<PaymentType>("All");

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, {
      country: selectedCountry,
      paymentType: selectedPaymentType,
    });
  }, [selectedCountry, selectedPaymentType]);

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
              Question 3
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Intermediate
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Further Split by Payment Type
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg">
              <span className="font-semibold">What you need to do:</span> Add a
              second filter for payment type (card, bank, wallet) that works
              together with the currency filter.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Key Requirements:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Add payment type filter with &quot;All / card / bank /
                  wallet&quot;
                </li>
                <li>Combine both filters so they work together</li>
                <li>
                  Create composable filtering logic (avoid nested if-hell)
                </li>
                <li>Clear separation of data vs presentation</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">What good looks like:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Composable filtering (doesn&apos;t turn into nested if-hell)
                </li>
                <li>Clear separation of data vs presentation</li>
                <li>Both filters work independently and together</li>
                <li>Consider using useMemo for performance</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-2xl p-4 md:p-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            Solution
          </h3>

          <div className="mb-4">
            <CurrencyFilter
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              countries={countries}
              variant="buttons"
              showLabel={true}
            />
          </div>

          <div className="mb-6">
            <PaymentTypeFilter
              selectedPaymentType={selectedPaymentType}
              onPaymentTypeChange={setSelectedPaymentType}
              paymentTypes={paymentTypes}
            />
          </div>

          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-gray-600 dark:text-gray-400">
            <div className="text-sm">
              {selectedCountry !== "All" || selectedPaymentType !== "All" ? (
                <span>
                  Active filters:
                  {selectedCountry !== "All" && (
                    <span className="ml-1 font-semibold text-gray-800 dark:text-gray-200">
                      {selectedCountry}
                    </span>
                  )}
                  {selectedCountry !== "All" &&
                    selectedPaymentType !== "All" && <span> + </span>}
                  {selectedPaymentType !== "All" && (
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {selectedPaymentType}
                    </span>
                  )}
                </span>
              ) : (
                <span>No filters active</span>
              )}
            </div>
            <span className="text-sm font-medium">
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
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <>
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
              <h4 className="font-semibold mb-2">1. Extracted Filter Logic</h4>
              <p>
                The filtering logic is now extracted into{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  filterUtils.ts
                </code>
                , making it reusable across different components and easy to
                test independently.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Composable Filtering</h4>
              <p>
                Uses a single{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  filterTransactions
                </code>{" "}
                function with boolean AND logic to combine multiple filters.
                This avoids nested if-statements and keeps the code clean and
                maintainable.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. useMemo for Performance</h4>
              <p>
                Wraps the filtering logic in{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  useMemo
                </code>{" "}
                to avoid recalculating the filtered list on every render. Only
                recomputes when dependencies (selectedCountry,
                selectedPaymentType) change.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                4. Independent Filter State
              </h4>
              <p>
                Each filter has its own state variable. They work independently
                but combine naturally through the filtering logic. You can
                select currency first, payment type first, or both.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Responsive Design</h4>
              <p>
                Uses separate layouts for mobile (cards) and desktop (table).
                Filter buttons adapt with responsive padding, and the active
                filters display stacks vertically on small screens.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">6. Separation of Concerns</h4>
              <p>
                Business logic (filtering) is separated from presentation logic
                (React components), making the codebase more maintainable and
                testable.
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
                Benefits of Extracted Filter Logic
              </h4>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  <span className="font-medium">Reusability:</span> Can be used
                  in multiple components without duplication
                </li>
                <li>
                  <span className="font-medium">Testability:</span> Pure
                  functions are easy to unit test in isolation
                </li>
                <li>
                  <span className="font-medium">Maintainability:</span> Changes
                  to filtering logic only need to happen in one place
                </li>
                <li>
                  <span className="font-medium">Composability:</span> Can easily
                  add new filter types without modifying components
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
