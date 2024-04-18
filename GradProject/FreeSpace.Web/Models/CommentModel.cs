
namespace FreeSpace.Web.Models
{
    public class CommentModel
    {
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public Guid CommentId { get; set; }

        public string Content { get; set; }
        public string? FullName { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public List<CommentLikeModel>? CommentLikes { get; set; }

        public bool? IsLiked { get; set; }
        public int? LikesCount { get; set; }


    }
}
