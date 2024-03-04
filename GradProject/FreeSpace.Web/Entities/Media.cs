 

namespace FreeSpace.Web.Entities;
 
    public class Media: BaseEntity
    {
        public Guid PostId { get; set; }
        public string FileName { get; set; }
        public byte[] File { get; set; }
        public string Url { get; set; }
        // This property stores the MIME type of the media file (e.g., "image/jpeg" or "video/mp4").

        // This property stores the size of the media file in bytes.

        // This property stores the duration of a video file in seconds (applies to video media only).

        // This property stores the width of an image or video in pixels.

        // This property stores the height of an image or video in pixels.

        #region Releations

        public Post Post { get; set; }

        #endregion
    }
 
