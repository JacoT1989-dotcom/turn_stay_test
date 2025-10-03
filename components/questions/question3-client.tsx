// components/questions/question3-client.tsx
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

type Currency = "All" | "ZAR" | "USD" | "EUR";
type PaymentType = "All" | "card" | "bank" | "wallet";

export default function Question3Client() {
  const [isDark, setIsDark] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("All");
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<PaymentType>("All");

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

  // Composable filtering - combine both filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesCurrency =
        selectedCurrency === "All" || tx.currency === selectedCurrency;
      const matchesPaymentType =
        selectedPaymentType === "All" || tx.paymentType === selectedPaymentType;
      return matchesCurrency && matchesPaymentType;
    });
  }, [selectedCurrency, selectedPaymentType]);

  const currencies: Currency[] = ["All", "ZAR", "USD", "EUR"];
  const paymentTypes: PaymentType[] = ["All", "card", "bank", "wallet"];

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
              Question 3
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
              Intermediate
            </span>
          </div>

          <h2
            className={`text-3xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Further Split by Payment Type
          </h2>

          <div
            className={`space-y-4 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
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

        <div
          className={`rounded-xl shadow-2xl p-8 transition-colors ${
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

          {/* Currency Filter */}
          <div className="mb-4">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Filter by Currency
            </label>
            <div className="flex gap-2 flex-wrap">
              {currencies.map((currency) => (
                <button
                  key={currency}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCurrency === currency
                      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                      : isDark
                      ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {currency}
                  {currency !== "All" && (
                    <span className="ml-2 text-xs opacity-70">
                      (
                      {
                        transactions.filter((tx) => tx.currency === currency)
                          .length
                      }
                      )
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Type Filter */}
          <div className="mb-6">
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Filter by Payment Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {paymentTypes.map((paymentType) => (
                <button
                  key={paymentType}
                  onClick={() => setSelectedPaymentType(paymentType)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize ${
                    selectedPaymentType === paymentType
                      ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                      : isDark
                      ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {paymentType}
                  {paymentType !== "All" && (
                    <span className="ml-2 text-xs opacity-70">
                      (
                      {
                        transactions.filter(
                          (tx) => tx.paymentType === paymentType
                        ).length
                      }
                      )
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Info */}
          <div
            className={`mb-4 flex items-center justify-between ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <div className="text-sm">
              {selectedCurrency !== "All" || selectedPaymentType !== "All" ? (
                <span>
                  Active filters:
                  {selectedCurrency !== "All" && (
                    <span className="ml-1 font-semibold">
                      {selectedCurrency}
                    </span>
                  )}
                  {selectedCurrency !== "All" &&
                    selectedPaymentType !== "All" && <span> + </span>}
                  {selectedPaymentType !== "All" && (
                    <span className="font-semibold">{selectedPaymentType}</span>
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
            <div
              className={`py-20 text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
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
            <div className="overflow-x-auto">
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
                  {filteredTransactions.map((tx) => (
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
              <h4 className="font-semibold mb-2">1. Composable Filtering</h4>
              <p>
                Uses a single{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  filter
                </code>{" "}
                function with boolean AND logic to combine multiple filters.
                This avoids nested if-statements and keeps the code clean and
                maintainable.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. useMemo for Performance</h4>
              <p>
                Wraps the filtering logic in{" "}
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  useMemo
                </code>{" "}
                to avoid recalculating the filtered list on every render. Only
                recomputes when dependencies (selectedCurrency,
                selectedPaymentType) change.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                3. Independent Filter State
              </h4>
              <p>
                Each filter has its own state variable. They work independently
                but combine naturally through the filtering logic. You can
                select currency first, payment type first, or both.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Visual Separation</h4>
              <p>
                Uses different colors for different filter types (indigo for
                currency, emerald for payment type) to help users visually
                distinguish between the two filter categories.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Active Filters Display</h4>
              <p>
                Shows which filters are currently active, making it clear to
                users what they&apos;re viewing and helping them understand the
                filtered results.
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
                When is useMemo Actually Useful?
              </h4>
              <p className="mb-2">
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  useMemo
                </code>{" "}
                is beneficial when:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  The computation is expensive (large datasets, complex
                  calculations)
                </li>
                <li>The result is used multiple times in the same render</li>
                <li>You need referential equality for dependency arrays</li>
              </ul>
              <p className="mt-2">
                For this small dataset, useMemo isn&apos;t strictly necessary,
                but it demonstrates the pattern for larger applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
