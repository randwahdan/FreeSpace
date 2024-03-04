
namespace FreeSpace.Web.Models
{
    public class SuggestionsUsers
    {
        public Guid Id { get; set; }
        public string? FullName
        {
            get
            {
                return $"{FirstName} {LastName}";
            }
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Byte[] ProfilePicture { get; set; }

    }
}
