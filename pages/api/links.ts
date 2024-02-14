import { get } from "@vercel/edge-config";
import { NextRequest, NextResponse } from "next/server";
import { ILinks } from "../../db/models";
import NavFooterRepo from "../../db/repository/nav_footer_repo";
import NavMenuRepo from "../../db/repository/nav_menu_repo";
import _BaseApi from "./_base_api";

const handler = async (req: NextRequest) => {
  const api = new _BaseApi();

  const menu = api.InitialiseViewModel<NavMenuRepo>(NavMenuRepo);
  const footer = api.InitialiseViewModel<NavFooterRepo>(NavFooterRepo);

  await menu.Initialise();
  await footer.Initialise();

  const data: ILinks = {
    page_links: menu.items,
    footer_links: footer.items,
  };

  return NextResponse.json(data);
};

export const config = {
  runtime: "experimental-edge",
};

export default handler;
