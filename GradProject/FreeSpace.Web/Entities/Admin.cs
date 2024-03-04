


namespace FreeSpace.Web.Entities;

public class Admin : BaseEntity
{
    public Guid UserId { get; set; }
    public string Email { get; set; }
    public string Password { get; set; } = "";

    public User User { get; set; }
}
