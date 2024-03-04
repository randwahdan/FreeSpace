
namespace FreeSpace.Web.Models
{
    public class ChangePassword
    {
        public Guid? UserId { get; set; }   
        public string oldPassword { get; set; } 
        public string newPassword { get; set; } 
        public string confirmPassword { get; set; } 

    }
}
