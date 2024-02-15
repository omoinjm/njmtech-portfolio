using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using NTech.Shared.Repository;

namespace NTech.Functions.Function
{
    public class HttpGetNavigation : BaseFunction
    {
        private readonly ILogger<HttpGetNavigation> _logger;

        public HttpGetNavigation(ILogger<HttpGetNavigation> logger)
        {
            _logger = logger;
        }

        [Function("HttpGetNavigation")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            var vm = this.InitialiseViewModel<NavigationRepository>();

            try
            {
                vm.Initialize();

                return new OkObjectResult(vm.ReturnSuccessModel());
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(vm.ReturnExceptionModel(ex));
            }
        }
    }
}
