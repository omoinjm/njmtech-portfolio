namespace NTech.Shared.Models
{
    public class MessageLogModel
    {
        public required string subject { get; set; }
        public string? body { get; set; }
        public required string to_field { get; set; }
        public string? cc_field { get; set; }
        public string? bcc_field { get; set; }
        public required string from_name { get; set; }
        public required string html_template { get; set; }
    }
}
