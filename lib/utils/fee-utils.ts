// lib/utils/fee-utils.ts

type PaymentType = "card" | "bank" | "wallet";

interface Transaction {
  amount: number;
  paymentType: PaymentType;
  fee?: number;
}

// Fee rates in basis points (bps)
// 1 bps = 0.01%, so 260 bps = 2.60%
export const genericFeesBps = {
  card: 260, // 2.60%
  bank: 90, // 0.90%
  wallet: 150, // 1.50%
} as const;

/**
 * Convert basis points to percentage string
 * @param bps - Basis points (e.g., 260 for 2.60%)
 * @returns Formatted percentage string (e.g., "2.60%")
 */
export function bpsToPercent(bps: number): string {
  return (bps / 100).toFixed(2) + "%";
}

/**
 * Calculate fee amount from basis points and transaction amount
 * @param amount - Transaction amount in minor units (cents)
 * @param bps - Fee rate in basis points
 * @returns Fee amount in minor units (cents)
 */
export function calcFeeAmount(amount: number, bps: number): number {
  return (amount * bps) / 10000;
}

/**
 * Get the fee rate in basis points for a transaction
 * Uses override fee if present, otherwise uses generic fee for payment type
 * @param tx - Transaction object
 * @returns Fee rate in basis points
 */
export function getFeeBps(tx: Transaction): number {
  // If transaction has override fee, use it
  if (tx.fee !== undefined) {
    return tx.fee;
  }

  // Otherwise use the generic fee for this payment type
  return genericFeesBps[tx.paymentType];
}
