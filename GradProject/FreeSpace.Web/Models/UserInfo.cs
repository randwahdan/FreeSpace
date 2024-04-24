

using FreeSpace.Web.Enums;

namespace FreeSpace.Web.Models
{
    public class UserInfoModel
    {
        public Guid Id { get; set; } 
        public string Email { get; set; } 
        public string? FullName
        {
            get
            {
                return $"{FirstName} {LastName}";
            }
        } 
        public string FirstName { get; set; } 
        public string LastName { get; set; }
        public string NickName { get; set; }

        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string? Bio { get; set; }
        public int? MobileNumber { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }

        public string Role { get; set; } 
        public string Token { get; set; } 
        public  string ProfilePicture { get; set; }
        public string CoverPicture { get; set; }
        public int MutualFriendsCount { get; set; }
        public bool IsAdded { get; set; } // Add the IsAdded property to indicate if user is added by current user

        public bool IsFriend { get; set; } // Add the IsAdded property to indicate if user is added by current user


    }
}
