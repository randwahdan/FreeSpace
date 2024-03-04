
namespace FreeSpace.Web.Models
{
    public class MediaModel
    {
        public Guid PostId { get; set; }
        public string FileName { get; set; }
        public byte[] File { get; set; }
        public string Url { get; set; }
    }
}
