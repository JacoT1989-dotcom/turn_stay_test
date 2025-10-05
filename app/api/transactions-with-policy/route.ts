// app/api/transactions-with-policy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { transactionPolicyQuerySchema } from "@/lib/validation/policy-schema";
import { resolveFeePolicy } from "@/lib/services/policy-resolver";
import { mockTenantPolicy } from "@/lib/data/mock-policies";
import { mockTransactions } from "@/lib/data/mock-transactions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse and validate the query parameters
    const validatedParams = transactionPolicyQuerySchema.parse({
      currency: searchParams.get("currency"),
      paymentType: searchParams.get("paymentType"),
      cursor: searchParams.get("cursor"),
      limit: searchParams.get("limit"),
      tenantId: searchParams.get("tenantId"),
    });

    // Extract and set defaults after validation
    const params = {
      currency: validatedParams.currency || undefined,
      paymentType: validatedParams.paymentType || undefined,
      cursor: validatedParams.cursor || undefined,
      limit: validatedParams.limit ? parseInt(validatedParams.limit) : 20,
      tenantId: validatedParams.tenantId || "tenant_001",
    };

    // Filter transactions
    let filtered = [...mockTransactions];

    if (params.currency) {
      filtered = filtered.filter((tx) => tx.currency === params.currency);
    }

    if (params.paymentType) {
      filtered = filtered.filter((tx) => tx.paymentType === params.paymentType);
    }

    // Sort by date descending (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply cursor pagination
    let startIndex = 0;
    if (params.cursor) {
      const cursorIndex = filtered.findIndex((tx) => tx.id === params.cursor);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    const paginatedData = filtered.slice(startIndex, startIndex + params.limit);
    const hasMore = startIndex + params.limit < filtered.length;
    const nextCursor = hasMore
      ? paginatedData[paginatedData.length - 1].id
      : null;

    // Resolve policy for each transaction
    // In production, you'd fetch the tenant policy from database based on tenantId
    const results = paginatedData.map((tx) => ({
      transaction: tx,
      resolution: resolveFeePolicy({
        transaction: tx,
        tenantPolicy: mockTenantPolicy,
        merchantId: tx.id === "t_1" ? "merchant_premium" : undefined,
      }),
    }));

    const response = NextResponse.json({
      results,
      pagination: {
        nextCursor,
        hasMore,
        total: filtered.length,
      },
    });

    // Set cache headers for stale-while-revalidate
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=60"
    );

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "Zod validation error:",
        JSON.stringify(error.issues, null, 2)
      );
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Transactions with policy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
