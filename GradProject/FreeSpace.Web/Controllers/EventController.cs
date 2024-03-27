using FreeSpace.Web.Data;
using FreeSpace.Web.Entities;
using FreeSpace.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
                if (!IsImage(file) && !IsVideo(file))
                {
                    // Return BadRequest with an error message
                    return BadRequest("Uploaded file is neither an image nor a video.");
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
                    else if (IsVideo(file))
                    {
                        // Generate file path for video
                        var videoFilePath = GenerateVideoPath(file);
                        // Create media model for video
                        mediaModel.FileName = file.FileName;
                        mediaModel.Url = videoFilePath; // Store the file path where the video is saved
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
    private bool IsVideo(IFormFile file)
    {
        string[] videoMimeTypes = { "video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv" };
        return videoMimeTypes.Contains(file.ContentType.ToLower());
    }

    private string GenerateVideoPath(IFormFile videoFile)
    {
        string videoDirectory = @"C:\Users\rand_\OneDrive\Desktop\FreeSpace\FreeSpace\GradProject\FreeSpace.Web\Videos\"; // Path to directory where videos will be saved
        string fileName = $"{Guid.NewGuid().ToString()}{Path.GetExtension(videoFile.FileName)}"; // Generate unique file name
        string filePath = Path.Combine(videoDirectory, fileName);

        // Ensure the directory exists or create it if it doesn't
        if (!Directory.Exists(videoDirectory))
        {
            Directory.CreateDirectory(videoDirectory);
        }

        // Copy the video file to the specified location
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            videoFile.CopyTo(stream);
        }

        return filePath; // Return the file path where the video is saved
    }
}
   
