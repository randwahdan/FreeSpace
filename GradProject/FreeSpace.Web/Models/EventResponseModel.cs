namespace FreeSpace.Web.Models
{
    public class EventResponseModel
    {
        public Guid UserId { get; set; }
        public Guid EventId { get; set; }
        public string? FullName { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
    }
}
