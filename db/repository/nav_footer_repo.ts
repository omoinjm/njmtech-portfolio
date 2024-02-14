import { NavFooter } from "../models";
import NavFooterQuery from "../queries/nav_footer_query";
import _BaseRepository from "./_base_repository";

export default class NavFooterRepo extends _BaseRepository {
  public items: NavFooter[] = [];

  public async Initialise(): Promise<void> {
    const query = new NavFooterQuery();

    this.items = await this.selector.SelectWithDataTable<NavFooter>(
      query.Query(),
    );
  }
}
