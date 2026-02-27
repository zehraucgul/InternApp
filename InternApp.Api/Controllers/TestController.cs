using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InternApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("public")]
        public IActionResult Public()
        {
            return Ok("Herkes görebilir");
        }

        [Authorize]
        [HttpGet("private")]
        public IActionResult Private()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            return Ok($"Sadece giriş yapan kullanıcı görebilir. Email: {email}");
        }
    }
}
