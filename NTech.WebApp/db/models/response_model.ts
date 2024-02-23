export class ResponseModel {
  public model: any = Object.assign(new Object());
  public error_list: Array<string> = new Array<string>();
  public show_error: boolean | null = true;
  public is_error: boolean | null = false;
  public error_title: string | null = "";
  public show_success: boolean | null = true;
  public success_message: string | null = "";
  public is_exception: boolean | null = false;
  public show_exception: boolean | null = true;
}
