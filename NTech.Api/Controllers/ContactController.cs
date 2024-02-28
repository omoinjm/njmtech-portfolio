using Microsoft.AspNetCore.Mvc;
using NTech.Shared.Repository;

namespace NTech.Api.Controllers
{
    public class ContactController : BaseController
    {
        [HttpGet]
        [Route("GetContactTemplate")]
        public async Task<IActionResult> Get()
        {
            var vm = this.InitialiseViewModel<ContactRepository>();

            try
            {
                await vm.Initialize();

                return new OkObjectResult(vm.ReturnSuccessModel());
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(vm.ReturnExceptionModel(ex));
            }
        }
    }
}
