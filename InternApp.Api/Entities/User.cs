namespace InternApp.Api.Entities
{
    public class User
    {
        public int Id { get; set; }

        // Öğrenci adı soyadı
        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        // User | Company | Admin
        public string Role { get; set; } = "User";

        // Profil bilgileri (öğrenci)
        public Profile? Profile { get; set; }

        // Şirket oluşturursa bağlı olduğu company
        public Company? Company { get; set; }

        // Şirket ilanları (company user ise)
        public ICollection<Internship> Internships { get; set; } = new List<Internship>();

        // ⭐ Başvurular (EN ÖNEMLİSİ)
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
