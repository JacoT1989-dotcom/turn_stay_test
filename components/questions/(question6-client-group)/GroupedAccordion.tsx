// components/questions/(question6-client-group)/GroupedAccordion.tsx

import { formatAmount, getCurrencyFromCountry } from "../formatters";
import { GroupedData } from "../aggregationUtils";

interface GroupedAccordionProps {
  groupedData: GroupedData;
  expandedGroups: Set<string>;
  onToggleGroup: (groupKey: string) => void;
}

export default function GroupedAccordion({
  groupedData,
  expandedGroups,
  onToggleGroup,
}: GroupedAccordionProps) {
  return (
    <div className="space-y-4">
      {Object.entries(groupedData).map(([country, paymentTypes]) => (
        <div
          key={country}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        >
          <button
            onClick={() => onToggleGroup(country)}
            className="w-full flex items-center justify-between p-4 hover:bg-opacity-80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg
                className={`w-5 h-5 transition-transform ${
                  expandedGroups.has(country) ? "rotate-90" : ""
                } text-gray-600 dark:text-gray-400`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {getCurrencyFromCountry(country as "ZA" | "US" | "EUR")}
              </span>
            </div>
          </button>

          {expandedGroups.has(country) && (
            <div className="px-4 pb-4 space-y-3">
              {Object.entries(paymentTypes).map(([paymentType, schemes]) => (
                <div
                  key={paymentType}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <button
                    onClick={() => onToggleGroup(`${country}-${paymentType}`)}
                    className="w-full flex items-center justify-between p-3 hover:bg-opacity-80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedGroups.has(`${country}-${paymentType}`)
                            ? "rotate-90"
                            : ""
                        } text-gray-500 dark:text-gray-400`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="font-semibold capitalize text-gray-800 dark:text-gray-200">
                        {paymentType}
                      </span>
                    </div>
                  </button>

                  {expandedGroups.has(`${country}-${paymentType}`) && (
                    <div className="px-3 pb-3 space-y-2">
                      {Object.entries(schemes).map(([scheme, data]) => (
                        <div
                          key={scheme}
                          className="p-3 rounded bg-gray-50 dark:bg-gray-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {scheme === "none" ? "No Scheme" : scheme}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              {data.count}{" "}
                              {data.count === 1
                                ? "transaction"
                                : "transactions"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <div>
                              <div className="text-xs opacity-75">
                                Total Amount
                              </div>
                              <div className="font-semibold text-gray-800 dark:text-gray-200">
                                {formatAmount(
                                  data.totalAmount,
                                  country as "ZA" | "US" | "EUR"
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs opacity-75">
                                Total Fee
                              </div>
                              <div className="font-semibold text-gray-800 dark:text-gray-200">
                                {formatAmount(
                                  data.totalFee,
                                  country as "ZA" | "US" | "EUR"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
