using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreeSpace.Web.Migrations
{
    /// <inheritdoc />
    public partial class addCommentLikeToPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PostId",
                table: "CommentLikes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CommentLikes_PostId",
                table: "CommentLikes",
                column: "PostId");

            migrationBuilder.AddForeignKey(
                name: "FK_CommentLikes_Posts_PostId",
                table: "CommentLikes",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CommentLikes_Posts_PostId",
                table: "CommentLikes");

            migrationBuilder.DropIndex(
                name: "IX_CommentLikes_PostId",
                table: "CommentLikes");

            migrationBuilder.DropColumn(
                name: "PostId",
                table: "CommentLikes");
        }
    }
}
