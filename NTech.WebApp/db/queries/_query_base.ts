export default abstract class _QueryBase {
  public _defaultSortField: string = "1";
  public _sortExpression: string = "";
  public _whereClause: string = "";

  public abstract Query(): string;

  public ApplySortExpression(ascending?: boolean): void {
    var direction = "asc";

    if (ascending == false) {
      direction = "desc";
    }

    this._sortExpression = `${this._defaultSortField} ${direction}`;
  }
}
