// app/api/transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { transactionQuerySchema } from "@/lib/validation/transaction-schema";
import { getTransactions } from "@/lib/services/transaction-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params = transactionQuerySchema.parse({
      currency: searchParams.get("currency"),
      paymentType: searchParams.get("paymentType"),
      cursor: searchParams.get("cursor"),
      limit: searchParams.get("limit") || "5",
    });

    const data = await getTransactions(params);

    const response = NextResponse.json(data);

    // Set cache headers for stale-while-revalidate
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
