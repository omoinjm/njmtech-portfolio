import ISelector from "../interface/selector";
import SqlSelector from "../connectors/sql_selector";

export default class _BaseRepository {
  public selector: ISelector;

  /// <summary>
  /// We use this to connect to our databases, we could theoretically add more connectors here for different db types.
  /// </summary>
  /// <param name="session"></param>
  constructor() {
    this.selector = new SqlSelector();
  }
}
