using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using InternApp.Api.Services;
using InternApp.Api.DTOs;
using InternApp.Api.Data;
using InternApp.Api.Entities;

namespace InternApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        private readonly AppDbContext _context;

        public ApplicationsController(
            IApplicationService applicationService,
            AppDbContext context)
        {
            _applicationService = applicationService;
            _context = context;
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
                return null;

            return int.Parse(claim.Value);
        }

        // ===================================================
        // 1️⃣ İLANA BAŞVUR
        // POST: api/applications/{internshipId}
        // ===================================================
        [Authorize(Roles = "User")]
        [HttpPost("{internshipId}")]
        public async Task<IActionResult> Apply(int internshipId)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var internship = await _context.Internships
                .Include(i => i.Company)
                .FirstOrDefaultAsync(i => i.Id == internshipId);

            if (internship == null)
                return NotFound("İlan bulunamadı.");

            if (internship.ApplicationDeadline < DateTime.UtcNow)
                return BadRequest("Başvuru süresi dolmuş.");

            var alreadyApplied = await _context.Applications
                .AnyAsync(a => a.UserId == userId && a.InternshipId == internshipId);

            if (alreadyApplied)
                return BadRequest("Bu ilana zaten başvurdun.");

            var application = new Application
            {
                UserId = userId.Value,
                InternshipId = internshipId,
                AppliedDate = DateTime.UtcNow,
                Status = ApplicationStatus.Pending
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return Ok("Başvuru başarıyla yapıldı.");
        }

        // ===================================================
        // 2️⃣ KENDİ BAŞVURULARIM
        // GET: api/applications/my
        // ===================================================
        [Authorize(Roles = "User")]
        [HttpGet("my")]
        public async Task<IActionResult> MyApplications()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var applications = await _context.Applications
                .Include(a => a.Internship)
                    .ThenInclude(i => i.Company)
                .Where(a => a.UserId == userId)
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

            return Ok(applications);
        }

        // ===================================================
        // 3️⃣ BAŞVURU DURUMU GÜNCELLE (ŞİRKET)
        // PUT: api/applications/{id}/status
        // ===================================================
        [Authorize(Roles = "Company")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            [FromBody] UpdateApplicationStatusDto dto)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            // 🔥 STRING → ENUM PARSE (KRİTİK)
            if (!Enum.TryParse<ApplicationStatus>(dto.Status, true, out var parsedStatus))
                return BadRequest("Geçersiz status değeri.");

            var success = await _applicationService
                .UpdateStatusAsync(id, userId.Value, parsedStatus);

            if (!success)
                return BadRequest("Bu başvuruyu güncelleme yetkin yok.");

            return Ok("Başvuru durumu güncellendi.");
        }
    }
}