

using FreeSpace.Web.Enums;

namespace FreeSpace.Web.Entities;
 
    public class Media: BaseEntity
    {
        public Guid PostId { get; set; }
        public string FileName { get; set; }
        public byte[] File { get; set; }
        public string Url { get; set; }
        public bool IsVideo { get; set; }  // New property to indicate if the media is a video
        public string FileType { get; set; }
        public MediaType MediaType { get; set; }

    #region Releations

    public Post Post { get; set; }

        #endregion
    }
 
