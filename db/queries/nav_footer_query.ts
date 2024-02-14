import _QueryBase from "../queries/_query_base";

export default class NavFooterQuery extends _QueryBase {
  super() {
    this._defaultSortField = "m.sort_order";
    this.ApplySortExpression(false);
  }

  public Query(): string {
    return `
      select
        f.id,
        f.name,
        f.icon,
        f.route_url,
        f.is_active
      from nav_footer f
      where f.is_active = true
      order by 1 desc;
    `;
  }
}
