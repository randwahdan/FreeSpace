using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreeSpace.Web.Migrations
{
    /// <inheritdoc />
    public partial class editMedia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsVideo",
                table: "Media",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVideo",
                table: "Media");
        }
    }
}
