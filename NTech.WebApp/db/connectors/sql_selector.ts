import { sql } from "@vercel/postgres";
import ISelector from "../interface/selector";

export default class SqlSelector implements ISelector {
  public async SelectWithDataTable<T>(query: string): Promise<T[]> {
    const result: any = await sql.query(query);

    return result.rows as T[];
  }
}
