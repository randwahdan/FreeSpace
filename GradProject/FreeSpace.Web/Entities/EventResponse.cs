
namespace FreeSpace.Web.Entities;

public class EventResponse: BaseEntity
{
    public Guid UserId { get; set; }
    public Guid EventId { get; set; }
    
    
    #region Releations
    public User User { get; set; }
    public Event Event { get; set; }

    #endregion
}