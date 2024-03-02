namespace NTech.Shared.Models.Response
{
    public class NavigationResponse
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? icon { get; set; }
        public string? route_url { get; set; }
        public bool is_active { get; set; }
        public int sort_order { get; set; }
    }
}
