import ConfigService from "../apiconnector/config.service";
import DataService from "../apiconnector/data.service";
import ResponseModel from "../models/response_model";

export class BaseComponent {
  public IsLoading: boolean = false;
  public response_model: ResponseModel = new ResponseModel();
  public config_service: any;

  constructor() {
    this.config_service = ConfigService;
  }

  //New posting method that uses a more synchronous way of getting the data
  //This will also handle the is loading variable that we reuse everywhere and rather in a more central place.
  public async post_sync_call(apiUrl: string, payload?: object) {
    this.IsLoading = true;

    var response: ResponseModel = await DataService.post_sync(apiUrl, payload);

    console.log(response);

    this.IsLoading = false;

    return response;
  }

  //New posting method that uses a more synchronous way of getting the data
  //This will also handle the is loading variable that we reuse everywhere and rather in a more central place.
  public async get_sync_call(
    apiUrl: string,
    parameters?: URLSearchParams | null,
  ) {
    this.IsLoading = true;

    var response: any = await DataService.get_sync(apiUrl, parameters);

    this.IsLoading = false;

    return response;
  }
}
