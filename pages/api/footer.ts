import { getList } from "@/services/sql.service";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
   const getCachedLinks = unstable_cache(
      async () => await getList("nav_footer"),
      ["footer-links"],
      { tags: ["footer-links-next-js"], revalidate: 3600 }
   );

   return NextResponse.json(await getCachedLinks());
};

export const config = {
   runtime: "edge",
};

export default handler;

