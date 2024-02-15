using Microsoft.AspNetCore.Mvc;
using NTech.Api.Core;
using NTech.Shared.Core;
using NTech.Shared.Repository;

namespace NTech.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private readonly IConfig _config;

        public BaseController() 
        {
            _config = new ConfigService();
        }

        /// <summary>
        /// Initialise view model. Needs to be a model that is _BaseViewModel
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public T InitialiseViewModel<T>() where T : BaseRepository, new()
        {
            T viewModel = new();
            viewModel.SetupConnectors(_config);

            return viewModel;
        }
    }
}
