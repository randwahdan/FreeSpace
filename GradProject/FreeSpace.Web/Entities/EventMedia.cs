namespace FreeSpace.Web.Entities
{
    public class EventMedia:BaseEntity
    {
        public Guid EventId { get; set; }   
        public string FileName { get; set; }
        public byte[] File { get; set; }
        public string Url { get; set; }
        public bool IsVideo { get; set; }  // New property to indicate if the media is a video


        #region Releations

        public Event Event { get; set; }

        #endregion
    }

}
