using Microsoft.AspNetCore.Http;
using System.ComponentModel;
using System.Text.Json.Serialization;

namespace FreeSpace.Web.Models
{
    public class EventModel
    {
        public Guid UserId { get; set; }
        public Guid EventId { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Category { get; set; }
        public string Link { get; set; }
        public string? FullName { get; set; }
        public string? ProfilePicture { get; set; }
        public List<EventMediaModel>? Media { get; set; }
        public List<EventResponseModel>? Responses { get; set; }

        public DateTimeOffset? CreatedDate { get; set; }
        public bool? IsAttend { get; set; }
        public int? AttendanceNumber { get; set; }
        public List<UserInfoModel>? AttendingUsers { get; set; }


    }

    public class EventMediasModel
    {
        public  Guid eventId { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        [JsonConverter(typeof(DateTimeOffsetConverterUsingDateTimeParse))]
        public DateTime startDate { get; set; }
        [JsonConverter(typeof(DateTimeOffsetConverterUsingDateTimeParse))]
        public DateTime endDate { get; set; }
        public string country { get; set; }
        public string city { get; set; }
        public string category { get; set; }
        public string link { get; set; }
        
    }
}