using InternApp.Api.DTOs;
using InternApp.Api.Entities;

namespace InternApp.Api.Services
{
    public interface IApplicationService
    {
        // Öğrencinin kendi başvuruları
        Task<List<MyApplicationDto>> GetMyApplicationsAsync(int userId);

        // Şirket başvuru durum güncelleme
        Task<bool> UpdateStatusAsync(
            int applicationId,
            int companyOwnerId,
            ApplicationStatus status
        );
    }
}