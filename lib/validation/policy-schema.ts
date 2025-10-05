// lib/validation/policy-schema.ts
import { z } from "zod";

// Schema for a single transaction in policy resolution
export const policyTransactionSchema = z.object({
  id: z.string(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["ZAR", "USD", "EUR"]),
  paymentType: z.enum(["card", "bank", "wallet"]),
  scheme: z.enum(["visa", "mastercard", "amex"]).optional(),
  createdAt: z.string().datetime("Invalid datetime format"),
});

// Schema for batch policy resolution request
export const batchPolicyResolutionSchema = z.object({
  transactions: z
    .array(policyTransactionSchema)
    .min(1, "At least one transaction is required")
    .max(100, "Maximum 100 transactions per batch"),
  merchantId: z.string().optional(),
  tenantId: z.string().default("tenant_001"),
});

// Schema for single policy resolution request
export const singlePolicyResolutionSchema = z.object({
  transactionId: z.string().optional(),
  amount: z.string().transform((val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      throw new Error("Amount must be a positive number");
    }
    return num;
  }),
  currency: z.enum(["ZAR", "USD", "EUR"]),
  paymentType: z.enum(["card", "bank", "wallet"]),
  scheme: z.enum(["visa", "mastercard", "amex"]).optional(),
  merchantId: z.string().optional(),
  tenantId: z.string().default("tenant_001"),
});

// Schema for querying transactions with policy resolution (GET request)
export const transactionPolicyQuerySchema = z.object({
  currency: z.enum(["ZAR", "USD", "EUR"]).optional().nullable(),
  paymentType: z.enum(["card", "bank", "wallet"]).optional().nullable(),
  cursor: z.string().optional().nullable(),
  limit: z.string().optional().nullable(),
  tenantId: z.string().optional().nullable(),
});

// Type exports
export type PolicyTransactionInput = z.infer<typeof policyTransactionSchema>;
export type BatchPolicyResolutionInput = z.infer<
  typeof batchPolicyResolutionSchema
>;
export type SinglePolicyResolutionInput = z.infer<
  typeof singlePolicyResolutionSchema
>;
export type TransactionPolicyQuery = z.infer<
  typeof transactionPolicyQuerySchema
>;
