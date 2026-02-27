namespace InternApp.Api.Models
{
    public class CreateProfileRequest
    {
        public string University { get; set; } = "";
        public string Department { get; set; } = "";
        public string ClassYear { get; set; } = "";
        public string Skills { get; set; } = "";
        public string? Bio { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? CvUrl { get; set; }
    }
}
