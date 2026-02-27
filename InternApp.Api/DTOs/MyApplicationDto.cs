namespace InternApp.Api.DTOs
{
    public class MyApplicationDto
    {
        // Başvurunun kendi ID'si (gerekirse silme/güncelleme için)
        public int ApplicationId { get; set; }

        // Duplicate kontrol için ZORUNLU
        public int InternshipId { get; set; }

        public string CompanyName { get; set; } = string.Empty;

        public string InternshipTitle { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public DateTime AppliedAt { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}