using NTech.Shared.Models;
using NTech.Shared.Models.Request;
using NTech.Shared.Models.Response;
using NTech.Shared.Services;

namespace NTech.Shared.Repository
{
    public class ContactRepository : BaseRepository
    {
        public async Task Initialize(ContactRequest request)
        {
            var message = new MessageLogResponse
            {
                subject = request.subject,
                to_field = request.email_address,
                html_template = request.html_template,
                from_name = $"{request.first_name} {request.last_name}"
            };

            message.body = await EmailTemplateService.GetTemplate(message, TemplateURI!);

            model = message;
        }
    }
}
