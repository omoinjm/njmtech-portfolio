using NTech.Shared.Core;

namespace NTech.Api.Core
{
    public class ConfigService : IConfig
    {
        public string PgConnectionString()
        {
            return Environment.GetEnvironmentVariable("PgConnectionString")!;
        }

        public string EmailTemplateUri()
        {
            return Environment.GetEnvironmentVariable("EmailTemplateUri")!;
        }

        public string MongoConnectionString()
        {
            return Environment.GetEnvironmentVariable("MongoConnectionString")!;
        }
    }
}
