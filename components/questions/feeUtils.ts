// components/questions/feeUtils.ts

import { Tx } from "./shared-types";

/**
 * Fee utility functions for transaction fee calculations
 */

/**
 * Convert basis points to percentage string
 * @param bps - Basis points (1 bps = 0.01%)
 * @returns Formatted percentage string (e.g., "2.60%")
 */
export function bpsToPercent(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

/**
 * Calculate fee amount from transaction amount and fee rate in bps
 * @param amount - Transaction amount in minor units (cents)
 * @param bps - Fee rate in basis points
 * @returns Fee amount in minor units (cents), rounded
 */
export function calcFeeAmount(amount: number, bps: number): number {
  return Math.round((amount * bps) / 10000);
}

/**
 * Calculate net amount after deducting fee
 * @param amount - Transaction amount in minor units (cents)
 * @param bps - Fee rate in basis points
 * @returns Net amount in minor units (cents)
 */
export function calcNetAmount(amount: number, bps: number): number {
  const feeAmount = calcFeeAmount(amount, bps);
  return amount - feeAmount;
}

/**
 * Standard fee rate in basis points
 * 260 bps = 2.60%
 */
export const STANDARD_FEE_BPS = 260;

/**
 * Default fee rates by payment type (in basis points)
 */
export const DEFAULT_FEE_RATES: Record<string, number> = {
  card: 260, // 2.60%
  bank: 90, // 0.90%
  wallet: 150, // 1.50%
};

/**
 * Custom override fee rates by transaction ID
 * Only applied when transaction has hasCustomFee: true
 */
export const CUSTOM_FEE_OVERRIDES: Record<string, number> = {
  t_2: 290, // 2.90% custom rate for t_2
  // Add more custom fees here as needed
};

/**
 * Get the effective fee rate for a transaction
 * If transaction has hasCustomFee: true, look up custom rate
 * Otherwise, use the default rate for the payment type
 * @param tx - Transaction object
 * @returns Fee rate in basis points
 */
export function getFeeBps(tx: Tx): number {
  // Check if transaction has custom fee override
  if (tx.hasCustomFee && CUSTOM_FEE_OVERRIDES[tx.id] !== undefined) {
    return CUSTOM_FEE_OVERRIDES[tx.id];
  }

  // Fall back to default rate for payment type
  return DEFAULT_FEE_RATES[tx.paymentType] || 0;
}

/**
 * Check if a transaction has a custom fee override
 * @param tx - Transaction object
 * @returns True if transaction has a fee override
 */
export function hasOverride(tx: Tx): boolean {
  return tx.hasCustomFee === true && CUSTOM_FEE_OVERRIDES[tx.id] !== undefined;
}
