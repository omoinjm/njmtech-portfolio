using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NTech.Shared.Core
{
    public interface IPgSelector
    {
        List<T> Select<T>(string query, object? parameters = null);
    }
}
