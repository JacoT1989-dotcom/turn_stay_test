// components/questions/question1-client.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

type Tx = {
  id: string;
  amount: number; // in minor units (cents)
  currency: "ZAR" | "USD" | "EUR";
  paymentType: "card" | "bank" | "wallet";
  scheme?: "visa" | "mastercard" | "amex";
  createdAt: string; // ISO
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

export default function Question1Client() {
  const [isDark, setIsDark] = useState(false);

  // Format amount from minor units (cents) to major units with thousand separators
  const formatAmount = (amount: number): string => {
    const majorUnits = amount / 100;
    return majorUnits.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format ISO date to readable format
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
              Question 1
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              Junior
            </span>
          </div>

          <h2
            className={`text-3xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            List All Transactions
          </h2>

          <div
            className={`space-y-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
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
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
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

                <div
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {formatDate(tx.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Explanation */}
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
              <h4 className="font-semibold mb-2">1. Format Amount Function</h4>
              <p>
                Converts minor units (cents) to major units (dollars) by
                dividing by 100, then uses{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  toLocaleString()
                </code>{" "}
                to add thousand separators and ensure 2 decimal places.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Format Date Function</h4>
              <p>
                Converts ISO date strings to readable format using
                JavaScript&apos;s built-in{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  Date
                </code>{" "}
                object and{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  toLocaleDateString()
                </code>
                .
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Responsive Design</h4>
              <p>
                Uses Tailwind&apos;s{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  md:
                </code>{" "}
                breakpoint to show a table on desktop and card layout on mobile.
                The{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  hidden md:block
                </code>{" "}
                and{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  md:hidden
                </code>{" "}
                classes control visibility based on screen size.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Stable Keys</h4>
              <p>
                Uses{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
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
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {"<thead>"}
                </code>
                ,{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
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
