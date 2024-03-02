using NTech.Shared.Models.Response;
using NTech.Shared.Queries;

namespace NTech.Shared.Repository
{
    public class NavigationRepository : BaseRepository
    {
        public void Initialize()
        {
            model = new
            {
                menu_list = Selector?.Select<NavigationResponse>(new NavigationQuery().NavigationMenuQuery()),
                footer_list = Selector?.Select<NavigationResponse>(new NavigationQuery().NavigationFooterQuery())
            };
        }
    }
}
