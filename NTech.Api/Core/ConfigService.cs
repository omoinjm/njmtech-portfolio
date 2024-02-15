using NTech.Shared.Core;

namespace NTech.Api.Core
{
    public class ConfigService : IConfig
    {
        public string PgConnectionString()
        {
            // Connection string in local.settings.json has a different naming convention than Azure Functions App Service.
            // This is the code that I use to retrieve them both local and in a app service.
            string? conStr = Environment.GetEnvironmentVariable("PgConnectionString");

            // Azure Functions App Service naming convention
            if (string.IsNullOrEmpty(conStr))
                conStr = Environment.GetEnvironmentVariable("POSTGRESQLCONNSTR_PgConnectionString");

            return conStr!;
        }

        public string MongoConnectionString()
        {
            return Environment.GetEnvironmentVariable("MongoConnectionString")!;
        }
    }
}
