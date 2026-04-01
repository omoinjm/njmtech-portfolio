import { getList } from "@/services/sql.service";
import { NextResponse } from "next/server";
import { logger } from "@/utils/logger";

export async function GET() {
  try {
    logger.info("Fetching menu data...");
    const data = await getList("nav_menu");
    logger.info("Menu API response", data);

    return NextResponse.json({ page_links: data || [] });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = error instanceof Error && 'code' in error ? error.code : 'UNKNOWN';
    
    // Log full error for debugging
    logger.error("Menu API error", { error, message: errorMessage, code: errorCode });
    
    // Return empty menu instead of 500 for connection issues
    if (errorCode === 'ETIMEDOUT' || errorMessage.includes('timeout')) {
      logger.warn("Database connection timeout, returning empty menu");
      return NextResponse.json({ page_links: [], error: "Database temporarily unavailable" });
    }
    
    return NextResponse.json(
      {
        error: errorMessage,
        page_links: [],
      },
      { status: 500 },
    );
  }
}
