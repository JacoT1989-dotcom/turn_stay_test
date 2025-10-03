// components\questions\(question1-client-group)\question1-client.tsx
"use client";

import Link from "next/link";
import { transactions } from "./transaction-data";
import {
  formatAmount,
  formatDate,
  getCurrencyFromCountry,
} from "../formatters";

export default function Question1Client() {
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
              Question 1
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Junior
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            List All Transactions
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg">
              <span className="font-semibold">What you need to do:</span>{" "}
              Display a table showing all transaction data in a clean, readable
              format.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Key Requirements:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Show transaction ID, date, amount, currency, and payment type
                </li>
                <li>
                  Convert amounts from cents to dollars (e.g., 125000 cents →
                  1,250.00 dollars)
                </li>
                <li>
                  Add thousand separators for readability (1,250.00 instead of
                  1250.00)
                </li>
                <li>Format dates from ISO format to something readable</li>
                <li>
                  Use unique keys for each row (important for React performance)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">What good looks like:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Clean component structure</li>
                <li>Proper data formatting (amounts and dates)</li>
                <li>Stable keys using transaction IDs</li>
                <li>Simple, readable code</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className="rounded-xl shadow-2xl p-4 md:p-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            Solution
          </h3>

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
                {transactions.map((tx) => (
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
            {transactions.map((tx) => (
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
        </div>

        {/* Code Explanation */}
        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Key Concepts Demonstrated
          </h3>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold mb-2">1. Format Amount Function</h4>
              <p>
                Converts minor units (cents) to major units (dollars) by
                dividing by 100, then uses{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  toLocaleString()
                </code>{" "}
                to add thousand separators and ensure 2 decimal places. Now
                automatically formats with the correct currency symbol based on
                the country code.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Format Date Function</h4>
              <p>
                Converts ISO date strings to readable format using
                JavaScript&apos;s built-in{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  Date
                </code>{" "}
                object and{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  toLocaleDateString()
                </code>
                .
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Responsive Design</h4>
              <p>
                Uses Tailwind&apos;s{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  md:
                </code>{" "}
                breakpoint to show a table on desktop and card layout on mobile.
                The{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  hidden md:block
                </code>{" "}
                and{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  md:hidden
                </code>{" "}
                classes control visibility based on screen size.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Stable Keys</h4>
              <p>
                Uses{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  key={"{"}tx.id{"}"}
                </code>{" "}
                for React&apos;s reconciliation algorithm. Keys should be stable
                and unique to avoid unnecessary re-renders.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Semantic HTML</h4>
              <p>
                Uses proper table structure with{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {"<thead>"}
                </code>
                ,{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {"<tbody>"}
                </code>
                , and appropriate alignment for better accessibility and
                readability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
