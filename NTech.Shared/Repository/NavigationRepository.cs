using NTech.Shared.Models;
using NTech.Shared.Queries;

namespace NTech.Shared.Repository
{
    public class NavigationRepository : BaseRepository
    {
        public void Initialize()
        {
            model = new
            {
                menu_list = Selector?.Select<NavigationModel>(new NavigationQuery().NavigationMenuQuery()),
                footer_list = Selector?.Select<NavigationModel>(new NavigationQuery().NavigationFooterQuery())
            };
        }
    }
}
