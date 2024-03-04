namespace FreeSpace.Web.Models
{
    public class FriendRequestModel
    {
        public Guid? UserTargetId { get; set; }
        public Guid? UserSourceId { get; set; }
        public string Status { get; set; }
    }
}
