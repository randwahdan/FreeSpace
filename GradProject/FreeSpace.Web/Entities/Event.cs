

namespace FreeSpace.Web.Entities;
 
    public class Event : BaseEntity
    {
        public Guid UserId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Place { get; set; }
        public string Category { get; set; }



        #region Releations
        public User User { get; set; }
        public ICollection<EventResponse> EventResponses { get; set; }
        
        #endregion
    }
 
