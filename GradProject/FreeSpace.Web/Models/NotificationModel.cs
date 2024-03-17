namespace FreeSpace.Web.Models
{
    public class NotificationModel
    {
        public string Content { get; set; }
        public string FullName { get; set; }
        public string ProfilePicture { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
    }
}
