// components/questions/(question8-client-group)/PolicyExplainabilityModal.tsx
import { getRuleCriteria } from "@/lib/services/policy-resolver";
import type { TransactionWithPolicyResult } from "@/lib/hooks/use-transactions-with-policy";

interface PolicyExplainabilityModalProps {
  selectedTxData: TransactionWithPolicyResult | null;
  onClose: () => void;
}

export default function PolicyExplainabilityModal({
  selectedTxData,
  onClose,
}: PolicyExplainabilityModalProps) {
  if (!selectedTxData) return null;

  const formatAmount = (amount: number): string => {
    const majorUnits = amount / 100;
    return majorUnits.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-2xl p-6 md:p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Why This Fee? - {selectedTxData.transaction.id}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Transaction Summary */}
        <div className="p-4 rounded-lg mb-6 bg-gray-50 dark:bg-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Amount
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {formatAmount(selectedTxData.transaction.amount)}{" "}
                {selectedTxData.transaction.currency}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Payment Method
              </div>
              <div className="font-semibold capitalize text-gray-800 dark:text-gray-200">
                {selectedTxData.transaction.paymentType}
                {selectedTxData.transaction.scheme &&
                  ` • ${selectedTxData.transaction.scheme}`}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Final Fee
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {(selectedTxData.resolution.feeBps / 100).toFixed(2)}% ={" "}
                {formatAmount(selectedTxData.resolution.feeAmount)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Rule Applied
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {selectedTxData.resolution.finalRule?.name || "Base Policy"}
              </div>
            </div>
          </div>
        </div>

        {/* Conflict Warning */}
        {selectedTxData.resolution.conflict && (
          <div className="p-4 rounded-lg mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                  Policy Conflict Detected
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                  {selectedTxData.resolution.conflict.message}
                </p>
                <div className="text-sm text-red-600 dark:text-red-400">
                  <div className="font-medium">Conflicting rules:</div>
                  <ul className="list-disc ml-5 mt-1">
                    {selectedTxData.resolution.conflict.rules.map((rule) => (
                      <li key={rule.id}>
                        {rule.name} ({(rule.feeBps || 0) / 100}%)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resolution Trace */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Resolution Steps
          </h4>
          <div className="space-y-3">
            {selectedTxData.resolution.trace.map((step) => (
              <div
                key={step.step}
                className={`p-4 rounded-lg border ${
                  step.type === "conflict"
                    ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.type === "conflict"
                        ? "bg-red-500 text-white"
                        : "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                    }`}
                  >
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-line text-gray-800 dark:text-gray-200">
                      {step.description}
                    </p>
                    {step.feeBps !== undefined && (
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
          <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Applied Rule Details
            </h4>
            <div className="text-sm space-y-1">
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">ID:</span>{" "}
                {selectedTxData.resolution.finalRule.id}
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Name:</span>{" "}
                {selectedTxData.resolution.finalRule.name}
              </div>
              {selectedTxData.resolution.finalRule.description && (
                <div className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Description:</span>{" "}
                  {selectedTxData.resolution.finalRule.description}
                </div>
              )}
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Criteria:</span>{" "}
                {getRuleCriteria(selectedTxData.resolution.finalRule)}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
