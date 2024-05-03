

using FreeSpace.Web.Enums;

namespace FreeSpace.Web.Entities;
 
    public class User: BaseEntity
    {
      
        public string Email { get; set; } 
        public string Password { get; set; } 
        public string FirstName { get; set; } 
        public string LastName { get; set; }
        public string Country { get; set; }

       public string? NickName { get; set; } 
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string? Bio { get; set; } 
        public int? MobileNumber { get; set; } 

        public string Role { get; set; } 
        public bool IsActive { get; set; } 
        public string? Token { get; set; } 
        public Byte[]? ProfilePicture { get; set; }
        public Byte[]? CoverPicture { get; set; }

        #region Releations
        public ICollection<Post> Posts { get; set; }
        public ICollection<Event> Events { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<CommentLike> CommentLikes { get; set; }
        public ICollection<Like> Likes { get; set; }

        public ICollection<Notification> Notifications { get; set; }

        public ICollection<EventResponse> EventResponses { get; set; }
        public Admin Admin { get; set; }

        #endregion

    }
