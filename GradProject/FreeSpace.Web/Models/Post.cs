
namespace FreeSpace.Web.Models
{
    public class PostModel
    {
        public Guid PostId { get; set; }
        public Guid CommentId { get; set; } 
        public string? Content { get; set; }
        public string? FullName { get; set; }
        public string? ProfilePicture {  get; set; }
        public List<MediaModel>? Media { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }

        public List<LikeModel>? Likes { get; set; }
        public List<CommentModel>? Comments{ get; set; }

        public bool? IsLiked { get; set; }
        public int? LikesCount { get; set; }
        public int? CommentsCount { get; set; }
    }

    public class PostMediaModel
    {
        public string content { get; set; }
    }
}
