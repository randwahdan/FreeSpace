using FreeSpace.Web.Entities;
using Microsoft.EntityFrameworkCore;

namespace FreeSpace.Web.Data
{

    public class ApplicationDbContext : DbContext
    {
        
        // Constructor that accepts DbContextOptions
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
            base(options) //calls the constructor of  (DbContext) 
        { }
        // DbSet properties representing tables in the database
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Media> Media { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<CommentLike> CommentLikes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<FriendShip> FriendShips { get; set; }
        public DbSet<EventMedia>EventMedias { get; set; }   
        

        // Configures the relationships between entities in the database
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
           

            // Define the relationship between Comment and User
            modelBuilder.Entity<Comment>()
               .HasOne(c => c.User)
               .WithMany(u => u.Comments)
               .HasForeignKey(c => c.UserId)
               .OnDelete(DeleteBehavior.Restrict);


            // Define the relationship between Like and User
            modelBuilder.Entity<Like>()
               .HasOne(c => c.User)
               .WithMany(u => u.Likes)
               .HasForeignKey(c => c.UserId)
               .OnDelete(DeleteBehavior.Restrict);


            // Define the relationship between CommentLike and User
            modelBuilder.Entity<CommentLike>()
              .HasOne(c => c.User)
              .WithMany(u => u.CommentLikes)
              .HasForeignKey(c => c.UserId)
              .OnDelete(DeleteBehavior.Restrict);

            // Define the relationship between EventResponse and User
            modelBuilder.Entity<EventResponse>()
                .HasOne(c => c.User)
                .WithMany(u => u.EventResponses)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Define a one-to-one relationship between User and Admin
            modelBuilder.Entity<User>()
                .HasOne(a => a.Admin)
                .WithOne(b => b.User)
                .HasForeignKey<Admin>(b => b.UserId);

        }
    }
 

}
