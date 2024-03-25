using Microsoft.AspNetCore.Http;

namespace FreeSpace.Web.Models
{
    public class EventModel
    {
        public Guid UserId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Category { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Link { get; set; }
        public IFormFile File { get; set; }
    }
}
