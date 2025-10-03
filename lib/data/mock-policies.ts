// lib/data/mock-policies.ts
import type { TenantPolicy } from "@/lib/types/policy";

// Example tenant: E-commerce platform
export const mockTenantPolicy: TenantPolicy = {
  tenantId: "tenant_001",
  tenantName: "Acme E-commerce",
  version: 3,

  // Base default fees
  defaultFees: {
    card: 260, // 2.60%
    bank: 90, // 0.90%
    wallet: 150, // 1.50%
  },

  rules: [
    // Rule 1: USD Visa cards get preferential rate
    {
      id: "rule_001",
      name: "USD Visa Preferential",
      description: "Lower rate for USD Visa transactions",
      currency: "USD",
      paymentType: "card",
      scheme: "visa",
      feeBps: 250, // 2.50%
      enabled: true,
    },

    // Rule 2: High-value ZAR transactions get tiered pricing
    {
      id: "rule_002",
      name: "ZAR High-Value Tiered",
      description: "Progressive pricing for large ZAR amounts",
      currency: "ZAR",
      paymentType: "card",
      amountTiers: [
        { upTo: 5000000, feeBps: 260 }, // First R50k at 2.60%
        { feeBps: 240 }, // Rest at 2.40%
      ],
      enabled: true,
    },

    // Rule 3: Premium merchant gets special rate
    {
      id: "rule_003",
      name: "Premium Merchant Rate",
      description: "VIP pricing for merchant_premium",
      merchantId: "merchant_premium",
      feeBps: 200, // 2.00% across the board
      enabled: true,
      priority: 50, // Boost priority
    },

    // Rule 4: EUR wallet payments
    {
      id: "rule_004",
      name: "EUR Wallet Special",
      description: "Discounted rate for EUR wallet",
      currency: "EUR",
      paymentType: "wallet",
      feeBps: 120, // 1.20%
      enabled: true,
    },

    // Rule 5: Amex surcharge
    {
      id: "rule_005",
      name: "Amex Surcharge",
      description: "Higher rate for Amex cards",
      scheme: "amex",
      feeBps: 320, // 3.20%
      enabled: true,
    },

    // Rule 6: USD Mastercard - creates conflict with rule 7
    {
      id: "rule_006",
      name: "USD Mastercard Rate A",
      description: "First USD Mastercard rule",
      currency: "USD",
      paymentType: "card",
      scheme: "mastercard",
      feeBps: 270, // 2.70%
      enabled: true,
    },

    // Rule 7: USD Mastercard alternative - CONFLICT with rule 6
    {
      id: "rule_007",
      name: "USD Mastercard Rate B",
      description: "Alternative USD Mastercard rule (creates conflict)",
      currency: "USD",
      paymentType: "card",
      scheme: "mastercard",
      feeBps: 280, // 2.80%
      enabled: true,
    },

    // Rule 8: Time-limited promotion (expired)
    {
      id: "rule_008",
      name: "Holiday Promotion 2024",
      description: "Expired promotional rate",
      currency: "ZAR",
      feeBps: 200,
      enabled: true,
      effectiveFrom: "2024-12-01T00:00:00Z",
      effectiveTo: "2024-12-31T23:59:59Z",
    },

    // Rule 9: Future promotion (not yet active)
    {
      id: "rule_009",
      name: "Q2 2026 Promotion",
      description: "Future promotional rate",
      currency: "USD",
      feeBps: 220,
      enabled: true,
      effectiveFrom: "2026-04-01T00:00:00Z",
      effectiveTo: "2026-06-30T23:59:59Z",
    },

    // Rule 10: Disabled rule (should never match)
    {
      id: "rule_010",
      name: "Disabled Test Rule",
      description: "This rule is disabled",
      currency: "EUR",
      feeBps: 100,
      enabled: false,
    },
  ],

  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-09-15T10:30:00Z",
};

// Alternative tenant for testing
export const mockTenantPolicy2: TenantPolicy = {
  tenantId: "tenant_002",
  tenantName: "Marketplace Inc",
  version: 1,

  defaultFees: {
    card: 280, // 2.80%
    bank: 100, // 1.00%
    wallet: 180, // 1.80%
  },

  rules: [
    {
      id: "rule_mp_001",
      name: "All Cards Flat Rate",
      description: "Simple flat rate for all card transactions",
      paymentType: "card",
      feeBps: 275, // 2.75%
      enabled: true,
    },
  ],

  createdAt: "2025-08-01T00:00:00Z",
  updatedAt: "2025-08-01T00:00:00Z",
};
