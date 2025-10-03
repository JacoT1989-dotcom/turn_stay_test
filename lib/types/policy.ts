// lib/types/policy.ts
import type { Transaction } from "./transaction";

// Amount tier for progressive pricing
export interface AmountTier {
  upTo?: number; // undefined means "and above"
  feeBps: number;
}

// A fee policy rule with various matching criteria
export interface PolicyRule {
  id: string;
  name: string;
  description?: string;

  // Matching criteria (all must match if specified)
  currency?: "ZAR" | "USD" | "EUR";
  paymentType?: "card" | "bank" | "wallet";
  scheme?: "visa" | "mastercard" | "amex";
  merchantId?: string;

  // Fee configuration
  feeBps?: number; // Simple flat fee
  amountTiers?: AmountTier[]; // Tiered pricing

  // Metadata
  priority?: number; // Manual override for precedence
  enabled: boolean;
  effectiveFrom?: string; // ISO date
  effectiveTo?: string; // ISO date
}

// Base policy for a tenant
export interface TenantPolicy {
  tenantId: string;
  tenantName: string;
  version: number;

  // Default fees by payment type
  defaultFees: {
    card: number;
    bank: number;
    wallet: number;
  };

  // Override rules (sorted by specificity)
  rules: PolicyRule[];

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Result of policy resolution
export interface PolicyResolution {
  feeBps: number;
  feeAmount: number;
  trace: ResolutionStep[];
  finalRule: PolicyRule | null;
  conflict?: PolicyConflict;
}

// Step in the resolution process for explainability
export interface ResolutionStep {
  step: number;
  type: "default" | "rule_match" | "tier_calculation" | "conflict";
  description: string;
  feeBps?: number;
  ruleId?: string;
  ruleName?: string;
}

// When multiple rules have same specificity
export interface PolicyConflict {
  rules: PolicyRule[];
  message: string;
  resolution: "first_match" | "highest_priority" | "manual_review";
}

// Context for resolving a transaction
export interface ResolutionContext {
  transaction: Transaction;
  tenantPolicy: TenantPolicy;
  merchantId?: string; // Additional context not in transaction
}
