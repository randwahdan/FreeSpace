 

namespace FreeSpace.Web.Entities;
 
    public class Like: BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid PostId { get;  set; }


        #region Relations
        public User User { get; set; }
        public Post Post { get; set; }

        #endregion
    }
 
