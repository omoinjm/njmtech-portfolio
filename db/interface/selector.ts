export default interface ISelector {
  SelectWithDataTable<T>(query: string): Promise<T[]>;
}
