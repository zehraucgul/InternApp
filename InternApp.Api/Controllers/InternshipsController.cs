using InternApp.Api.Models;
using InternApp.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InternApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InternshipsController : ControllerBase
    {
        private readonly InternshipService _service;

        public InternshipsController(InternshipService service)
        {
            _service = service;
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim == null ? null : int.Parse(claim.Value);
        }

        // ================= CREATE INTERNSHIP =================
        [Authorize(Roles = "Company")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateInternshipRequest request)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            try
            {
                var internship = await _service.CreateInternshipAsync(userId.Value, request);
                return Ok(internship);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ================= GET ALL =================
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var internships = await _service.GetAllInternshipsAsync();
            return Ok(internships);
        }

        // ================= GET BY ID =================
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var internship = await _service.GetInternshipByIdAsync(id);

            if (internship == null)
                return NotFound(new { message = "İlan bulunamadı." });

            return Ok(internship);
        }

        // ================= COMPANY INTERNSHIPS =================
        [Authorize(Roles = "Company")]
        [HttpGet("company")]
        public async Task<IActionResult> GetCompanyInternships()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            try
            {
                var internships = await _service.GetCompanyInternshipsAsync(userId.Value);
                return Ok(internships);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}