// lib/services/policy-resolver.ts
import type {
  PolicyRule,
  PolicyResolution,
  ResolutionStep,
  PolicyConflict,
  ResolutionContext,
} from "@/lib/types/policy";

/**
 * Calculate specificity score for a rule
 * Higher score = more specific = higher precedence
 */
function calculateSpecificity(rule: PolicyRule): number {
  let score = 0;

  if (rule.merchantId) score += 1000; // Most specific
  if (rule.scheme) score += 100;
  if (rule.currency) score += 10;
  if (rule.paymentType) score += 1;

  // Manual priority can boost score
  if (rule.priority) score += rule.priority;

  return score;
}

/**
 * Check if a rule matches the transaction
 */
function ruleMatches(
  rule: PolicyRule,
  transaction: ResolutionContext["transaction"],
  merchantId?: string
): boolean {
  if (!rule.enabled) return false;

  // Check date range
  if (
    rule.effectiveFrom &&
    new Date(transaction.createdAt) < new Date(rule.effectiveFrom)
  ) {
    return false;
  }
  if (
    rule.effectiveTo &&
    new Date(transaction.createdAt) > new Date(rule.effectiveTo)
  ) {
    return false;
  }

  // Check all criteria (all must match if specified)
  if (rule.currency && rule.currency !== transaction.currency) return false;
  if (rule.paymentType && rule.paymentType !== transaction.paymentType)
    return false;
  if (rule.scheme && rule.scheme !== transaction.scheme) return false;
  if (rule.merchantId && rule.merchantId !== merchantId) return false;

  return true;
}

/**
 * Calculate fee for tiered pricing
 */
function calculateTieredFee(
  amount: number,
  rule: PolicyRule
): { feeBps: number; steps: string[] } {
  if (!rule.amountTiers || rule.amountTiers.length === 0) {
    return { feeBps: rule.feeBps || 0, steps: [] };
  }

  const steps: string[] = [];
  let totalFee = 0;
  let remainingAmount = amount;

  // Sort tiers by upTo ascending
  const sortedTiers = [...rule.amountTiers].sort((a, b) => {
    if (a.upTo === undefined) return 1;
    if (b.upTo === undefined) return -1;
    return a.upTo - b.upTo;
  });

  for (let i = 0; i < sortedTiers.length; i++) {
    const tier = sortedTiers[i];
    const tierAmount = tier.upTo
      ? Math.min(remainingAmount, tier.upTo)
      : remainingAmount;

    if (tierAmount > 0) {
      const tierFee = (tierAmount * tier.feeBps) / 10000;
      totalFee += tierFee;

      const tierDesc = tier.upTo
        ? `First ${(tierAmount / 100).toFixed(2)} at ${(
            tier.feeBps / 100
          ).toFixed(2)}%`
        : `Remaining ${(tierAmount / 100).toFixed(2)} at ${(
            tier.feeBps / 100
          ).toFixed(2)}%`;
      steps.push(tierDesc);

      remainingAmount -= tierAmount;
    }
  }

  // Calculate effective bps
  const effectiveBps = amount > 0 ? (totalFee * 10000) / amount : 0;

  return { feeBps: effectiveBps, steps };
}

/**
 * Main policy resolution function with full tracing
 */
export function resolveFeePolicy(context: ResolutionContext): PolicyResolution {
  const { transaction, tenantPolicy, merchantId } = context;
  const trace: ResolutionStep[] = [];
  let stepCounter = 1;

  // Step 1: Start with default fee
  const defaultFeeBps = tenantPolicy.defaultFees[transaction.paymentType];
  trace.push({
    step: stepCounter++,
    type: "default",
    description: `Base policy for ${transaction.paymentType}: ${(
      defaultFeeBps / 100
    ).toFixed(2)}%`,
    feeBps: defaultFeeBps,
  });

  // Step 2: Find all matching rules
  const matchingRules = tenantPolicy.rules.filter((rule) =>
    ruleMatches(rule, transaction, merchantId)
  );

  if (matchingRules.length === 0) {
    // No rules matched, use default
    trace.push({
      step: stepCounter++,
      type: "rule_match",
      description: "No override rules matched. Using base policy.",
    });

    const feeAmount = (transaction.amount * defaultFeeBps) / 10000;

    return {
      feeBps: defaultFeeBps,
      feeAmount,
      trace,
      finalRule: null,
    };
  }

  // Step 3: Score rules by specificity
  const scoredRules = matchingRules.map((rule) => ({
    rule,
    specificity: calculateSpecificity(rule),
  }));

  // Sort by specificity descending
  scoredRules.sort((a, b) => b.specificity - a.specificity);

  // Step 4: Check for conflicts (multiple rules with same highest specificity)
  const highestSpecificity = scoredRules[0].specificity;
  const topRules = scoredRules.filter(
    (sr) => sr.specificity === highestSpecificity
  );

  let conflict: PolicyConflict | undefined;
  let selectedRule: PolicyRule;

  if (topRules.length > 1) {
    // Conflict detected
    conflict = {
      rules: topRules.map((sr) => sr.rule),
      message: `${topRules.length} rules have equal specificity (score: ${highestSpecificity})`,
      resolution: "first_match",
    };

    trace.push({
      step: stepCounter++,
      type: "conflict",
      description: `⚠️ Conflict: ${topRules.length} rules matched with same specificity. Using first match: "${topRules[0].rule.name}"`,
    });

    selectedRule = topRules[0].rule;
  } else {
    selectedRule = scoredRules[0].rule;

    trace.push({
      step: stepCounter++,
      type: "rule_match",
      description: `Matched rule: "${selectedRule.name}" (specificity: ${highestSpecificity})`,
      ruleId: selectedRule.id,
      ruleName: selectedRule.name,
    });
  }

  // Step 5: Calculate final fee
  let finalFeeBps: number;

  if (selectedRule.amountTiers) {
    // Tiered pricing
    const { feeBps, steps } = calculateTieredFee(
      transaction.amount,
      selectedRule
    );
    finalFeeBps = feeBps;

    trace.push({
      step: stepCounter++,
      type: "tier_calculation",
      description: `Tiered pricing applied:\n${steps.join("\n")}`,
      feeBps: finalFeeBps,
    });
  } else {
    // Simple flat fee
    finalFeeBps = selectedRule.feeBps || defaultFeeBps;

    trace.push({
      step: stepCounter++,
      type: "rule_match",
      description: `Applied fee: ${(finalFeeBps / 100).toFixed(2)}%`,
      feeBps: finalFeeBps,
    });
  }

  const feeAmount = (transaction.amount * finalFeeBps) / 10000;

  return {
    feeBps: finalFeeBps,
    feeAmount,
    trace,
    finalRule: selectedRule,
    conflict,
  };
}

/**
 * Helper to get a human-readable description of a rule's criteria
 */
export function getRuleCriteria(rule: PolicyRule): string {
  const criteria: string[] = [];

  if (rule.merchantId) criteria.push(`Merchant: ${rule.merchantId}`);
  if (rule.scheme) criteria.push(`Scheme: ${rule.scheme}`);
  if (rule.currency) criteria.push(`Currency: ${rule.currency}`);
  if (rule.paymentType) criteria.push(`Payment: ${rule.paymentType}`);

  return criteria.length > 0 ? criteria.join(" + ") : "No specific criteria";
}
