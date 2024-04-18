namespace FreeSpace.Web.Entities;
 
    public class Post: BaseEntity
    {
        // This property stores the unique identifier of the user who created the post.
        public Guid UserId { get; set; }
        // This property stores the content of the post, such as the text of a social media post or a blog post.
        public string? Content { get; set; }


        #region Relations
        public User User { get; set; }

        public ICollection<Like> Likes { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Media> Medias { get; set; }
        public ICollection<Notification> Notifications { get; set; }
       public object Include(Func<object, object> value)
        {
            throw new NotImplementedException();
        }

        #endregion
    }
 
