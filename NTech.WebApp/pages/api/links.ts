import { NextRequest, NextResponse } from "next/server";
import { LinkModel } from "../../framework/models/link_model";
import { unstable_cache } from "next/cache";
import { BaseComponent } from "../../framework/base/base.component";

class LinkService extends BaseComponent {
  public handler = async (req: NextRequest) => {
    const data = await this.getCachedLinks();
    return NextResponse.json(data);
  };

  private getLinks = async (): Promise<LinkModel | null> => {
    this.response_model = await this.get_sync_call(
      "Navigation/GetNavigation",
      null,
    );

    return {
      page_links: this.response_model.model.menu_list,
      footer_links: this.response_model.model.footer_list,
    };
  };

  private getCachedLinks = unstable_cache(
    async () => {
      return this.getLinks();
    },
    ["app-links"],
    { tags: ["links-next-js"], revalidate: 3600 },
  );
}

export const config = {
  runtime: "experimental-edge",
};

export default new LinkService().handler;
