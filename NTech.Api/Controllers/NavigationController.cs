using Microsoft.AspNetCore.Mvc;
using NTech.Shared.Repository;

namespace NTech.Api.Controllers
{
    public class NavigationController : BaseController
    {
        [HttpGet]
        [Route("GetNavigation")]
        public IActionResult Get()
        {
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
