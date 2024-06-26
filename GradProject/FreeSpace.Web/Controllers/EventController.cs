﻿using FreeSpace.Web.Data;
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
                // Check if the uploaded file is an image
                if (!IsImage(file.FileName))
                {
                    // Return BadRequest with an error message
                    return BadRequest("Uploaded file is not an image (only .jpg, .jpeg, .png, .gif are allowed).");
                }

                using (var memoryStream = new MemoryStream())
                {
                    // Copy the content of the file to the memory stream asynchronously
                    file.CopyToAsync(memoryStream);

                    EventMedia mediaModel = new EventMedia
                    {
                        File = memoryStream.ToArray(),
                        FileName = file.FileName
                    };

                    // Save the file and set the URL based on the type of media
                    var imageFilePath = SaveImageFile(file); // Assuming this method saves the image and returns the file path
                    mediaModel.Url = imageFilePath;

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
    private string SaveImageFile(IFormFile file)
    {
        string imageDirectory = @"C:\Users\rand_\OneDrive\Desktop\FreeSpace\FreeSpace\GradProject\FreeSpace.Web\EventImages\";  // Path to directory where images will be saved
        string fileName = $"{Guid.NewGuid().ToString()}{Path.GetExtension(file.FileName)}"; // Generate unique file name
        string filePath = Path.Combine(imageDirectory, fileName);

        // Ensure the directory exists or create it if it doesn't
        if (!Directory.Exists(imageDirectory))
        {
            Directory.CreateDirectory(imageDirectory);
        }

        // Copy the image file to the specified location
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            file.CopyTo(stream);
        }

        return filePath; // Return the file path where the image is saved
    }




    [HttpGet("get-events")]
    public List<EventModel> GetEvents()
    {
        // Get the current user's ID
        Guid userId = Guid.Parse(User.Identity?.Name);

        // Get all users except the current user
        var allUsers = _dbContext.Users.Where(u => u.Id != userId).Select(u => u.Id).ToList();

        var events = _dbContext.Events
            .Where(c => allUsers.Contains(c.UserId) || c.UserId == userId)
            .Include(e => e.EventResponses)
            .Include(e => e.Medias)
            .OrderByDescending(c => c.CreatedDate)
            .ToList();

        List<EventModel> eventListResult = new List<EventModel>();

        foreach (var eventEntity in events)
        {
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
                List<EventMediaModel> mediaList = new List<EventMediaModel>();

                foreach (var eventMedia in eventEntity.Medias)
                {
                    EventMediaModel mediaModel = new EventMediaModel
                    {
                        FileName = eventMedia.FileName
                    };

                    // Convert image URL to base64 data URL if it's an image
                    if (IsImage(eventMedia.FileName))
                    {
                        byte[] imageData = ReadImageFile(eventMedia.Url);

                        if (imageData != null)
                        {
                            string base64String = Convert.ToBase64String(imageData);
                            string dataUrl = $"data:{GetMimeType(eventMedia.FileName)};base64,{base64String}";
                            mediaModel.Url = dataUrl;
                        }
                    }
                    else
                    {
                        // For non-image media, use the original URL
                        mediaModel.Url = eventMedia.Url;
                    }

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

        // Return the list of event models after processing all events
        return eventListResult;
    }

    private bool IsImage(string fileName)
    {
        string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
        string fileExtension = Path.GetExtension(fileName)?.ToLower();
        return !string.IsNullOrEmpty(fileExtension) && allowedExtensions.Contains(fileExtension);
    }

    private string GetMimeType(string fileName)
        {
            string fileExtension = Path.GetExtension(fileName)?.ToLower();

            switch (fileExtension)
            {
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".png":
                    return "image/png";
                case ".gif":
                    return "image/gif";
                default:
                    return "application/octet-stream"; // Default MIME type if extension is unknown
            }
        }
    private byte[] ReadImageFile(string filePath)
    {
        return System.IO.File.ReadAllBytes(filePath);
    }
    [HttpGet("get-events-by-category")]
    public List<EventModel> GetEvents(string category)
    {
        // Get the current user's ID
        Guid userId = Guid.Parse(User.Identity?.Name);

        // Get all users except the current user
        var allUsers = _dbContext.Users.Where(u => u.Id != userId).Select(u => u.Id).ToList();

        // Query events based on the category parameter
        IQueryable<Event> eventsQuery = _dbContext.Events
            .Where(c => allUsers.Contains(c.UserId) || c.UserId == userId)
            .Include(e => e.EventResponses)
            .Include(e => e.Medias);

        if (!string.IsNullOrEmpty(category) && category != "all")
        {
            eventsQuery = eventsQuery.Where(e => e.Category == category);
        }

        var events = eventsQuery.OrderByDescending(c => c.CreatedDate).ToList();

        // Convert events to EventModel and return
        List<EventModel> eventListResult = new List<EventModel>();
        foreach (var eventEntity in events)
        {
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
                List<EventMediaModel> mediaList = new List<EventMediaModel>();

                foreach (var eventMedia in eventEntity.Medias)
                {
                    EventMediaModel mediaModel = new EventMediaModel
                    {
                        FileName = eventMedia.FileName
                    };

                    // Convert image URL to base64 data URL if it's an image
                    if (IsImage(eventMedia.FileName))
                    {
                        byte[] imageData = ReadImageFile(eventMedia.Url);

                        if (imageData != null)
                        {
                            string base64String = Convert.ToBase64String(imageData);
                            string dataUrl = $"data:{GetMimeType(eventMedia.FileName)};base64,{base64String}";
                            mediaModel.Url = dataUrl;
                        }
                    }
                    else
                    {
                        // For non-image media, use the original URL
                        mediaModel.Url = eventMedia.Url;
                    }

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
    [HttpGet("get-events-by-country")]
    public List<EventModel> GetEventsByCountry(string country)
    {
        // Get the current user's ID
        Guid userId = Guid.Parse(User.Identity?.Name);

        // Get all users except the current user
        var allUsers = _dbContext.Users.Where(u => u.Id != userId).Select(u => u.Id).ToList();

        // Query events based on the country parameter
        IQueryable<Event> eventsQuery = _dbContext.Events
            .Where(c => allUsers.Contains(c.UserId) || c.UserId == userId)
            .Include(e => e.EventResponses)
            .Include(e => e.Medias);

        if (!string.IsNullOrEmpty(country) && country != "all")
        {
            eventsQuery = eventsQuery.Where(e => e.Country == country);
        }

        var events = eventsQuery.OrderByDescending(c => c.CreatedDate).ToList();

        // Convert events to EventModel and return
        List<EventModel> eventListResult = new List<EventModel>();
        foreach (var eventEntity in events)
        {
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
    [HttpGet("get-events-by-category-and-country")]
    public List<EventModel> GetEventsByCategoryAndCountry(string category, string country)
    {
        // Get the current user's ID
        Guid userId = Guid.Parse(User.Identity?.Name);

        // Get all users except the current user
        var allUsers = _dbContext.Users.Where(u => u.Id != userId).Select(u => u.Id).ToList();

        // Query events based on the category and country parameters
        IQueryable<Event> eventsQuery = _dbContext.Events
            .Where(c => allUsers.Contains(c.UserId) || c.UserId == userId)
            .Include(e => e.EventResponses)
            .Include(e => e.Medias);

        if (!string.IsNullOrEmpty(category) && category != "all")
        {
            eventsQuery = eventsQuery.Where(e => e.Category == category);
        }

        if (!string.IsNullOrEmpty(country) && country != "all")
        {
            eventsQuery = eventsQuery.Where(e => e.Country == country);
        }

        var events = eventsQuery.OrderByDescending(c => c.CreatedDate).ToList();

        // Convert events to EventModel and return
        List<EventModel> eventListResult = new List<EventModel>();
        foreach (var eventEntity in events)
        {
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
                List<EventMediaModel> mediaList = new List<EventMediaModel>();

                foreach (var eventMedia in eventEntity.Medias)
                {
                    EventMediaModel mediaModel = new EventMediaModel
                    {
                        FileName = eventMedia.FileName
                    };

                    // Convert image URL to base64 data URL if it's an image
                    if (IsImage(eventMedia.FileName))
                    {
                        byte[] imageData = ReadImageFile(eventMedia.Url);

                        if (imageData != null)
                        {
                            string base64String = Convert.ToBase64String(imageData);
                            string dataUrl = $"data:{GetMimeType(eventMedia.FileName)};base64,{base64String}";
                            mediaModel.Url = dataUrl;
                        }
                    }
                    else
                    {
                        // For non-image media, use the original URL
                        mediaModel.Url = eventMedia.Url;
                    }

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


    [HttpGet("get-archive-events")]
    public List<EventModel> GetArchiveEvents()
    {
        // Get the current user's ID
        Guid userId = Guid.Parse(User.Identity?.Name);

        // Query events for archive for the current user
        var events = _dbContext.Events
            .Include(e => e.User) // Eagerly load the User entity
            .Where(e => e.UserId == userId)
            .Include(e => e.EventResponses)
            .Include(e => e.Medias)
            .Where(e => e.EndDate < DateTime.Now) // Filter events whose end date has passed
            .OrderByDescending(e => e.CreatedDate)
            .ToList();

        // Convert events to EventModel and return
        List<EventModel> eventListResult = new List<EventModel>();
        foreach (var eventEntity in events)
        {
            EventModel eventModel = new EventModel
            {
                FullName = $"{eventEntity.User.FirstName} {eventEntity.User.LastName}",
                CreatedDate = eventEntity.CreatedDate,
                Title = eventEntity.Title,
                Description = eventEntity.Description,
                Country = eventEntity.Country,
                City = eventEntity.City,
                StartDate = eventEntity.StartDate,
                EndDate = eventEntity.EndDate,
                Link = eventEntity.Link,
                Category = eventEntity.Category,
                EventId = eventEntity.Id,
                ProfilePicture = eventEntity.User.ProfilePicture != null ? $"data:image/jpeg;base64,{Convert.ToBase64String(eventEntity.User.ProfilePicture)}" : null,
                Media = eventEntity.Medias?.Select(eventMedia => new EventMediaModel
                {
                    FileName = eventMedia.FileName,
                    Url = IsImage(eventMedia.FileName) ? $"data:{GetMimeType(eventMedia.FileName)};base64,{Convert.ToBase64String(ReadImageFile(eventMedia.Url))}" : eventMedia.Url
                }).ToList(),
                AttendanceNumber = eventEntity.EventResponses?.Count ?? 0,
                IsAttend = eventEntity.EventResponses?.Any(er => er.UserId == userId) ?? false
            };

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
            List<EventMediaModel> mediaList = new List<EventMediaModel>();

            foreach (var eventMedia in eventEntity.Medias)
            {
                EventMediaModel mediaModel = new EventMediaModel
                {
                    FileName = eventMedia.FileName
                };

                // Convert image URL to base64 data URL if it's an image
                if (IsImage(eventMedia.FileName))
                {
                    byte[] imageData = ReadImageFile(eventMedia.Url);

                    if (imageData != null)
                    {
                        string base64String = Convert.ToBase64String(imageData);
                        string dataUrl = $"data:{GetMimeType(eventMedia.FileName)};base64,{base64String}";
                        mediaModel.Url = dataUrl;
                    }
                }
                else
                {
                    // For non-image media, use the original URL
                    mediaModel.Url = eventMedia.Url;
                }

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

