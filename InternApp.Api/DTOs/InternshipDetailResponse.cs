namespace InternApp.Api.DTOs
{
    public class InternshipDetailResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CompanyName { get; set; }
        public string City { get; set; }
        public bool IsRemote { get; set; }

        public decimal? Salary { get; set; } // ✅ nullable

        public DateTime? ApplicationDeadline { get; set; } // (DB nullable ise bunu da böyle yap)
        public DateTime CreatedAt { get; set; }
    }
}