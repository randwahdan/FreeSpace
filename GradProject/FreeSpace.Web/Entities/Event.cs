

namespace FreeSpace.Web.Entities;
 
    public class Event : BaseEntity
    {
        public Guid UserId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Country { get; set; }
        public string City { get; set; }    
        public string Category { get; set; }
        public string Link { get; set; }

    #region Releations
    public User User { get; set; }
        public ICollection<EventResponse> EventResponses { get; set; }
        public ICollection<EventMedia> Medias { get; set; }
    public object Include(Func<object, object> value)
    {
        throw new NotImplementedException();
    }

    #endregion
}
 
