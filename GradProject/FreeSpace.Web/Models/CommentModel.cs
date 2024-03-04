
namespace FreeSpace.Web.Models
{
    public class CommentModel
    {
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public string Content { get; set; }
        public string? FullName { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }



    }
}
