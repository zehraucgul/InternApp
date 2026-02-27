using InternApp.Api.Data;
using InternApp.Api.Entities;
using InternApp.Api.Models;
using Microsoft.EntityFrameworkCore;
using InternApp.Api.DTOs;

namespace InternApp.Api.Services
{
    public class InternshipService
    {
        private readonly AppDbContext _context;

        public InternshipService(AppDbContext context)
        {
            _context = context;
        }

        // ================= CREATE INTERNSHIP =================
        public async Task<Internship> CreateInternshipAsync(int userId, CreateInternshipRequest request)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                throw new Exception("Bu kullanıcıya ait şirket bulunamadı. Önce şirket oluşturmalısınız.");

            var internship = new Internship
            {
                Title = request.Title,
                Description = request.Description,
                City = request.City,
                IsRemote = request.IsRemote,
                Salary = request.Salary,
                ApplicationDeadline = request.ApplicationDeadline,
                CompanyId = company.Id,
                CreatedAt = DateTime.UtcNow
            };

            _context.Internships.Add(internship);
            await _context.SaveChangesAsync();

            return internship;
        }

        // ================= GET ALL INTERNSHIPS =================
        public async Task<List<InternshipListItemResponse>> GetAllInternshipsAsync()
        {
            return await _context.Internships
                .Include(i => i.Company)
                .OrderByDescending(i => i.CreatedAt)
                .Select(i => new InternshipListItemResponse
                {
                    Id = i.Id,
                    Title = i.Title,
                    CompanyName = i.Company.Name,
                    City = i.City,
                    IsRemote = i.IsRemote,
                    Salary = i.Salary,
                    ApplicationDeadline = i.ApplicationDeadline,
                    CreatedAt = i.CreatedAt
                })
                .ToListAsync();
        }

        // ================= GET INTERNSHIP BY ID =================
        public async Task<InternshipDetailResponse?> GetInternshipByIdAsync(int id)
        {
            return await _context.Internships
                .Include(i => i.Company)
                .Where(i => i.Id == id)
                .Select(i => new InternshipDetailResponse
                {
                    Id = i.Id,
                    Title = i.Title,
                    Description = i.Description,
                    CompanyName = i.Company.Name,
                    City = i.City,
                    IsRemote = i.IsRemote,
                    Salary = i.Salary,
                    ApplicationDeadline = i.ApplicationDeadline,
                    CreatedAt = i.CreatedAt
                })
                .FirstOrDefaultAsync();
        }

        // ================= COMPANY INTERNSHIPS =================
        public async Task<List<Internship>> GetCompanyInternshipsAsync(int userId)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                throw new Exception("Şirket bulunamadı.");

            return await _context.Internships
                .Where(i => i.CompanyId == company.Id)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }
    }
}