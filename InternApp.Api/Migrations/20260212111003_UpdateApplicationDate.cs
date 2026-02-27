using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateApplicationDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AppliedAt",
                table: "Applications",
                newName: "AppliedDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AppliedDate",
                table: "Applications",
                newName: "AppliedAt");
        }
    }
}
