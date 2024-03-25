

namespace FreeSpace.Web.Entities;
 
    public class Event : BaseEntity
    {
        public Guid UserId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Country { get; set; }
        public string City { get; set; }    
        
        public string Category { get; set; }
        public string Link { get; set; }
        public string FileName { get; set; }
        public byte[] File { get; set; }
        public string Url { get; set; }



    #region Releations
    public User User { get; set; }
        public ICollection<EventResponse> EventResponses { get; set; }
        
        #endregion
    }
 
