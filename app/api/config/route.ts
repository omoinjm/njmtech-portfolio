/**
 * Example API Route using Config Service
 * 
 * This demonstrates how to use the server-side config service
 * in API routes to access environment variables securely.
 * 
 * Usage:
 * - GET /api/config/public - Returns public config values
 * - GET /api/config?endpoint=health - Returns API health status
 */

import { config } from "@/lib/config";
import { NextResponse } from "next/server";

/**
 * GET /api/config
 * Returns public configuration (safe to expose to client)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");

    if (endpoint === "health") {
      // Health check endpoint
      return NextResponse.json({
        status: "ok",
        environment: config.isDevelopment() ? "development" : "production",
        timestamp: new Date().toISOString(),
      });
    }

    // Return public config
    return NextResponse.json({
      siteUrl: config.get("NEXT_PUBLIC_SITE_URL"),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error("Config API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
