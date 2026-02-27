namespace InternApp.Api.DTOs
{
    public class CompanyApplicationDto
    {
        public int ApplicationId { get; set; }

        // ⭐ EN KRİTİK EKLEME
        public int StudentUserId { get; set; }

        public string StudentName { get; set; }
        public string StudentEmail { get; set; }
        public string InternshipTitle { get; set; }
        public DateTime AppliedDate { get; set; }

        // bonus: şirket başvurunun durumunu da görsün
        public string Status { get; set; }
    }
}
