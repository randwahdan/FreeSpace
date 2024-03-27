namespace FreeSpace.Web.Models
{
    public class EventMediaModel
    {
        public Guid EventId { get; set; }
        public string FileName { get; set; }
        public byte[] File { get; set; }
        public string Url { get; set; }
        public bool IsVideo { get; set; } // Add a property to indicate if the media is a video
    }
}
