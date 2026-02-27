using InternApp.Api.Models;
using InternApp.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InternApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Company")]
    public class CompanyController : ControllerBase
    {
        private readonly CompanyService _companyService;

        public CompanyController(CompanyService companyService)
        {
            _companyService = companyService;
        }

        // ================= CREATE COMPANY =================
        [HttpPost]
        public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyRequest request)
        {
            var userId = GetUserId();

            var company = await _companyService.CreateCompanyAsync(userId, request);

            return Ok(company);
        }

        // ================= UPDATE COMPANY =================
        [HttpPut]
        public async Task<IActionResult> UpdateCompany([FromBody] UpdateCompanyRequest request)
        {
            var userId = GetUserId();

            var updatedCompany = await _companyService.UpdateCompanyAsync(userId, request);

            if (updatedCompany == null)
                return NotFound("Şirket bulunamadı.");

            return Ok(updatedCompany);
        }

        // ================= GET MY COMPANY =================
        [HttpGet("my")]
        public async Task<IActionResult> GetMyCompany()
        {
            var userId = GetUserId();

            var company = await _companyService.GetMyCompanyAsync(userId);

            if (company == null)
                return NotFound("Şirket bulunamadı.");

            return Ok(company);
        }

        // ================= COMPANY APPLICATIONS =================
        [HttpGet("applications")]
        public async Task<IActionResult> GetCompanyApplications()
        {
            var userId = GetUserId();

            var result = await _companyService.GetCompanyApplicationsAsync(userId);

            return Ok(result);
        }

        // ================= APPLICATION DETAIL =================
        [HttpGet("applications/{applicationId}")]
        public async Task<IActionResult> GetApplicationDetail(int applicationId)
        {
            var userId = GetUserId();

            var result = await _companyService.GetApplicationDetailAsync(userId, applicationId);

            if (result == null)
                return NotFound("Başvuru bulunamadı veya erişim yetkiniz yok.");

            return Ok(result);
        }

        // ================= DASHBOARD =================
        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            var userId = GetUserId();

            var data = await _companyService.GetDashboardDataAsync(userId);

            return Ok(data);
        }

        // ================= MY INTERNSHIPS =================
        // GET: api/company/internships
        [HttpGet("internships")]
        public async Task<IActionResult> GetMyInternships()
        {
            var userId = GetUserId();

            var internships = await _companyService.GetMyInternshipsAsync(userId);

            return Ok(internships);
        }

        // ================= PRIVATE HELPER =================
        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null)
                throw new UnauthorizedAccessException("UserId bulunamadı.");

            return int.Parse(claim.Value);
        }
    }
}