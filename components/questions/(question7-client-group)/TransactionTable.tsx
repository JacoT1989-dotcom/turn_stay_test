// components/questions/TransactionTable.tsx

import { bpsToPercent, calcFeeAmount, getFeeBps } from "@/lib/utils/fee-utils";
import type { Transaction } from "@/lib/types/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
  isPending?: boolean;
}

export default function TransactionTable({
  transactions,
  isPending = false,
}: TransactionTableProps) {
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

  const hasOverride = (tx: Transaction): boolean => {
    return tx.fee !== undefined;
  };

  if (transactions.length === 0) {
    return (
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
        <p className="text-sm mt-2 opacity-75">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div
      className={
        isPending ? "opacity-60 transition-opacity" : "transition-opacity"
      }
    >
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
            {transactions.map((tx: Transaction) => {
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
                    {formatAmount(tx.amount)}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {tx.currency}
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
        {transactions.map((tx: Transaction) => {
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
                {tx.currency} {formatAmount(tx.amount)}
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Fee ({bpsToPercent(feeBps)})
                </span>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {formatAmount(feeAmount)}
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(tx.createdAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
