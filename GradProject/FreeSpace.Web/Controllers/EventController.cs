using FreeSpace.Web.Data;
using FreeSpace.Web.Entities;
using FreeSpace.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        // Deserialize the event model from the request content
        string eventModelContent = Request.Form["eventModel"];
        EventModel model = JsonSerializer.Deserialize<EventModel>(eventModelContent);

        // Get the files from the request
        var files = Request.Form.Files;

        // Check if the event model or file is null
        if (model == null || files == null || files.Count == 0)
        {
            return BadRequest("Event data or file is missing.");
        }

        // Check if the file is attached to the event model
        if (model.File == null || model.File.Length == 0)
        {
            return BadRequest("File is not attached to the event model.");
        }

        // Get the user ID from the authenticated user
        Guid userId = Guid.Parse(User.Identity?.Name);

        // Create a new Event entity and populate its properties
        var newEvent = new Event
        {
            UserId = userId,
            Title = model.Title,
            Description = model.Description,
            StartDate = model.StartDate,
            EndDate = model.EndDate,
            StartTime = model.StartTime,
            EndTime = model.EndTime,
            Country = model.Country,
            City = model.City,
            Category = model.Category,
            Link = model.Link
            // Assign other properties accordingly based on your Event entity
        };

        // Copy the file content to a memory stream
        using (var memoryStream = new MemoryStream())
        {
            model.File.CopyToAsync(memoryStream);
            newEvent.File = memoryStream.ToArray();
        }

        // Add the new event to the database and save changes
        _dbContext.Events.Add(newEvent);
        _dbContext.SaveChanges();

        // Return a successful response
        return Ok("Event created successfully.");
    }

}
