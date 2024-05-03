
using FreeSpace.Web.Enums;

namespace FreeSpace.Web.Models
{
    public class RegisterModel
    {
        public string FirstName { get; set; } 
        public string LastName { get; set; } 
        public string Email { get; set; }
        public string Country { get; set; }

        public string Password { get; set; } 
        public DateTime DateOfBirth { get; set;}
        public Gender Gender { get; set; }
    
    }
}
