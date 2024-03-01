using NTech.Shared.Models;
using System.Net.Http.Headers;

namespace NTech.Shared.Services
{
    public class EmailTemplateService
    {
        public static async Task<string?> GetTemplate(MessageLogModel item, string templateURI)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(templateURI);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await client.GetAsync(item.html_template);
                response.EnsureSuccessStatusCode();

                return await response.Content.ReadAsStringAsync();
            }
        }
    }
}
