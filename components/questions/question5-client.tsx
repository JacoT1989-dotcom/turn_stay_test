// components/questions/question5-client.tsx
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

export default function Question5Client() {
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

  // Check if transaction has override fee
  const hasOverride = (tx: Tx): boolean => {
    return tx.fee !== undefined;
  };

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
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-colors bg-white text-gray-700 hover:bg-gray-100"
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

        <div className="rounded-xl shadow-2xl p-8 mb-8 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-bold text-indigo-600">
              Question 5
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
              Intermediate → Senior
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Display and Prioritize Overrides
          </h2>

          <div className="space-y-4 text-gray-700">
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

        <div className="rounded-xl shadow-2xl p-4 md:p-8 bg-white">
          <h3 className="text-2xl font-bold mb-6 text-indigo-600">Solution</h3>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Filter by Currency
            </label>
            <div className="flex gap-2 flex-wrap">
              {currencies.map((currency) => (
                <button
                  key={currency}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCurrency === currency
                      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Filter by Payment Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {paymentTypes.map((paymentType) => (
                <button
                  key={paymentType}
                  onClick={() => setSelectedPaymentType(paymentType)}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize ${
                    selectedPaymentType === paymentType
                      ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {paymentType}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 text-sm font-medium text-gray-600">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
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
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Currency
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Payment Type
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
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
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono text-sm text-gray-600">
                            {tx.id}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {formatDate(tx.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800">
                            {formatAmount(tx.amount)}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
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
                          <td className="py-3 px-4 text-right text-gray-700">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {bpsToPercent(feeBps)}
                                </span>
                                {isOverride && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                                    override
                                  </span>
                                )}
                              </div>
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
                {filteredTransactions.map((tx) => {
                  const feeBps = getFeeBps(tx);
                  const feeAmount = calcFeeAmount(tx.amount, feeBps);
                  const isOverride = hasOverride(tx);

                  return (
                    <div
                      key={tx.id}
                      className="rounded-lg p-4 border bg-gray-50 border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-sm font-semibold text-indigo-600">
                          {tx.id}
                        </span>
                        <div className="flex items-center gap-2">
                          {isOverride && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                              override
                            </span>
                          )}
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
                      </div>

                      <div className="text-2xl font-bold mb-2 text-gray-800">
                        {tx.currency} {formatAmount(tx.amount)}
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Fee ({bpsToPercent(feeBps)})
                        </span>
                        <span className="text-lg font-semibold text-gray-800">
                          {formatAmount(feeAmount)}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600">
                        {formatDate(tx.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600">
            Key Concepts Demonstrated
          </h3>

          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">1. Override Precedence</h4>
              <p>
                The{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100">
                  getFeeBps
                </code>{" "}
                function checks for override fee first before falling back to
                generic fee. This implements correct precedence in a single
                place.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Single Source of Truth</h4>
              <p>
                All fee logic is centralized in the utility function. The
                component doesn&apos;t need to know about override logic - it
                just calls{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100">
                  getFeeBps(tx)
                </code>{" "}
                and gets the correct fee.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Visual Indicator</h4>
              <p>
                Transactions with custom fees show an amber &quot;override&quot;
                badge, making it immediately clear which transactions have
                special pricing. This improves transparency and user
                understanding.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                4. Responsive Badge Placement
              </h4>
              <p>
                On desktop, the override badge appears next to the fee
                percentage. On mobile, it&apos;s positioned at the top right
                with the payment type badge for better visibility and space
                efficiency.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Minimal Duplication</h4>
              <p>
                The{" "}
                <code className="px-2 py-1 rounded text-sm bg-gray-100">
                  hasOverride
                </code>{" "}
                helper function encapsulates the check, keeping code DRY and
                making it easy to change the override detection logic if needed.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600">
            Follow-up Discussion
          </h3>

          <div className="space-y-4 text-gray-700">
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
                  generic fee
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
          </div>
        </div>
      </div>
    </div>
  );
}
