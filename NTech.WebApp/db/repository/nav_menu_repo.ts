import { NavMenu } from "../models";
import NavMenuQuery from "../queries/nav_menu_query";
import _BaseRepository from "./_base_repository";

export default class NavMenuRepo extends _BaseRepository {
  public items: NavMenu[] = [];

  public async Initialise(): Promise<void> {
    const query = new NavMenuQuery();

    this.items = await this.selector.SelectWithDataTable<NavMenu>(
      query.Query(),
    );
  }
}
