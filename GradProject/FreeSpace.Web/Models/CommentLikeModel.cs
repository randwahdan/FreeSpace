
namespace FreeSpace.Web.Models
{
    public class CommentLikeModel
    {
        public Guid? UserId { get; set; }
        public Guid CommentId { get; set; }
        public string? FullName { get; set; }

    }
}
