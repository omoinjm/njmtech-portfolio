import ResponseModel from "../models/response_model";
import ConfigService from "./config.service";
// import eventEmitter from "../hooks/event_emitter";
import IConfig from "../core/config";

export default class DataService {
  private static config: IConfig = new ConfigService();

  private static API_URL: string = this.config.getApiEndpoint() + "api/";

  private static return_response: ResponseModel = new ResponseModel();

  private static HTTP_OPTIONS: any = {
    "Content-Type": "application/json;charset=utf-8",
  };

  // public static ResponseEmitter: any = eventEmitter;

  constructor() {
    console.log(DataService.API_URL);
  }

  //Syncronous get call to which we wait for the call to complete and return a response.
  public static async get_sync(
    action: string,
    parameters?: URLSearchParams | null,
  ) {
    try {
      this.return_response = Object.assign(
        this.return_response,
        await this.get_call(action, parameters),
      );
    } catch (exception: any) {
      this.return_response = await this.handle_exception(
        exception,
        this.return_response,
      );
    }

    //emit an event to be listened to perform a background task
    // this.ResponseEmitter.emit("PING", this.return_response);

    return this.return_response;
  }

  //Syncronous post call to which we wait for the call to complete and return a response
  public static async post_sync(action: string, payload?: object) {
    try {
      this.return_response = Object.assign(
        this.return_response,
        await this.post_call(action, payload),
      );
    } catch (exception) {
      this.return_response = await this.handle_exception(
        exception,
        this.return_response,
      );
    }

    return this.return_response;
  }

  //Handle the exceptions received from the http calls.
  //Add more exception types to this function and it will automatically filter up.
  private static async handle_exception(
    exception: any,
    return_response: ResponseModel,
  ) {
    this.return_response.is_exception = true;

    try {
      if ((exception.name = "HttpErrorResponse")) {
        //BadRequest - so we fetch the returned data from the api that is in the BadRequest Object
        //We dig into the exception and assign it to our response model. Value = the model being returned from C#
        if (exception.status == 400) {
          return_response = Object.assign(return_response, exception.error);
        }
        //Status 0 when can't communicate with the API, we do a PING to the API just to confirm and send back relevent message.
        else if (exception.status == 0) {
          return_response.error_list.push(exception.message);
          return_response.error_list.push(await this.ping_api_message());
        } else {
          return_response.error_list.push("Unknown Http Error");
        }
      }
      //Any other exceptions we just add to the error list
      else {
        return_response.error_list.push(exception.message);
      }
    } catch (error: any) {
      return_response.error_list.push(error.Message);
    }

    return return_response;
  }

  //Check if the API is up with a healthcheck.
  private static async ping_api_message() {
    try {
      await this.get_call("HealthCheck/Ping");
      return "The API is functioning correctly";
    } catch (exception) {
      return "The API is down, a deployment may be in progress";
    }
  }

  //This just builds up the full API path so we don't have to constantly use the base url in everything.
  private static get_full_api_path(action: string) {
    return this.API_URL + action;
  }

  private static async post_call(action: string, payload?: object) {
    return await fetch(this.get_full_api_path(action), {
      method: "POST",
      headers: this.HTTP_OPTIONS,
      body: JSON.stringify(payload),
    });
  }

  private static async get_call(
    action: string,
    parameters?: URLSearchParams | null,
  ) {
    const url = parameters
      ? this.get_full_api_path(action) + "?" + parameters.toString()
      : this.get_full_api_path(action);

    return await fetch(url, {
      method: "GET",
      headers: this.HTTP_OPTIONS,
    }).then((response) => response.json());
  }
}
