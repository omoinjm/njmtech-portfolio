import { getRecord } from "@/framework/services/sql.service";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const getCachedLinks = unstable_cache(
  async () => await getRecord("projects"),
  ["projects-links"],
  { tags: ["projects-links-next-js"], revalidate: 3600 },
);

const handler = async (req: NextRequest) => {
  return NextResponse.json(await getCachedLinks());
};

export const config = {
  runtime: "edge",
};

export default handler;
