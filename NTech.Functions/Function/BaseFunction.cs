using NTech.Functions.Core;
using NTech.Shared.Core;
using NTech.Shared.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NTech.Functions.Function
{
    public class BaseFunction
    {
        private readonly IConfig _config;

        public BaseFunction() 
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
