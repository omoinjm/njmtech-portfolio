import { NextRequest, NextResponse } from "next/server";
import { ILinks } from "../../db/models";
import NavFooterRepo from "../../db/repository/nav_footer_repo";
import NavMenuRepo from "../../db/repository/nav_menu_repo";
import _BaseApi from "./_base_api";
import { unstable_cache } from "next/cache";

const getLinks = async (): Promise<ILinks> => {
  const api = new _BaseApi();

  const menu = api.InitialiseViewModel<NavMenuRepo>(NavMenuRepo);
  const footer = api.InitialiseViewModel<NavFooterRepo>(NavFooterRepo);

  await menu.Initialise();
  await footer.Initialise();

  const data: ILinks = {
    page_links: menu.items,
    footer_links: footer.items,
  };

  return data;
};

const getCachedLinks = unstable_cache(
  async () => {
    return getLinks();
  },
  ["app-links"],
  { tags: ["links-next-js"], revalidate: 3600 },
);

const handler = async (req: NextRequest) => {
  const data = await getCachedLinks();
  return NextResponse.json(data);
};

export const config = {
  runtime: "experimental-edge",
};

export default handler;
