export default class DataService {

   private static API_URL: string = `${process.env.NEXT_PUBLIC_SITE_URL}/api/`;

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
         throw error;
      }
   }

   public static async post_call(
      action: string,
      parameters: object | null,
   ) {
      try {
         const response = await fetch(this.get_full_api_path(action), {
            method: "POST",
            headers: this.HTTP_OPTIONS,
            body: JSON.stringify(parameters)
         });

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         return await response.json();
      } catch (error) {
         console.error("Fetch error: ", error);
         throw error;
      }
   }

   //This just builds up the full API path so we don't have to constantly use the base url in everything.
   private static get_full_api_path(action: string) {
      return this.API_URL + action;
   }
}