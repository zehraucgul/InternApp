using InternApp.Api.Data;
using InternApp.Api.Entities;
using InternApp.Api.Interfaces;
using InternApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InternApp.Api.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly PasswordService _passwordService;
        private readonly JwtService _jwtService;

        public UserService(
            AppDbContext context,
            PasswordService passwordService,
            JwtService jwtService)
        {
            _context = context;
            _passwordService = passwordService;
            _jwtService = jwtService;
        }

        // ✅ REGISTER
        public async Task<bool> RegisterAsync(RegisterRequest request)
        {
            var exists = await _context.Users.AnyAsync(x => x.Email == request.Email);
            if (exists) return false;

            var role = string.IsNullOrWhiteSpace(request.Role) ? "User" : request.Role;

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = _passwordService.HashPassword(request.Password),
                Role = role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return true;
        }

        // ✅ LOGIN
        public async Task<string?> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == request.Email);

            if (user == null)
                return null;

            var valid = _passwordService.VerifyPassword(
                request.Password,
                user.PasswordHash
            );

            if (!valid)
                return null;

            // 🔥 DİKKAT: CreateToken kullanıyoruz
            return _jwtService.CreateToken(user);
        }
    }
}
