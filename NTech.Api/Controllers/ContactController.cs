using Microsoft.AspNetCore.Mvc;
using NTech.Shared.Models;
using NTech.Shared.Repository;

namespace NTech.Api.Controllers
{
    public class ContactController : BaseController
    {
        [HttpGet]
        [Route("GetContactTemplate")]
        public async Task<IActionResult> Get([FromQuery] MessageLogModel item)
        {
            var vm = this.InitialiseViewModel<ContactRepository>();

            try
            {
                await vm.Initialize(item);

                return new OkObjectResult(vm.ReturnSuccessModel());
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(vm.ReturnExceptionModel(ex));
            }
        }
    }
}
