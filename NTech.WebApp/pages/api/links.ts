import { NextRequest, NextResponse } from "next/server";
import { LinkModel } from "../../framework/models/link_model";
import { BaseComponent } from "../../framework/base/base.component";

class LinkService extends BaseComponent {
  public handler = async (req: NextRequest) => {
    return NextResponse.json("{}");
  };
}

export const config = {
  runtime: "experimental-edge",
};

export default new LinkService().handler;
