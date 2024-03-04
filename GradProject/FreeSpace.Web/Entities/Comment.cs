

namespace FreeSpace.Web.Entities;
 
    public class Comment : BaseEntity
    {
        public Guid UserId { get; set; }
    public Guid PostId { get; set; }
        public string Content { get; set; }


        #region Relations
        public User User { get; set; }
        public Post Post { get; set; }
        public ICollection<CommentLike> CommentLikes { get; set; }

        #endregion
    }
 
