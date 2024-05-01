namespace NTech.Shared.Models.Request
{
    public class ContactRequest
    {
        public required string html_template { get; set; }
        public required string email_address { get; set; }
        public required string first_name { get; set; }
        public required string last_name { get; set; }
        public required string subject { get; set; }
    }
}
