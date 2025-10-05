// lib/validation/transaction-schema.ts
import { z } from "zod";

export const transactionQuerySchema = z.object({
  currency: z.enum(["ZAR", "USD", "EUR"]).optional(),
  paymentType: z.enum(["card", "bank", "wallet"]).optional(),
  cursor: z.string().optional(),
  limit: z
    .union([z.string(), z.number(), z.undefined()])
    .transform((val) => {
      if (val === undefined || val === null || val === "") return 5;
      const parsed = typeof val === "string" ? parseInt(val, 10) : val;
      return isNaN(parsed) ? 5 : parsed;
    })
    .pipe(z.number().min(1).max(100)),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
