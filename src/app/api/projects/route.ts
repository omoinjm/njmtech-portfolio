import { getRecord } from "@/services/sql.service";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const getCachedLinks = unstable_cache(
  async () => await getRecord("projects"),
  ["projects-links"],
  {
    tags: ["projects-links-next-js"],
    revalidate: 3600,
  },
);

export async function GET() {
  try {
    const data = await getCachedLinks();

    // For local development test
    // const data = await getRecord("projects");

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
