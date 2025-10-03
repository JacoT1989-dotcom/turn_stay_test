// lib/validation/transaction-schema.ts
import { z } from "zod";

export const transactionQuerySchema = z.object({
  currency: z.enum(["ZAR", "USD", "EUR"]).optional(),
  paymentType: z.enum(["card", "bank", "wallet"]).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(5),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
