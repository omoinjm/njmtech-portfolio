using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NTech.Shared.Core
{
    public interface IConfig
    {
        string PgConnectionString();
        string MongoConnectionString();
    }
}
