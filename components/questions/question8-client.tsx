// components/questions/question8-client.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  resolveFeePolicy,
  getRuleCriteria,
} from "@/lib/services/policy-resolver";
import { mockTenantPolicy } from "@/lib/data/mock-policies";
import type { Transaction } from "@/lib/types/transaction";

const transactions: Transaction[] = [
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
    amount: 800000, // R8000 - will trigger tiered pricing
    currency: "ZAR",
    paymentType: "card",
    scheme: "amex",
    createdAt: "2025-09-12T12:00:00Z",
  },
  {
    id: "t_6",
    amount: 75000,
    currency: "USD",
    paymentType: "card",
    scheme: "visa",
    createdAt: "2025-09-13T14:20:00Z",
  },
];

export default function Question8Client() {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null
  );

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

  // Resolve policy for each transaction
  const transactionsWithPolicy = transactions.map((tx) => {
    const resolution = resolveFeePolicy({
      transaction: tx,
      tenantPolicy: mockTenantPolicy,
      merchantId: tx.id === "t_1" ? "merchant_premium" : undefined, // t_1 is premium merchant
    });

    return {
      transaction: tx,
      resolution,
    };
  });

  const selectedTxData = selectedTransaction
    ? transactionsWithPolicy.find(
        (t) => t.transaction.id === selectedTransaction
      )
    : null;

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
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

        {/* Question Header */}
        <div className="rounded-xl shadow-2xl p-8 mb-8 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-bold text-indigo-600">
              Question 8
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
              Principal
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Multi-Tenant Fee Policy + Overrides Matrix
          </h2>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <span className="font-semibold">What you need to do:</span> Build
              a policy system with deterministic fee resolution, specificity
              scoring, and full explainability.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Key Features Implemented:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Tenant-based policy system with base fees + override rules
                </li>
                <li>
                  Specificity scoring: merchantId &gt; scheme &gt; currency &gt;
                  paymentType
                </li>
                <li>Tiered pricing support (progressive rates by amount)</li>
                <li>Conflict detection when multiple rules match equally</li>
                <li>
                  &quot;Why this fee?&quot; explainability with full resolution
                  trace
                </li>
                <li>Date-range support for time-limited promotions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tenant Info */}
        <div className="rounded-xl shadow-2xl p-6 mb-8 bg-white">
          <h3 className="text-xl font-bold mb-3 text-indigo-600">
            Current Tenant Policy
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
            <div>
              <div className="text-sm text-gray-500">Tenant</div>
              <div className="font-semibold">{mockTenantPolicy.tenantName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Version</div>
              <div className="font-semibold">v{mockTenantPolicy.version}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Rules</div>
              <div className="font-semibold">
                {mockTenantPolicy.rules.filter((r) => r.enabled).length} active
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Default Card Fee</div>
              <div className="font-semibold">
                {(mockTenantPolicy.defaultFees.card / 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table/Cards */}
        <div className="rounded-xl shadow-2xl p-4 md:p-8 bg-white">
          <h3 className="text-2xl font-bold mb-6 text-indigo-600">
            Transactions with Policy Resolution
          </h3>

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
                    Payment
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Fee
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Why?
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionsWithPolicy.map(
                  ({ transaction: tx, resolution }) => (
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
                      <td className="py-3 px-4 text-gray-700">{tx.currency}</td>
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
                          {tx.scheme && ` • ${tx.scheme}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {(resolution.feeBps / 100).toFixed(2)}%
                            </span>
                            {resolution.finalRule && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                policy
                              </span>
                            )}
                            {resolution.conflict && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                conflict
                              </span>
                            )}
                          </div>
                          <span className="font-semibold">
                            {formatAmount(resolution.feeAmount)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedTransaction(tx.id)}
                          className="px-3 py-1 rounded-lg text-sm font-medium transition-all bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        >
                          Explain
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {transactionsWithPolicy.map(({ transaction: tx, resolution }) => (
              <div
                key={tx.id}
                className="rounded-lg p-4 border bg-gray-50 border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-sm font-semibold text-indigo-600">
                    {tx.id}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {resolution.finalRule && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        policy
                      </span>
                    )}
                    {resolution.conflict && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        conflict
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
                      {tx.scheme && ` • ${tx.scheme}`}
                    </span>
                  </div>
                </div>

                <div className="text-2xl font-bold mb-2 text-gray-800">
                  {tx.currency} {formatAmount(tx.amount)}
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Fee ({(resolution.feeBps / 100).toFixed(2)}%)
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    {formatAmount(resolution.feeAmount)}
                  </span>
                </div>

                <div className="text-sm mb-3 text-gray-600">
                  {formatDate(tx.createdAt)}
                </div>

                <button
                  onClick={() => setSelectedTransaction(tx.id)}
                  className="w-full px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Explain This Fee
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Explainability Modal */}
        {selectedTxData && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <div
              className="rounded-xl shadow-2xl p-6 md:p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-indigo-600">
                  Why This Fee? - {selectedTxData.transaction.id}
                </h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              {/* Transaction Summary */}
              <div className="p-4 rounded-lg mb-6 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="font-semibold text-gray-800">
                      {formatAmount(selectedTxData.transaction.amount)}{" "}
                      {selectedTxData.transaction.currency}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Payment Method</div>
                    <div className="font-semibold capitalize text-gray-800">
                      {selectedTxData.transaction.paymentType}
                      {selectedTxData.transaction.scheme &&
                        ` • ${selectedTxData.transaction.scheme}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Final Fee</div>
                    <div className="font-semibold text-gray-800">
                      {(selectedTxData.resolution.feeBps / 100).toFixed(2)}% ={" "}
                      {formatAmount(selectedTxData.resolution.feeAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Rule Applied</div>
                    <div className="font-semibold text-gray-800">
                      {selectedTxData.resolution.finalRule?.name ||
                        "Base Policy"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conflict Warning */}
              {selectedTxData.resolution.conflict && (
                <div className="p-4 rounded-lg mb-6 bg-red-50 border border-red-200">
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 text-xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-red-800 mb-1">
                        Policy Conflict Detected
                      </h4>
                      <p className="text-sm text-red-700 mb-2">
                        {selectedTxData.resolution.conflict.message}
                      </p>
                      <div className="text-sm text-red-600">
                        <div className="font-medium">Conflicting rules:</div>
                        <ul className="list-disc ml-5 mt-1">
                          {selectedTxData.resolution.conflict.rules.map(
                            (rule) => (
                              <li key={rule.id}>
                                {rule.name} ({(rule.feeBps || 0) / 100}%)
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Trace */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Resolution Steps
                </h4>
                <div className="space-y-3">
                  {selectedTxData.resolution.trace.map((step) => (
                    <div
                      key={step.step}
                      className={`p-4 rounded-lg border ${
                        step.type === "conflict"
                          ? "border-red-200 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            step.type === "conflict"
                              ? "bg-red-500 text-white"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line text-gray-800">
                            {step.description}
                          </p>
                          {step.feeBps !== undefined && (
                            <div className="mt-1 text-xs text-gray-500">
                              Fee: {(step.feeBps / 100).toFixed(2)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rule Details */}
              {selectedTxData.resolution.finalRule && (
                <div className="mt-6 p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold mb-2 text-gray-800">
                    Applied Rule Details
                  </h4>
                  <div className="text-sm space-y-1">
                    <div className="text-gray-700">
                      <span className="font-medium">ID:</span>{" "}
                      {selectedTxData.resolution.finalRule.id}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Name:</span>{" "}
                      {selectedTxData.resolution.finalRule.name}
                    </div>
                    {selectedTxData.resolution.finalRule.description && (
                      <div className="text-gray-700">
                        <span className="font-medium">Description:</span>{" "}
                        {selectedTxData.resolution.finalRule.description}
                      </div>
                    )}
                    <div className="text-gray-700">
                      <span className="font-medium">Criteria:</span>{" "}
                      {getRuleCriteria(selectedTxData.resolution.finalRule)}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedTransaction(null)}
                className="mt-6 w-full px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Key Concepts */}
        <div className="rounded-xl shadow-2xl p-8 mt-8 bg-white">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600">
            Key Concepts Demonstrated
          </h3>

          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">
                1. Deterministic Policy Resolution
              </h4>
              <p>
                The resolver function uses specificity scoring to
                deterministically choose which rule applies. merchantId (1000)
                &gt; scheme (100) &gt; currency (10) &gt; paymentType (1).
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Conflict Detection</h4>
              <p>
                When multiple rules have the same specificity (e.g., USD
                Mastercard rules 6 & 7), the system detects the conflict, logs
                it, and uses first-match as fallback. Production systems would
                alert on this.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Full Explainability</h4>
              <p>
                Every fee calculation includes a complete trace showing: base
                policy → matching rules → conflicts → final decision. Critical
                for audit, compliance, and debugging.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Tiered Pricing Support</h4>
              <p>
                Rules can define progressive rates (e.g., first R50k at 2.6%,
                rest at 2.4%). The resolver calculates the effective blended
                rate and shows the breakdown.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">5. Responsive Modal Design</h4>
              <p>
                The explainability modal adapts for mobile with reduced padding,
                responsive grid layouts, and full-screen presentation on small
                devices for optimal readability.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">6. Tenant Isolation</h4>
              <p>
                Each tenant has independent policies. In production, this would
                be stored per tenant in the database with versioning for audit
                trails.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">7. Date-Based Rules</h4>
              <p>
                Rules can have effectiveFrom/effectiveTo dates for time-limited
                promotions. The resolver automatically excludes expired or
                future rules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
