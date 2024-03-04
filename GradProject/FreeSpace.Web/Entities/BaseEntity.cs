
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace FreeSpace.Web.Entities
{
    public abstract class BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public DateTimeOffset CreatedDate { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTimeOffset LastModifiedDate { get; set; }

        public Guid? LastModifiedBy { get; set; }
    }
}
