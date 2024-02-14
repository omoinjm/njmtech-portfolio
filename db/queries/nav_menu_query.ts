import _QueryBase from "../queries/_query_base";

export default class NavMenuQuery extends _QueryBase {
  super() {
    this._defaultSortField = "m.sort_order";
    this.ApplySortExpression(false);
  }

  public Query(): string {
    return `
      select
        m.id,
        m.name,
        m.icon,
        m.route_url,
        m.is_active
      from nav_menu m
      where m.is_active = true
      order by 1 desc;
    `;
  }
}
