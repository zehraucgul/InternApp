using InternApp.Api.Models;

namespace InternApp.Api.Interfaces
{
    public interface IUserService
    {
        Task<bool> RegisterAsync(RegisterRequest request);
        Task<string?> LoginAsync(LoginRequest request);
    }
}
