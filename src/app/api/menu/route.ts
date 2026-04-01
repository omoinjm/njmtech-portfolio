import { getRecord } from "@/services/sql.service";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const getCachedLinks = unstable_cache(
  async () => await getRecord("links"),
  ["menu-links"],
  {
    tags: ["menu-links"],
    revalidate: 3600,
  },
);

export async function GET() {
  try {
    const data = await getCachedLinks();

    // For local development test
    // const data = await getRecord("links");

    return NextResponse.json(data?.navigation_data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
