using InternApp.Api.Data;
using InternApp.Api.Entities;
using InternApp.Api.Models;
using Microsoft.EntityFrameworkCore;
using InternApp.Api.DTOs;

namespace InternApp.Api.Services
{
    public class CompanyService
    {
        private readonly AppDbContext _context;

        public CompanyService(AppDbContext context)
        {
            _context = context;
        }

        // ================= CREATE COMPANY =================
        public async Task<Company> CreateCompanyAsync(int userId, CreateCompanyRequest request)
        {
            var existingCompany = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (existingCompany != null)
                throw new Exception("Bu kullanıcı zaten bir şirkete sahip.");

            var company = new Company
            {
                Name = request.Name,
                Description = request.Description,
                Website = request.Website,
                Location = request.Location,
                UserId = userId
            };

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            return company;
        }

        // ================= UPDATE COMPANY =================
        public async Task<Company?> UpdateCompanyAsync(int userId, UpdateCompanyRequest request)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                return null;

            company.Name = request.Name;
            company.Description = request.Description;
            company.Website = request.Website;
            company.Location = request.Location;

            await _context.SaveChangesAsync();

            return company;
        }

        // ================= GET MY COMPANY =================
        public async Task<Company?> GetMyCompanyAsync(int userId)
        {
            return await _context.Companies
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        // ================= COMPANY APPLICATIONS =================
        public async Task<List<CompanyApplicationDto>> GetCompanyApplicationsAsync(int userId)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                throw new Exception("Bu kullanıcıya ait şirket bulunamadı.");

            var applications = await _context.Applications
                .Include(a => a.User)
                .Include(a => a.Internship)
                .Where(a => a.Internship.CompanyId == company.Id)
                .Select(a => new CompanyApplicationDto
                {
                    ApplicationId = a.Id,
                    StudentUserId = a.UserId,
                    StudentName = a.User.FullName,
                    StudentEmail = a.User.Email,
                    InternshipTitle = a.Internship.Title,
                    AppliedDate = a.AppliedDate,
                    Status = a.Status.ToString()
                })
                .ToListAsync();

            return applications;
        }

        // ================= APPLICATION DETAIL =================
        public async Task<StudentApplicationDetailDto?> GetApplicationDetailAsync(int companyOwnerUserId, int applicationId)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == companyOwnerUserId);

            if (company == null)
                return null;

            var application = await _context.Applications
                .Include(a => a.User)
                    .ThenInclude(u => u.Profile)
                .Include(a => a.Internship)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null)
                return null;

            if (application.Internship.CompanyId != company.Id)
                return null;

            var profile = application.User.Profile;

            return new StudentApplicationDetailDto
            {
                StudentUserId = application.User.Id,
                FullName = application.User.FullName,
                Email = application.User.Email,
                University = profile?.University,
                Department = profile?.Department,
                ClassYear = profile?.ClassYear,
                Skills = profile?.Skills,
                Bio = profile?.Bio,
                LinkedInUrl = profile?.LinkedInUrl,
                GithubUrl = profile?.GithubUrl,
                CvUrl = profile?.CvUrl,
                InternshipTitle = application.Internship.Title,
                AppliedDate = application.AppliedDate,
                Status = application.Status.ToString()
            };
        }

        // ================= DASHBOARD =================
        public async Task<object> GetDashboardDataAsync(int userId)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                throw new Exception("Şirket bulunamadı.");

            var internships = await _context.Internships
                .Where(i => i.CompanyId == company.Id)
                .Select(i => i.Id)
                .ToListAsync();

            var applications = await _context.Applications
                .Where(a => internships.Contains(a.InternshipId))
                .Include(a => a.User)
                .Include(a => a.Internship)
                .ToListAsync();

            return new
            {
                TotalInternships = internships.Count,
                TotalApplications = applications.Count,
                Pending = applications.Count(a => a.Status == ApplicationStatus.Pending),
                Accepted = applications.Count(a => a.Status == ApplicationStatus.Accepted),
                Rejected = applications.Count(a => a.Status == ApplicationStatus.Rejected),

                RecentApplications = applications
                    .OrderByDescending(a => a.AppliedDate)
                    .Take(5)
                    .Select(a => new
                    {
                        a.Id,
                        StudentName = a.User.FullName,
                        InternshipTitle = a.Internship.Title,
                        a.Status,
                        a.AppliedDate
                    })
            };
        }
        // =============================
        // Şirketin kendi ilanlarını getir
        // =============================
        public async Task<List<Internship>> GetMyInternshipsAsync(int userId)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                throw new Exception("Şirket bulunamadı.");

            return await _context.Internships
                .AsNoTracking()
                .Where(i => i.CompanyId == company.Id)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }
    }
}