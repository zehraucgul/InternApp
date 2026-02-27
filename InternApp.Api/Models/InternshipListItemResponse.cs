namespace InternApp.Api.Models
{
    public class InternshipListItemResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string CompanyName { get; set; } = "";
        public string? City { get; set; }
        public bool IsRemote { get; set; }
        public decimal? Salary { get; set; }
        public DateTime ApplicationDeadline { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
