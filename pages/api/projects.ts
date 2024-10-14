import { get } from "@vercel/edge-config";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const data = await get("tab_projects");
  return NextResponse.json(data);
};

export const config = {
  runtime: "edge",
};

export default handler;
