using NTech.Shared.Models;
using NTech.Shared.Services;

namespace NTech.Shared.Repository
{
    public class ContactRepository : BaseRepository
    {
        public async Task Initialize()
        {
            var message = new MessageLogModel
            {
                HtmlTemplate = "template?name=thank_you",
                Subject = "Contact form submission - Portfolio",
                ToField = "njmcloud@gmail.com",
                FromName = $"NJMTECH NoReply"
            };

            message.Body = await EmailTemplateService.GetTemplate(message, TemplateURI!);

            model = new
            {
                action_result = message.Body,
            };
        }
    }
}
