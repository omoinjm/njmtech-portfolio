import _BaseRepository from "../../db/repository/_base_repository";

export default class _BaseApi {
  InitialiseViewModel<T extends _BaseRepository>(repo: new () => T): T {
    return new repo();
  }
}
