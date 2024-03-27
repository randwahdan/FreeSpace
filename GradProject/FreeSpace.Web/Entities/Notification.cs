 

namespace FreeSpace.Web.Entities;
 
    public class Notification : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid? UserRefrenceId { get; set; }
        public string Content { get; set; }
        public string FullName { get; set; }
        public Guid? PostId { get; set; }
     public Guid? EventId { get; set; }



    #region Releations

    public User User { get; set; }
    public Post Post { get; set; }
    public Event Event { get; set; }


    #endregion
}

