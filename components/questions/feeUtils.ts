// components/questions/feeUtils.ts

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
