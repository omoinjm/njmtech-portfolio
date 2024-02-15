using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NTech.Shared.Models
{
    public class NavigationModel
    {
        public int id {  get; set; }
        public string? name { get; set; }
        public string? icon { get; set; }
        public string? route_url { get; set; }
        public bool is_active { get; set; }
        public int sort_order { get; set; }
    }
}
