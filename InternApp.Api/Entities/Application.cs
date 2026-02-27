namespace InternApp.Api.Entities
{
    public class Application
    {
        public int Id { get; set; }

        // Başvuran kullanıcı
        public int UserId { get; set; }
        public User User { get; set; }

        // Başvurulan ilan
        public int InternshipId { get; set; }
        public Internship Internship { get; set; }

        // Başvuru tarihi
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

    }
}
