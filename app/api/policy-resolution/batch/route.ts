// app/api/policy-resolution/batch/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { batchPolicyResolutionSchema } from "@/lib/validation/policy-schema";
import { resolveFeePolicy } from "@/lib/services/policy-resolver";
import { mockTenantPolicy } from "@/lib/data/mock-policies";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const params = batchPolicyResolutionSchema.parse(body);

    // Resolve policy for all transactions
    // In production, you'd fetch the tenant policy from database based on tenantId
    const results = params.transactions.map((tx) => ({
      transaction: tx,
      resolution: resolveFeePolicy({
        transaction: tx,
        tenantPolicy: mockTenantPolicy,
        merchantId:
          params.merchantId ||
          (tx.id === "t_1" ? "merchant_premium" : undefined),
      }),
    }));

    const response = NextResponse.json({ results });

    // Set cache headers for stale-while-revalidate
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=60"
    );

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Batch policy resolution error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
