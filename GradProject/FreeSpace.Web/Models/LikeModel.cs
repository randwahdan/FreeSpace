
namespace FreeSpace.Web.Models
{
    public class LikeModel
    {
        public Guid? UserId { get; set; }
        public Guid PostId { get; set; }
        public string? FullName { get; set; }

    }
}
