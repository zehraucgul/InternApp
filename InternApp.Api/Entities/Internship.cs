using System.ComponentModel.DataAnnotations;
using InternApp.Api.Entities;

namespace InternApp.Api.Entities
{
    public class Internship
    {
        public int Id { get; set; }

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

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        // 🔥 ARTIK İLAN ŞİRKETE AİT
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        public ICollection<Application> Applications { get; set; }

    }
}
