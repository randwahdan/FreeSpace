using FreeSpace.Web.Data;
using FreeSpace.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FreeSpace.Web.Controllers;
[Route("api/[controller]")]
[Authorize()]
[ApiController]

public class EventController : Controller
{
    protected readonly ApplicationDbContext _dbContext;

    public EventController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("create-event")]
    public IActionResult Create([FromBody] EventModel model)
    {
        Guid userId = Guid.Parse(User.Identity?.Name);
        var user = _dbContext.Users.Find(userId);
        if (model == null)
        {
            return BadRequest("Event data is null.");
        }

        return Ok("Event created successfully.");

    }
}
