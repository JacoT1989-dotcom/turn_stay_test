// components/questions/aggregationUtils.ts

import { Tx } from "./shared-types";
import { getFeeBps, calcFeeAmount } from "./feeUtils";

/**
 * Structure for grouped transaction data
 */
export interface GroupedData {
  [currency: string]: {
    [paymentType: string]: {
      [scheme: string]: {
        count: number;
        totalAmount: number;
        totalFee: number;
      };
    };
  };
}

/**
 * Build nested aggregate map grouped by currency → payment type → scheme
 * @param transactions - Array of transactions to aggregate
 * @returns Nested object with aggregated data
 */
export function buildGroupedData(transactions: Tx[]): GroupedData {
  const result: GroupedData = {};

  transactions.forEach((tx) => {
    const currency = tx.country; // Using country as currency grouping
    const paymentType = tx.paymentType;
    const scheme = tx.scheme || "none";

    const feeBps = getFeeBps(tx);
    const feeAmount = calcFeeAmount(tx.amount, feeBps);

    // Initialize nested structure
    if (!result[currency]) result[currency] = {};
    if (!result[currency][paymentType]) result[currency][paymentType] = {};
    if (!result[currency][paymentType][scheme]) {
      result[currency][paymentType][scheme] = {
        count: 0,
        totalAmount: 0,
        totalFee: 0,
      };
    }

    // Aggregate values
    result[currency][paymentType][scheme].count += 1;
    result[currency][paymentType][scheme].totalAmount += tx.amount;
    result[currency][paymentType][scheme].totalFee += feeAmount;
  });

  return result;
}
