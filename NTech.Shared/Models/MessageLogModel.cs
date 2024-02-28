namespace NTech.Shared.Models
{
    public class MessageLogModel
    {
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public string? ToField { get; set; }
        public string? CcField { get; set; }
        public string? BccField { get; set; }
        public string? FromName { get; set; }
        public string? HtmlTemplate { get; set; }
    }
}
