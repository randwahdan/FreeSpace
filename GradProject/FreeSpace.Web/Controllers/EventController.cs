using FreeSpace.Web.Data;
using FreeSpace.Web.Entities;
using FreeSpace.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.ComponentModel;
using System.Text.Json;

namespace FreeSpace.Web.Controllers;
[Route("api/[controller]")]
[Authorize]

public class EventController : Controller
{
    protected readonly ApplicationDbContext _dbContext;

    public EventController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("create-event")]
    public IActionResult Create()
    {
        string eventModelContent = Request.Form["eventModel"];
       
        EventMediasModel model = JsonSerializer.Deserialize<EventMediasModel>(eventModelContent);
        if (string.IsNullOrWhiteSpace(model.title) ||
        string.IsNullOrWhiteSpace(model.description) ||
        string.IsNullOrWhiteSpace(model.country) ||
        string.IsNullOrWhiteSpace(model.city) ||
        string.IsNullOrWhiteSpace(model.category) ||
        model.startDate == default(DateTime) ||
        model.endDate == default(DateTime))
        {
            return BadRequest("Please fill in all required fields.");
        }
        if (model.startDate < DateTime.UtcNow)
        {
            return BadRequest("Event start date must be in the future.");
        }

        // Check if endDate is after startDate
        if (model.endDate <= model.startDate)
        {
            return BadRequest("Event end date must be after start date.");
        }

        var files = Request.Form.Files;

        Guid userId = Guid.Parse(User.Identity?.Name);
        Event newEvent = new Event();
        newEvent.UserId = userId;
        newEvent.Title = model.title;
        newEvent.Description = model.description;
        newEvent.StartDate = model.startDate;
        newEvent.EndDate = model.endDate;
        newEvent.Country = model.country;
        newEvent.City = model.city;
        newEvent.Category = model.category;
        newEvent.Link = model.link;
        newEvent.CreatedDate = DateTime.UtcNow;
        newEvent.CreatedBy = userId;

        if (files != null && files.Count > 0)
        {
            List<EventMedia> mediaList = new List<EventMedia>();
            foreach (var file in files)
            {
                // Check if the uploaded file is an image or video
                if (!IsImage(file) )
                {
                    // Return BadRequest with an error message
                    return BadRequest("Uploaded file is an image");
                }

                using (var memoryStream = new MemoryStream())
                {
                    // Copy the content of the file to the memory stream asynchronously
                    file.CopyToAsync(memoryStream);

                    EventMedia mediaModel = new EventMedia();
                    mediaModel.File = memoryStream.ToArray();
                    mediaModel.FileName = file.FileName;

                    // Set the URL based on the type of media
                    if (IsImage(file))
                    {
                        var base64String = Convert.ToBase64String(memoryStream.ToArray());
                        var dataUrl = $"data:image/jpeg;base64,{base64String}";
                        mediaModel.Url = dataUrl;
                    }
                    
                    mediaList.Add(mediaModel);
                }
            }
            newEvent.Medias = mediaList;
        }

        _dbContext.Events.Add(newEvent);
        User user = _dbContext.Users.FirstOrDefault(u => u.Id == userId);
        if (user != null)
        {
            var users = _dbContext.Users.Where(u => u.Id != userId).ToList();

            foreach (var currentUser in users)
            {
                Notification notification = new Notification();
                var userName = string.Concat(user.FirstName, " ", user.LastName);
                notification.Content = userName + " created a new event";
                notification.FullName = userName;
                notification.UserId = currentUser.Id;
                // Assign the reference ID of the user who created the event
                notification.UserRefrenceId = newEvent.UserId;
                notification.CreatedDate = DateTime.Now;
                _dbContext.Notifications.Add(notification);
            }
            _dbContext.SaveChanges();
        }

        return Ok();
    }

    // Helper method to check if the file is an image
    private bool IsImage(IFormFile file)
    {
        // Check the file's MIME type
        if (file.ContentType.ToLower().StartsWith("image/"))
        {
            return true;
        }

        // Check the file extension
        string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
        string fileExtension = Path.GetExtension(file.FileName).ToLower();
        return allowedExtensions.Contains(fileExtension);
    }

    // Helper method to check if the file is a video
  



    [HttpGet("get-events")]
    public List<EventModel> GetEvents()
    {
        // Get the current user's ID
        Guid userId = Guid.Parse(User.Identity?.Name);

        // Get all users except the current user
        var allUsers = _dbContext.Users.Where(u => u.Id != userId).Select(u => u.Id).ToList();

        var events = _dbContext.Events
        .Where(c => allUsers.Contains(c.UserId)|| c.UserId==userId)
        .Include(e => e.EventResponses).OrderByDescending(c => c.CreatedDate)
        .Include(e=>e.Medias).OrderByDescending(c => c.CreatedDate)
        .ToList().OrderByDescending(c => c.CreatedDate);

        List<EventModel> eventListResult = new List<EventModel>();
        foreach (var eventEntity in events)
        {
           EventModel eventModel = new EventModel();
           var userEntity = _dbContext.Users.Find(eventEntity.UserId);
           eventModel.FullName=userEntity.FirstName+" "+userEntity.LastName;
           eventModel.CreatedDate = eventEntity.CreatedDate;
           eventModel.Title = eventEntity.Title;
           eventModel.Description = eventEntity.Description;
           eventModel.Country = eventEntity.Country;
           eventModel.City = eventEntity.City;
           eventModel.StartDate = eventEntity.StartDate;
           eventModel.EndDate = eventEntity.EndDate;
           eventModel.Link = eventEntity.Link;
           eventModel.Category = eventEntity.Category;
           eventModel.EventId = eventEntity.Id;

           if (userEntity.ProfilePicture != null)
            {
                //convert pfp from Byte[] to dataUrl
                var base64String = Convert.ToBase64String(userEntity.ProfilePicture);
                var dataUrl = $"data:image/jpeg;base64,{base64String}";
                eventModel.ProfilePicture = dataUrl;
            }

            if (eventEntity.Medias != null)
            {
                List<EventMediaModel> mediaList = new List<EventMediaModel>();
                foreach (var eventMedia in eventEntity.Medias)
                {
                    EventMediaModel mediaModel = new EventMediaModel();
                    mediaModel.FileName = eventMedia.FileName;
                    mediaModel.Url = eventMedia.Url; // Assuming this is an image URL
                    mediaList.Add(mediaModel);
                }
                eventModel.Media = mediaList;
            }
            if (eventEntity.EventResponses != null)
            {
                eventModel.AttendanceNumber = eventEntity.EventResponses.Count;
                EventResponse eventResponse = eventEntity.EventResponses.FirstOrDefault(c => c.UserId == userId);
                if (eventResponse != null)
                {
                    eventModel.IsAttend = true;
                }
            }
            eventListResult.Add(eventModel);
        }
        return eventListResult;

    }



    [HttpGet("event-details/{eventId}")]
    public IActionResult GetEventDetails(Guid eventId)
    {
        // Get the current user's ID
        Guid userId;
        if (User.Identity.IsAuthenticated)
        {
            userId = Guid.Parse(User.Identity.Name);
        }
        else
        {
            // Handle the case where the user is not authenticated
            // You may want to return an unauthorized response or handle it according to your application's requirements
            return Unauthorized();
        }

        // Retrieve the event entity including its event responses and media
        var eventEntity = _dbContext.Events
            .Include(e => e.EventResponses)
            .Include(e => e.Medias)
            .FirstOrDefault(e => e.Id == eventId);

        if (eventEntity == null)
        {
            return NotFound(); // Event not found
        }

        // Create an event model object to hold event details
        EventModel eventModel = new EventModel();
        var userEntity = _dbContext.Users.Find(eventEntity.UserId);
        eventModel.FullName = userEntity.FirstName + " " + userEntity.LastName;
        eventModel.CreatedDate = eventEntity.CreatedDate;
        eventModel.Title = eventEntity.Title;
        eventModel.Description = eventEntity.Description;
        eventModel.Country = eventEntity.Country;
        eventModel.City = eventEntity.City;
        eventModel.StartDate = eventEntity.StartDate;
        eventModel.EndDate = eventEntity.EndDate;
        eventModel.Link = eventEntity.Link;
        eventModel.Category = eventEntity.Category;
        eventModel.EventId = eventEntity.Id;

        if (userEntity.ProfilePicture != null)
        {
            // Convert profile picture from Byte[] to dataUrl
            var base64String = Convert.ToBase64String(userEntity.ProfilePicture);
            var dataUrl = $"data:image/jpeg;base64,{base64String}";
            eventModel.ProfilePicture = dataUrl;
        }

        if (eventEntity.Medias != null)
        {
            // Convert event media entities to EventMediaModel objects
            List<EventMediaModel> mediaList = new List<EventMediaModel>();
            foreach (var eventMedia in eventEntity.Medias)
            {
                EventMediaModel mediaModel = new EventMediaModel();
                mediaModel.FileName = eventMedia.FileName;
                mediaModel.Url = eventMedia.Url; // Assuming this is an image URL
                mediaList.Add(mediaModel);
            }

            eventModel.Media = mediaList;
        }

        // Check if the current user has responded to the event
        if (eventEntity.EventResponses != null)
        {
            eventModel.AttendanceNumber = eventEntity.EventResponses.Count;

            // Find if the current user has responded to the event
            EventResponse eventResponse = eventEntity.EventResponses.FirstOrDefault(c => c.UserId == userId);
            if (eventResponse != null)
            {
                eventModel.IsAttend = true;
            }

            // Fetch approved friendships involving the current user
            var followers = _dbContext.FriendShips
                .Where(c => (c.SourceId == userId || c.TargetId == userId) && c.Status == "Approved")
                .ToList();

            // Extract the list of friends' IDs
            var sourceList = followers.Select(c => c.SourceId).ToList();
            var targetList = followers.Select(c => c.TargetId).ToList();
            var friendsIds = followers.SelectMany(c => new[] { c.SourceId, c.TargetId }).Where(id => id != userId).ToList();

            // Filter event responses based on common friends
            List<EventResponseModel> attendingUsers = new List<EventResponseModel>();
            foreach (var response in eventEntity.EventResponses)
            {
                // Check if the respondent is a common friend
                if (friendsIds.Contains(response.UserId))
                {
                    EventResponseModel responseModel = new EventResponseModel();
                    var user = _dbContext.Users.Find(response.UserId);

                    responseModel.FullName = user.FirstName + " " + user.LastName;
                    responseModel.UserId = response.UserId;
                    responseModel.EventId = response.EventId;
                    responseModel.CreatedDate = response.CreatedDate;
                    if (user.ProfilePicture != null)
                    {
                        // Convert profile picture from Byte[] to dataUrl
                        var base64String = Convert.ToBase64String(user.ProfilePicture);
                        var dataUrl = $"data:image/jpeg;base64,{base64String}";
                        responseModel.ProfilePicture = dataUrl;
                    }
                    attendingUsers.Add(responseModel);
                }
            }
            eventModel.Responses = attendingUsers;
        }


        return Ok(eventModel);
    }

    [HttpPost("make-response")]
    public bool Response([FromBody] EventResponseModel model)
    {

        Guid userId = Guid.Parse(User.Identity?.Name);
        EventResponse eventResponse = new EventResponse
        {
            UserId = userId,
            EventId = model.EventId
            // Assuming other properties need to be set as well
        };

        _dbContext.EventResponses.Add(eventResponse);
        var user = _dbContext.Users.Find(userId);
        var eventNotify = _dbContext.Events.Find(model.EventId);

        Notification notification = new Notification();
        var userName = string.Concat(user.FirstName, " ", user.LastName);

        notification.Content = userName + " Attends  your event";
        notification.FullName = userName;
        notification.UserId = eventNotify.UserId;
        notification.UserRefrenceId = userId;

        notification.EventId = model.EventId;
        notification.CreatedDate = DateTime.Now;

        _dbContext.Notifications.Add(notification);

        _dbContext.SaveChanges();

        return true;
    }



    [HttpPost("make-disResponse")]
    public bool DisResponse([FromBody] EventResponseModel model)
    {

        Guid userId = Guid.Parse(User.Identity?.Name);
        var eventResponse = _dbContext.EventResponses.FirstOrDefault(c => c.UserId == userId && c.EventId == model.EventId);

        if (eventResponse != null)
        {
            _dbContext.EventResponses.Remove(eventResponse);
            var notification = _dbContext.Notifications.FirstOrDefault(n => n.UserRefrenceId == userId && n.EventId == model.EventId);
            if (notification != null)
            {
                _dbContext.Notifications.Remove(notification);
            }
            _dbContext.SaveChanges();
            return true;
        }

        return true;
    }

}

