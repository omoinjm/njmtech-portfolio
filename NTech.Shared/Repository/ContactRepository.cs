using NTech.Shared.Models;
using NTech.Shared.Services;

namespace NTech.Shared.Repository
{
    public class ContactRepository : BaseRepository
    {
        public async Task Initialize(MessageLogModel item)
        {
            var message = new MessageLogModel
            {
                html_template = item.html_template,
                subject = item.subject,
                to_field = item.to_field,
                from_name = item.from_name
            };

            message.body = await EmailTemplateService.GetTemplate(message, TemplateURI!);

            model = message;
        }
    }
}
