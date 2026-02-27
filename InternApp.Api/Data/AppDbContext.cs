using InternApp.Api.Entities;
using Microsoft.EntityFrameworkCore;


namespace InternApp.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // ================= TABLES =================
        public DbSet<User> Users => Set<User>();
        public DbSet<Profile> Profiles => Set<Profile>();
        public DbSet<Company> Companies => Set<Company>();
        public DbSet<Internship> Internships => Set<Internship>();


        // ================= RELATIONSHIPS =================
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // -------- User - Profile (1-1) --------
            modelBuilder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<Profile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            // -------- User - Company (1-1) --------
            // Bir kullanıcının sadece 1 şirketi olabilir
            modelBuilder.Entity<User>()
                .HasOne(u => u.Company)
                .WithOne(c => c.User)
                .HasForeignKey<Company>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            // -------- Company - Internship (1-N) --------
            // İlanı şirket açar
            modelBuilder.Entity<Internship>()
                .HasOne(i => i.Company)
                .WithMany(c => c.Internships)
                .HasForeignKey(i => i.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);


            // Salary precision
            modelBuilder.Entity<Internship>()
                .Property(i => i.Salary)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.User)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.Internship)
                .WithMany(i => i.Applications)
                .HasForeignKey(a => a.InternshipId)
                .OnDelete(DeleteBehavior.Cascade);

        }

        public DbSet<Application> Applications { get; set; }
        

    }
}
