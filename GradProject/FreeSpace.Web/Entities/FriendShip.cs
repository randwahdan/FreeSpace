 using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace FreeSpace.Web.Entities;
 
    public class FriendShip 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public Guid? SourceId { get; set; }
        public Guid? TargetId { get; set; }
        public string Status { get; set; }


}
 
