export default class DataService {

   private static API_URL: string = "http://localhost:3000/api/";

   private static HTTP_OPTIONS: any = {
      "Content-Type": "application/json;charset=utf-8",
      "Accept": "application/json"
   };


   public static async get_call(
      action: string,
      parameters?: URLSearchParams | null,
   ) {
      const url = parameters
         ? this.get_full_api_path(action) + "?" + parameters.toString()
         : this.get_full_api_path(action);

      try {
         const response = await fetch(url, {
            method: "GET",
            headers: this.HTTP_OPTIONS,
         });

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         return await response.json();
      } catch (error) {
         console.error("Fetch error: ", error);
         throw error; // Rethrow the error to be handled by the caller
      }
   }

   //This just builds up the full API path so we don't have to constantly use the base url in everything.
   private static get_full_api_path(action: string) {
      return this.API_URL + action;
   }
}