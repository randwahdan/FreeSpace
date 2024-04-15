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
            migrationBuilder.AddColumn<string>(
                name: "FileType",
                table: "Media",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MediaType",
                table: "Media",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileType",
                table: "Media");

            migrationBuilder.DropColumn(
                name: "MediaType",
                table: "Media");
        }
    }
}
