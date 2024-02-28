using Newtonsoft.Json;
using NTech.Shared.Core;
using NTech.Shared.Database;
using NTech.Shared.Models;

namespace NTech.Shared.Repository
{
    public class BaseRepository
    {
        protected IPgSelector? Selector { get; set; }
        protected string? TemplateURI;

        public object? model { get; set; }

        public void SetupConnectors(IConfig config) { 
            Selector = new PgSelector(config.PgConnectionString());
            TemplateURI = config.EmailTemplateUri();
        }

        // <summary>
        /// Return a success response.
        /// </summary>
        /// <param name="model">Repository that you are working with, needs to inherit from BaseRepository</param>
        /// <param name="showSuccess">Show the success message, defaults to false. If you would like it to display then just set to true</param>
        /// <param name="successMessage">String that has the success message in it. Defaults to Success but you can change it to what you want.</param>
        /// <param name="showError">If you would not like the error displayed, set this to false. Defaults to true but if you would like your own logic applied default to false.</param>
        /// <returns></returns>
        public ResponseModel ReturnSuccessModel(
            bool showSuccess = false,
            string successMessage = "Success",
            bool showError = true)
        {
            return new ResponseModel()
            {
                model = model,
                show_success = showSuccess,
                success_message = successMessage,
                show_error = showError
            };
        }

        // <summary>
        /// Returns if there is an exception
        /// </summary>
        /// <param name="ex">The exception coming through</param>
        /// <param name="errorDisplay">Enum that shows the way you would like to display the error (EnumValidationDisplay.Toastr or EnumValidationDisplay.Popup) - Defaults to popup</param>
        /// <param name="showException">If you would like the exception displayed, defaults to true but if you would like your own logic applied set to false.</param>
        /// <returns></returns>
        public ResponseModel ReturnExceptionModel(
            Exception ex,
            bool showException = true)
        {
            var serializedModel = JsonConvert.SerializeObject(new object());
            return new ResponseModel()
            {
                model = serializedModel,
                is_error = true,
                error_list = [ex.Message],
                show_error = showException
            };
        }
    }
}
