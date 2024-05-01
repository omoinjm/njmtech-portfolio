import ConfigService from "../apiconnector/config.service";
import DataService from "../apiconnector/data.service";
import IConfig from "../core/config";
import ResponseModel from "../models/response_model";

export class BaseComponent {
  public IsLoading: boolean = false;
  public response_model: ResponseModel = new ResponseModel();
  public config: IConfig = new ConfigService();

  constructor() {
    //Used to show and hide toast or popups after an http call is made. Subscribes to the data service which emits the response.
    // DataService.ResponseEmitter.on("PING", (response: ResponseModel) => {
    //   this.handle_response(response);
    // });
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

  //This uses the responses received by the data service http calls and decides what to do with it.
  public handle_response(response: ResponseModel) {
    if (response.is_error && response.show_error) {
      this.handle_dialogs(response);
    } else if (response.is_exception && response.show_exception) {
      // Only want popups for exception errors.
      // response.ErrorDisplay = EnumValidationDisplay.Popup;
      this.handle_dialogs(response);
    } else if (response.is_error == false && response.show_success == true) {
      // toast.success(response.success_message);
    }
  }

  //Handle the toastr or popup dialogs based off the response model.
  private handle_dialogs(response: ResponseModel) {
    console.log(response);
    // if (response.ErrorDisplay == EnumValidationDisplay.Popup) {
    //   const modalRef = this.ngbModalService.open(ValidationPopupComponent, {
    //     backdrop: "static",
    //     size: "lg",
    //     keyboard: false,
    //     centered: true,
    //   });
    //   modalRef.componentInstance.ListString = response.ErrorList;
    //   modalRef.componentInstance.Title = response.ErrorTitle;
    // } else if (response.ErrorDisplay == EnumValidationDisplay.Toastr) {
    //   var toastr = this.toastr;
    //   response.ErrorList.forEach(function (a) {
    //     toastr.error(a);
    //   });
    // }
  }
}
