// components/questions/(question4-client-group)/question4-client.tsx

"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Country, PaymentType } from "../shared-types";
import {
  formatAmount,
  formatDate,
  getCurrencyFromCountry,
} from "../formatters";
import CurrencyFilter from "../CurrencyFilter";
import PaymentTypeFilter from "../PaymentTypeFilter";
import { filterTransactions } from "../filterUtils";
import { bpsToPercent, calcFeeAmount, STANDARD_FEE_BPS } from "../feeUtils";
import { transactions } from "./transactions-data";

const countries: Country[] = ["All", "ZA", "US", "EUR"];
const paymentTypes: PaymentType[] = ["All", "card", "bank", "wallet"];

export default function Question4Client() {
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
              Question 4
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Intermediate
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Show Fees and Compute Amounts
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg">
              <span className="font-semibold">What you need to do:</span> Add a
              Fee column that shows the fee rate (as a percentage) and the
              calculated fee amount in major units.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Key Requirements:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>All transactions use a flat 2.60% (260 bps) fee</li>
                <li>
                  Display both the rate (e.g., &quot;2.60%&quot;) and the fee
                  amount
                </li>
                <li>Fee applies uniformly across all payment types</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">What good looks like:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Correct fee calculation: (amount × bps) / 10,000</li>
                <li>Accurate basis-points → percentage conversion</li>
                <li>Clean utility functions (bpsToPercent, calcFeeAmount)</li>
                <li>Proper domain math</li>
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
                      const feeAmount = calcFeeAmount(
                        tx.amount,
                        STANDARD_FEE_BPS
                      );

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
                                {bpsToPercent(STANDARD_FEE_BPS)}
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
                {filteredTransactions.map((tx) => {
                  const feeAmount = calcFeeAmount(tx.amount, STANDARD_FEE_BPS);

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
                          Fee ({bpsToPercent(STANDARD_FEE_BPS)})
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
                1. Shared Filter Components
              </h4>
              <p>
                Reuses{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  CurrencyFilter
                </code>{" "}
                and{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  PaymentTypeFilter
                </code>{" "}
                components from shared utilities, demonstrating component
                reusability.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Extracted Fee Utilities</h4>
              <p>
                Fee calculations are in{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  feeUtils.ts
                </code>{" "}
                - pure functions that are testable and maintainable.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                3. Basis Points to Percentage
              </h4>
              <p>
                Basis points (bps) are 1/100th of a percent. 260 bps = 2.60%.
                The formula is: percentage = bps / 100.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Fee Amount Calculation</h4>
              <p>
                Formula: (amount × bps) / 10,000. For t_1: (125000 × 260) /
                10,000 = 3,250 cents = R32.50.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Shared Filter Logic</h4>
              <p>
                Uses{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  filterTransactions
                </code>{" "}
                from{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  filterUtils.ts
                </code>{" "}
                - same filtering logic as Questions 2 and 3.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">6. Responsive Fee Display</h4>
              <p>
                Desktop shows fee rate and amount in a stacked column. Mobile
                displays fee information horizontally within each card for
                better space utilization.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Architecture Benefits
          </h3>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold mb-2">Complete Reusability</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  <span className="font-medium">Shared Types:</span> All
                  questions use the same{" "}
                  <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    Tx
                  </code>
                  ,{" "}
                  <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    Country
                  </code>
                  , and{" "}
                  <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    PaymentType
                  </code>
                </li>
                <li>
                  <span className="font-medium">Shared Components:</span>{" "}
                  CurrencyFilter and PaymentTypeFilter work across all questions
                </li>
                <li>
                  <span className="font-medium">Shared Utilities:</span>{" "}
                  filterUtils, feeUtils, and formatters are reused everywhere
                </li>
                <li>
                  <span className="font-medium">Easy to Test:</span> Pure
                  functions can be unit tested independently
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
