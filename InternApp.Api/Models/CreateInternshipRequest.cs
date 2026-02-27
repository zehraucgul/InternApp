using System.ComponentModel.DataAnnotations;

namespace InternApp.Api.Models
{
    public class CreateInternshipRequest
    {
        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(80)]
        public string City { get; set; } = string.Empty;

        public bool IsRemote { get; set; }

        public decimal? Salary { get; set; }

        public DateTime ApplicationDeadline { get; set; }
    }
}
