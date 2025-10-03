// components/questions/(question5-client-group)/question5-client.tsx

"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Country, PaymentType } from "../shared-types";
import { transactions } from "./transactions-data";
import {
  formatAmount,
  formatDate,
  getCurrencyFromCountry,
} from "../formatters";
import CurrencyFilter from "../CurrencyFilter";
import PaymentTypeFilter from "../PaymentTypeFilter";
import { filterTransactions } from "../filterUtils";
import {
  bpsToPercent,
  calcFeeAmount,
  getFeeBps,
  hasOverride,
} from "../feeUtils";

const countries: Country[] = ["All", "ZA", "US", "EUR"];
const paymentTypes: PaymentType[] = ["All", "card", "bank", "wallet"];

export default function Question5Client() {
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
              Question 5
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              Intermediate → Senior
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Display and Prioritize Overrides
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg">
              <span className="font-semibold">What you need to do:</span> If a
              transaction has a custom fee (in bps), use it instead of the
              generic fee. Visually indicate overridden fees with a badge.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Key Requirements:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Check if transaction has a custom fee override</li>
                <li>Use override fee instead of generic fee when present</li>
                <li>Display an &quot;override&quot; badge for custom fees</li>
                <li>Maintain correct fee precedence logic</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">What good looks like:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Correct override precedence</li>
                <li>
                  Single function that resolves effective fee:
                  effectiveFeeBps(tx)
                </li>
                <li>Minimal duplication</li>
                <li>Clear visual distinction for overrides</li>
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
              showLabel={true}
            />
          </div>

          <div className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
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
                    {filteredTransactions.map((tx) => {
                      const feeBps = getFeeBps(tx);
                      const feeAmount = calcFeeAmount(tx.amount, feeBps);
                      const isOverride = hasOverride(tx);

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
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {bpsToPercent(feeBps)}
                                </span>
                                {isOverride && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                    override
                                  </span>
                                )}
                              </div>
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
                {filteredTransactions.map((tx) => {
                  const feeBps = getFeeBps(tx);
                  const feeAmount = calcFeeAmount(tx.amount, feeBps);
                  const isOverride = hasOverride(tx);

                  return (
                    <div
                      key={tx.id}
                      className="rounded-lg p-4 border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          {tx.id}
                        </span>
                        <div className="flex items-center gap-2">
                          {isOverride && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                              override
                            </span>
                          )}
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
          )}
        </div>

        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Key Concepts Demonstrated
          </h3>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold mb-2">
                1. Shared Components & Utilities
              </h4>
              <p>
                Reuses{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  CurrencyFilter
                </code>
                ,{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  PaymentTypeFilter
                </code>
                ,{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  filterTransactions
                </code>
                , and fee utilities from shared modules.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Override Precedence</h4>
              <p>
                The{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  getFeeBps
                </code>{" "}
                function checks for override fee first before falling back to
                default fee by payment type. This implements correct precedence
                in a single place.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Single Source of Truth</h4>
              <p>
                All fee logic is centralized in{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  feeUtils.ts
                </code>
                . The component doesn&apos;t need to know about override logic -
                it just calls{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  getFeeBps(tx)
                </code>{" "}
                and gets the correct fee.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Visual Indicator</h4>
              <p>
                Transactions with custom fees show an amber &quot;override&quot;
                badge, making it immediately clear which transactions have
                special pricing. This improves transparency and user
                understanding.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                5. Responsive Badge Placement
              </h4>
              <p>
                On desktop, the override badge appears next to the fee
                percentage. On mobile, it&apos;s positioned at the top right
                with the payment type badge for better visibility and space
                efficiency.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">6. Minimal Duplication</h4>
              <p>
                The{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  hasOverride
                </code>{" "}
                helper function encapsulates the check, keeping code DRY and
                making it easy to change the override detection logic if needed.
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
                How to Test Override Logic?
              </h4>
              <p className="mb-2">
                The fee utility functions are pure functions, making them easy
                to test:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Test with transaction that has no override - should use
                  default fee for payment type
                </li>
                <li>
                  Test with transaction that has override - should use override
                  fee
                </li>
                <li>
                  Test edge cases: override = 0, negative values, very large
                  values
                </li>
                <li>
                  Test that calculation is correct: (amount × bps) / 10,000
                </li>
              </ul>
              <p className="mt-2">
                Since the logic is in a separate file with no dependencies, it
                can be unit tested in isolation without needing to mount React
                components.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                Complete Reusability Achieved
              </h4>
              <p className="mb-2">Questions 2-5 now share:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Type definitions (shared-types.ts)</li>
                <li>Filter components (CurrencyFilter, PaymentTypeFilter)</li>
                <li>Filter logic (filterUtils.ts)</li>
                <li>Fee calculations (feeUtils.ts)</li>
                <li>
                  Formatters (formatAmount, formatDate, getCurrencyFromCountry)
                </li>
              </ul>
              <p className="mt-2">
                This demonstrates production-ready architecture with maximum
                code reuse, single source of truth, and easy maintainability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
