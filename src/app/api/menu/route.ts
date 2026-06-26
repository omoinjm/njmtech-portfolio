import { getMenuLinks } from "@/services/sql.service";
import { logger } from "@/utils/logger";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const getCachedLinks = unstable_cache(
  async () => await getMenuLinks(),
  ["menu-links"],
  {
    tags: ["menu-links"],
    revalidate: 3600,
  },
);

export async function GET() {
  try {
    const data = await getCachedLinks();
    return NextResponse.json(data);
  } catch (error) {
    logger.error("Menu route error", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
