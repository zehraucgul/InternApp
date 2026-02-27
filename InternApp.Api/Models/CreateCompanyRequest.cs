using System.ComponentModel.DataAnnotations;

namespace InternApp.Api.Models
{
    public class CreateCompanyRequest
    {
        [Required]
        [MaxLength(120)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(120)]
        public string? Website { get; set; }

        [MaxLength(120)]
        public string? Location { get; set; }
    }
}
