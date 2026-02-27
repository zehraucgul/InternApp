using InternApp.Api.Data;
using InternApp.Api.Entities;
using InternApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InternApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfileController(AppDbContext context)
        {
            _context = context;
        }

        // ================= GET MY PROFILE =================
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();

            var profile = await _context.Profiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
                return NotFound("Profil henüz oluşturulmamış");

            return Ok(profile);
        }

        // ================= CREATE PROFILE =================
        [HttpPost]
        public async Task<IActionResult> CreateProfile([FromBody] CreateProfileRequest request)
        {
            var userId = GetUserId();

            // Kullanıcının zaten profili var mı?
            var existingProfile = await _context.Profiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (existingProfile != null)
                return BadRequest("Bu kullanıcının zaten bir profili var.");

            var profile = new Profile
            {
                UserId = userId,
                University = request.University,
                Department = request.Department,
                ClassYear = request.ClassYear,
                Bio = request.Bio,
                Skills = request.Skills,        // ⭐ düzeltildi
                GithubUrl = request.GithubUrl,
                LinkedInUrl = request.LinkedInUrl,
                CvUrl = request.CvUrl
            };

            _context.Profiles.Add(profile);
            await _context.SaveChangesAsync();

            return Ok(profile);
        }

        // ================= UPDATE PROFILE =================
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] CreateProfileRequest request)
        {
            var userId = GetUserId();

            var profile = await _context.Profiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
                return NotFound("Önce profil oluşturmalısın.");

            profile.University = request.University;
            profile.Department = request.Department;
            profile.ClassYear = request.ClassYear;
            profile.Bio = request.Bio;
            profile.Skills = request.Skills;   // ⭐ düzeltildi
            profile.GithubUrl = request.GithubUrl;
            profile.LinkedInUrl = request.LinkedInUrl;
            profile.CvUrl = request.CvUrl;

            await _context.SaveChangesAsync();

            return Ok(profile);
        }

        // ================= PUBLIC PROFILE =================
        [AllowAnonymous]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetPublicProfile(int userId)
        {
            var profile = await _context.Profiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
                return NotFound("Kullanıcı profili bulunamadı");

            var response = new PublicProfileResponse
            {
                FullName = profile.User.FullName,
                University = profile.University,
                Department = profile.Department,
                ClassYear = profile.ClassYear,
                Bio = profile.Bio,
                GithubUrl = profile.GithubUrl,
                LinkedInUrl = profile.LinkedInUrl,
                CvUrl = profile.CvUrl
            };

            return Ok(response);
        }

        // ================= HELPER =================
        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Token geçersiz");

            return int.Parse(userIdClaim);
        }
    }
}
