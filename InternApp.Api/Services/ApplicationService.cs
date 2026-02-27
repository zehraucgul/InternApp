using InternApp.Api.Data;
using InternApp.Api.DTOs;
using InternApp.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace InternApp.Api.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly AppDbContext _context;

        public ApplicationService(AppDbContext context)
        {
            _context = context;
        }

        // ==============================
        // Öğrenci kendi başvurularını görür
        // ==============================
        public async Task<List<MyApplicationDto>> GetMyApplicationsAsync(int userId)
        {
            return await _context.Applications
                .AsNoTracking()
                .Where(a => a.UserId == userId)
                .Include(a => a.Internship)
                    .ThenInclude(i => i.Company)
                .Select(a => new MyApplicationDto
                {
                    ApplicationId = a.Id,
                    InternshipId = a.InternshipId,
                    CompanyName = a.Internship.Company.Name,
                    InternshipTitle = a.Internship.Title,
                    City = a.Internship.City,
                    AppliedAt = a.AppliedDate,
                    Status = a.Status.ToString()
                })
                .ToListAsync();
        }

        // ==============================
        // Şirket başvuru kabul / red
        // ==============================
        public async Task<bool> UpdateStatusAsync(
            int applicationId,
            int companyOwnerId,
            ApplicationStatus status)
        {
            var application = await _context.Applications
                .Include(a => a.Internship)
                    .ThenInclude(i => i.Company)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null)
                return false;

            if (application.Internship.Company.UserId != companyOwnerId)
                return false;

            application.Status = status;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}