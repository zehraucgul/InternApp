using InternApp.Api.Interfaces;
using InternApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InternApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // ================= REGISTER =================
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var result = await _userService.RegisterAsync(request);

            if (!result)
                return BadRequest(new { error = "Email zaten kayıtlı." });

            return Ok(new { message = "Kayıt başarılı." });
        }


        // ================= LOGIN =================
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var token = await _userService.LoginAsync(request);

            if (token == null)
                return Unauthorized(new
                {
                    error = "Email veya şifre hatalı"
                });

            return Ok(new
            {
                token = token
            });
        }

        // ================= ME =================
        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                userId,
                email,
                role
            });
        }
    }
}
