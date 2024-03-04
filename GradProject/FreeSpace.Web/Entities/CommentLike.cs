

namespace FreeSpace.Web.Entities;
 
    public class CommentLike: BaseEntity
    {
        public Guid CommentId { get; set; }
        public Guid UserId { get; set; }

       
        #region Releations
        public User User { get; set; }
        public Comment Comment { get; set; }

        #endregion
    }
 
