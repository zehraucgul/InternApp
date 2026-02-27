namespace InternApp.Api.DTOs
{
    public class StudentApplicationDetailDto
    {
        public int StudentUserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }

        // Profil bilgileri
        public string University { get; set; }
        public string Department { get; set; }
        public string ClassYear { get; set; }
        public string Skills { get; set; }
        public string Bio { get; set; }
        public string LinkedInUrl { get; set; }
        public string GithubUrl { get; set; }
        public string CvUrl { get; set; }

        // Başvuru
        public string InternshipTitle { get; set; }
        public DateTime AppliedDate { get; set; }
        public string Status { get; set; }
    }
}
