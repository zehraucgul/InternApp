using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternApp.Api.Entities
{
    public class Profile
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key
        public int UserId { get; set; }

        public string? University { get; set; }
        public string? Department { get; set; }
        public string? ClassYear { get; set; }

        // YENİ ALANLAR
        public string? Skills { get; set; }
        public string? Bio { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? CvUrl { get; set; }

        // Navigation Property
        public User User { get; set; } = null!;
    }
}
