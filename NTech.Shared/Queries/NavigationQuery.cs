using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NTech.Shared.Queries
{
    public class NavigationQuery
    {
        public NavigationQuery() { }


        public string NavigationMenuQuery()
        {
            return @$"
                select 
                    m.id,
                    m.name,
                    m.icon,
                    m.route_url
                from nav_menu m
                where m.is_active = true
                order by m.sort_order desc;
            ";
        }

        public string NavigationFooterQuery()
        {
            return @$"
                select 
                    f.id,
                    f.name,
                    f.icon,
                    f.route_url
                from nav_footer f
                where f.is_active = true
                order by f.sort_order desc;
            ";
        }
    }
}
