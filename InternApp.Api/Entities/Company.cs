using System.ComponentModel.DataAnnotations;

namespace InternApp.Api.Entities
{
    public class Company
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(120)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(120)]
        public string? Website { get; set; }

        [MaxLength(120)]
        public string? Location { get; set; }

        // Company sahibi kullanıcı
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Şirketin ilanları
        public ICollection<Internship> Internships { get; set; } = new List<Internship>();
    }
}
