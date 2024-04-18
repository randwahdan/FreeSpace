using FreeSpace.Web.Data;
using FreeSpace.Web.Entities;
using FreeSpace.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using FreeSpace.Web.Enums;
using System.Text.Json;
using Microsoft.Extensions.Hosting;

namespace FreeSpace.Web.Controllers;

[Route("api/[controller]")]
[Authorize()]
[ApiController]
public class PostController : ControllerBase
{
    protected readonly ApplicationDbContext _dbContext;

    public PostController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("get-posts")]
    public List<PostModel> GetPosts()
    {
        Guid userId = Guid.Parse(User.Identity?.Name);

        var followers = _dbContext.FriendShips.Where(c => (c.SourceId == userId || c.TargetId == userId) && c.Status == "Approved").ToList();
        var sourceList = followers.Select(c => c.SourceId).ToList();
        var targetList = followers.Select(c => c.TargetId).ToList();
        var allUsers = targetList.Concat(sourceList);



        var posts = _dbContext.Posts.Where(c => allUsers.Contains(c.UserId) || c.UserId == userId)
             .Include(p => p.Likes)
             .Include(p => p.Comments).OrderBy(c => c.CreatedDate)
             .Include(p => p.Medias).OrderByDescending(c => c.CreatedDate)
             .Include(p => p.Comments) // Include Comments for each Post
             .ThenInclude(c => c.CommentLikes) // Then include CommentLikes for each Comment
             .ToList().OrderByDescending(c => c.CreatedDate);


        List<PostModel> postListResult = new List<PostModel>();

        foreach (var postEntity in posts)
        {
            PostModel postModel = new PostModel();
            var userEntity = _dbContext.Users.Find(postEntity.UserId);
            postModel.FullName = userEntity.FirstName + " " + userEntity.LastName;
            postModel.CreatedDate = postEntity.CreatedDate;
            postModel.Content = postEntity.Content;
            postModel.PostId = postEntity.Id;

            if (userEntity.ProfilePicture != null)
            {
                //convert pfp from Byte[] to dataUrl
                var base64String = Convert.ToBase64String(userEntity.ProfilePicture);
                var dataUrl = $"data:image/jpeg;base64,{base64String}";
                postModel.ProfilePicture = dataUrl;
            }

            if (postEntity.Medias != null && postEntity.Medias.Any())
            {
                List<MediaModel> mediaList = new List<MediaModel>();

                foreach (var postMedia in postEntity.Medias)
                {
                    MediaModel mediaModel = new MediaModel
                    {
                        FileName = postMedia.FileName,
                        IsVideo = postMedia.IsVideo
                    };

                    if (mediaModel.IsVideo)
                    {
                        // For video media, handle URL and data
                        byte[] videoData = ReadVideoFile(postMedia.Url);

                        if (videoData != null)
                        {
                            // Construct data URL for video
                            mediaModel.Url = $"data:video/mp4;base64,{Convert.ToBase64String(videoData)}";
                        }
                        else
                        {
                            // Handle if video data could not be retrieved
                            mediaModel.Url = $"Error: Unable to retrieve video data for {postMedia.FileName}";
                        }
                    }
                    else
                    {
                        // For image media, handle URL and data
                        byte[] imageData = ReadImageFile(postMedia.Url); // Assuming reading image data from URL

                        if (imageData != null)
                        {
                            // Construct data URL for image
                            string base64String = Convert.ToBase64String(imageData);
                            string dataUrl = $"data:{GetMimeType(postMedia.FileName)};base64,{base64String}";
                            mediaModel.Url = dataUrl;
                        }
                        else
                        {
                            // Handle if image data could not be retrieved
                            mediaModel.Url = $"Error: Unable to retrieve image data for {postMedia.FileName}";
                        }
                    }

                    mediaList.Add(mediaModel);
                }

                postModel.Media = mediaList;
            }



            if (postEntity.Likes != null)
            {
                postModel.LikesCount = postEntity.Likes.Count;
                Like like = postEntity.Likes.FirstOrDefault(c => c.UserId == userId);
                if (like != null)
                {
                    postModel.IsLiked = true;

                }
            }
           

            if (postEntity.Comments != null)
            {
                List<CommentModel> commentList = new List<CommentModel>();

                foreach (var comment in postEntity.Comments)
                {
                    CommentModel CommentModel = new CommentModel();
                    var user = _dbContext.Users.Find(comment.UserId);
                    CommentModel.FullName = user.FirstName + " " + user.LastName;
                    CommentModel.UserId = comment.UserId;
                    CommentModel.PostId = comment.PostId;
                    CommentModel.CommentId = comment.Id;
                    CommentModel.Content = comment.Content;
                    CommentModel.CreatedDate = comment.CreatedDate;
                    if (user.ProfilePicture != null)
                    {
                        //convert pfp from Byte[] to dataUrl
                        var base64String = Convert.ToBase64String(user.ProfilePicture);
                        var dataUrl = $"data:image/jpeg;base64,{base64String}";
                        CommentModel.ProfilePicture = dataUrl;
                    }
                    CommentModel.LikesCount = comment.CommentLikes.Count; // Set comment likes count

                    // Check if current user has liked the comment
                    if (comment.CommentLikes != null)
                    {
                        CommentLike commentLike = comment.CommentLikes.FirstOrDefault(c => c.UserId == userId);
                        if (commentLike != null)
                        {
                            CommentModel.IsLiked = true;
                        }
                    }
                    commentList.Add(CommentModel);
                }
                postModel.Comments = commentList;
            }

            postListResult.Add(postModel);
        }

        return postListResult;
    }
    private string GetMimeType(string fileName)
    {
        string fileExtension = Path.GetExtension(fileName)?.ToLower();

        switch (fileExtension)
        {
            case ".jpg":
            case ".jpeg":
                return "image/jpeg";
            case ".png":
                return "image/png";
            case ".gif":
                return "image/gif";
            default:
                return "application/octet-stream"; // Default MIME type if extension is unknown
        }
    }
    private byte[] ReadVideoFile(string filePath)
    {
        return System.IO.File.ReadAllBytes(filePath);
    }
    private byte[] ReadImageFile(string filePath)
    {
        return System.IO.File.ReadAllBytes(filePath);
    }
    [HttpGet("get-posts/{userId}")]
    public List<PostModel> GetPosts(string userId)
    {
        var data = _dbContext.Posts.Where(c => c.UserId == Guid.Parse(userId))
              .Include(p => p.Likes)
              .Include(p => p.Comments) // Include Comments for each Post
              .ThenInclude(c => c.CommentLikes) // Then include CommentLikes for each Comment
              .Include(p => p.Medias)
              .ToList().OrderByDescending(c => c.CreatedDate);

        List<PostModel> postListResult = new List<PostModel>();

        foreach (var postEntity in data)
        {
            PostModel postModel = new PostModel();

            var userEntity = _dbContext.Users.Find(postEntity.UserId);
            postModel.FullName = userEntity.FirstName + " " + userEntity.LastName;
            postModel.CreatedDate = postEntity.CreatedDate;
            postModel.Content = postEntity.Content;
            postModel.PostId = postEntity.Id;
            if (userEntity.ProfilePicture != null)
            {
                //convert pfp from Byte[] to dataUrl
                var base64String = Convert.ToBase64String(userEntity.ProfilePicture);
                var dataUrl = $"data:image/jpeg;base64,{base64String}";
                postModel.ProfilePicture = dataUrl;
            }

            if (postEntity.Medias != null && postEntity.Medias.Any())
            {
                List<MediaModel> mediaList = new List<MediaModel>();

                foreach (var postMedia in postEntity.Medias)
                {
                    MediaModel mediaModel = new MediaModel
                    {
                        FileName = postMedia.FileName,
                        IsVideo = postMedia.IsVideo
                    };

                    if (mediaModel.IsVideo)
                    {
                        // For video media, handle URL and data
                        byte[] videoData = ReadVideoFile(postMedia.Url);

                        if (videoData != null)
                        {
                            // Construct data URL for video
                            mediaModel.Url = $"data:video/mp4;base64,{Convert.ToBase64String(videoData)}";
                        }
                        else
                        {
                            // Handle if video data could not be retrieved
                            mediaModel.Url = $"Error: Unable to retrieve video data for {postMedia.FileName}";
                        }
                    }
                    else
                    {
                        // For image media, handle URL and data
                        byte[] imageData = ReadImageFile(postMedia.Url); // Assuming reading image data from URL

                        if (imageData != null)
                        {
                            // Construct data URL for image
                            string base64String = Convert.ToBase64String(imageData);
                            string dataUrl = $"data:{GetMimeType(postMedia.FileName)};base64,{base64String}";
                            mediaModel.Url = dataUrl;
                        }
                        else
                        {
                            // Handle if image data could not be retrieved
                            mediaModel.Url = $"Error: Unable to retrieve image data for {postMedia.FileName}";
                        }
                    }

                    mediaList.Add(mediaModel);
                }

                postModel.Media = mediaList;
            }

            if (postEntity.Likes != null)
            {
                postModel.LikesCount = postEntity.Likes.Count;
                Like like = postEntity.Likes.FirstOrDefault(c => c.UserId == Guid.Parse(userId));
                if (like != null)
                {
                    postModel.IsLiked = true;

                }
            }


            if (postEntity.Comments != null)
            {
                List<CommentModel> commentList = new List<CommentModel>();

                foreach (var comment in postEntity.Comments)
                {
                    CommentModel CommentModel = new CommentModel();
                    var user = _dbContext.Users.Find(comment.UserId);
                    CommentModel.FullName = user.FirstName + " " + user.LastName;
                    CommentModel.UserId = comment.UserId;
                    CommentModel.PostId = comment.PostId;
                    CommentModel.CommentId = comment.Id;
                    CommentModel.Content = comment.Content;
                    CommentModel.CreatedDate = comment.CreatedDate;
                    if (user.ProfilePicture != null)
                    {
                        //convert pfp from Byte[] to dataUrl
                        var base64String = Convert.ToBase64String(user.ProfilePicture);
                        var dataUrl = $"data:image/jpeg;base64,{base64String}";
                        CommentModel.ProfilePicture = dataUrl;
                    }
                    CommentModel.LikesCount = comment.CommentLikes.Count; // Set comment likes count

                    // Check if current user has liked the comment
                    if (comment.CommentLikes != null)
                    {
                        CommentLike commentLike = comment.CommentLikes.FirstOrDefault(c => c.UserId == Guid.Parse(userId));
                        if (commentLike != null)
                        {
                            CommentModel.IsLiked = true;
                        }
                    }
                    commentList.Add(CommentModel);
                }
                postModel.Comments = commentList;
            }

            postListResult.Add(postModel);
        }

        return postListResult;
    }


    [HttpGet("get-notification")]
    public List<NotificationModel> GetNotification()
    {
        Guid userId = Guid.Parse(User.Identity?.Name);
        List<NotificationModel> notificationsModel = new List<NotificationModel>();
        var notifications = _dbContext.Notifications.Where(c => c.UserId == userId).ToList().OrderByDescending(c => c.CreatedDate);


        if (notifications != null && notifications.Count() > 0)
        {

            foreach (var notification in notifications)
            {
                NotificationModel notificationModel = new NotificationModel();

                if (notification.UserRefrenceId.HasValue)
                {
                    var user = _dbContext.Users.Find(notification.UserRefrenceId.Value);

                    if (user.ProfilePicture != null)
                    {
                        var base64String = Convert.ToBase64String(user.ProfilePicture);
                        var dataUrl = $"data:image/jpeg;base64,{base64String}";
                        notificationModel.ProfilePicture = dataUrl;
                    }
                }

                notificationModel.Content = notification.Content;
                notificationModel.FullName = notification.FullName;
                notificationModel.CreatedDate = notification.CreatedDate;
                notificationsModel.Add(notificationModel);


            }
        }

        return notificationsModel;
    }

    [HttpPost("make-like")]
    public bool Like(LikeModel model)
    {

        Guid userId = Guid.Parse(User.Identity?.Name);
        Like like = new Like();
        like.UserId = userId;
        like.PostId = model.PostId;
        _dbContext.Likes.Add(like);

        var user = _dbContext.Users.Find(userId);
        var post = _dbContext.Posts.Find(model.PostId);

        Notification notification = new Notification();
        var userName = string.Concat(user.FirstName, " ", user.LastName);

        notification.Content = userName + " likes  your post";
        notification.FullName = userName;
        notification.UserId = post.UserId;
        notification.UserRefrenceId = userId;

        notification.PostId = model.PostId;
        notification.CreatedDate = DateTime.Now;

        _dbContext.Notifications.Add(notification);


        _dbContext.SaveChanges();

        return true;
    }



    [HttpPost("make-disLike")]
    public bool DisLike(LikeModel model)
    {

        Guid userId = Guid.Parse(User.Identity?.Name);
        var like = _dbContext.Likes.FirstOrDefault(c => c.UserId == userId && c.PostId == model.PostId);

        if (like != null)
        {
            _dbContext.Likes.Remove(like);
            _dbContext.SaveChanges();
            return true;
        }

        return true;
    }

    [HttpPost("like-comment")]
    public bool LikeComment( CommentLikeModel model)
    {
        Guid userId = Guid.Parse(User.Identity?.Name);
        CommentLike commentLike = new CommentLike
        {
            UserId = userId,
            CommentId = model.CommentId
            // Assuming other properties need to be set as well
        };

        _dbContext.CommentLikes.Add(commentLike);
        var user = _dbContext.Users.Find(userId);
        var commentLikeNotify = _dbContext.Comments.Find(model.CommentId);

        Notification notification = new Notification();
        var userName = string.Concat(user.FirstName, " ", user.LastName);

        notification.Content = userName + " Love your comment";
        notification.FullName = userName;
        notification.UserId = commentLikeNotify.UserId;
        notification.UserRefrenceId = userId;

        notification.CommentId = model.CommentId;
        notification.CreatedDate = DateTime.Now;

        _dbContext.Notifications.Add(notification);

        _dbContext.SaveChanges();

        return true;
    }
    [HttpPost("make-comment-dislike")]
    public bool DislikeComment(CommentLikeModel model) 
    {
        Guid userId = Guid.Parse(User.Identity?.Name);
        var commentLike = _dbContext.CommentLikes.FirstOrDefault(c => c.UserId == userId && c.CommentId == model.CommentId);

        if (commentLike != null)
        {
            _dbContext.CommentLikes.Remove(commentLike);
            var notification = _dbContext.Notifications.FirstOrDefault(n => n.UserRefrenceId == userId && n.CommentId == model.CommentId);
            if (notification != null)
            {
                _dbContext.Notifications.Remove(notification);
            }
            _dbContext.SaveChanges();
            return true;
        }

        return true;

    }

    [HttpPost("make-comment")]
    public IActionResult AddComment(CommentModel model)
    {
        if (string.IsNullOrEmpty(model.Content))
        {
            return BadRequest("Comment content cannot be empty.");
        }

        Guid userId = Guid.Parse(User.Identity?.Name);
        var user = _dbContext.Users.Find(userId);
        var post = _dbContext.Posts.Find(model.PostId);

        Comment comment = new Comment();
        comment.UserId = userId;
        comment.PostId = model.PostId;
        comment.Content = model.Content;
        comment.CreatedDate = DateTime.UtcNow;

        _dbContext.Comments.Add(comment);

        Notification notification = new Notification();
        var userName = string.Concat(user.FirstName, " ", user.LastName);

        notification.Content = userName + " comments on your post";
        notification.FullName = userName;
        notification.UserId = post.UserId;
        notification.PostId = model.PostId;
        notification.UserRefrenceId = userId;
        notification.CreatedDate = DateTime.Now;

        _dbContext.Notifications.Add(notification);

        _dbContext.SaveChanges();

        return Ok(true); // Return Ok if the comment is successfully added
    }


    [HttpPost("create-post")]
    public IActionResult Create()
    {
        string postModelContent = Request.Form["postModel"];
        PostMediaModel model = JsonSerializer.Deserialize<PostMediaModel>(postModelContent);

        var files = Request.Form.Files;
        if (string.IsNullOrWhiteSpace(model.content) && (files == null || files.Count == 0))
        {
            // Return BadRequest with an error message
            return BadRequest("Post content and media cannot be empty.");
        }

        Guid userId = Guid.Parse(User.Identity?.Name);
        Post post = new Post
        {
            UserId = userId,
            Content = model.content,
            CreatedDate = DateTime.UtcNow,
            CreatedBy = userId
        };

        List<Media> mediaList = new List<Media>();

        foreach (var file in files)
        {
            if (IsImage(file) || IsVideo(file))
            {
                using (var memoryStream = new MemoryStream())
                {
                    file.CopyTo(memoryStream);

                    Media mediaModel = new Media
                    {
                        FileName = file.FileName,
                        File = memoryStream.ToArray(),
                        Url = IsImage(file) ? GenerateImagePath(file) : GenerateVideoPath(file),
                        IsVideo = IsVideo(file),
                        FileType = IsImage(file) ? FreeSpace.Web.Enums.MediaType.Image.ToString() : FreeSpace.Web.Enums.MediaType.Video.ToString()
                    };

                    mediaList.Add(mediaModel);
                }
            }
            else
            {
                return BadRequest("Uploaded file is neither an image nor a video.");
            }
        }

        post.Medias = mediaList;
        _dbContext.Posts.Add(post);
        _dbContext.SaveChanges();

        return Ok();
    }

        // Helper method to check if the file is an image
        private bool IsImage(IFormFile file)
    {
        string[] allowedImageTypes = { "image/jpeg", "image/png", "image/gif" };
        return allowedImageTypes.Contains(file.ContentType.ToLower())
            || Path.GetExtension(file.FileName).ToLower() == ".jpg"
            || Path.GetExtension(file.FileName).ToLower() == ".jpeg"
            || Path.GetExtension(file.FileName).ToLower() == ".png"
            || Path.GetExtension(file.FileName).ToLower() == ".gif";
    }

    // Helper method to check if the file is a video
    private bool IsVideo(IFormFile file)
    {
        string[] videoMimeTypes = { "video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv" };
        return videoMimeTypes.Contains(file.ContentType.ToLower());
    }
    private string GenerateImagePath(IFormFile imageFile)
    {
        // Define the target directory path
        string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "PostImages");

        // Check if the target directory exists; if not, create it
        if (!Directory.Exists(directoryPath))
        {
            Directory.CreateDirectory(directoryPath);
        }

        // Generate a unique file name for the image (e.g., using GUID)
        string uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";

        // Combine the directory path and the unique file name to get the full file path
        string imagePath = Path.Combine(directoryPath, uniqueFileName);

        // Save the image file to the specified path
        using (var stream = new FileStream(imagePath, FileMode.Create))
        {
            imageFile.CopyTo(stream);
        }

        // Return the relative path (e.g., relative to the web root)
        return $"PostImages/{uniqueFileName}";
    }

    private string GenerateVideoPath(IFormFile videoFile)
    {

        string videoDirectory = @"C:\Users\rand_\OneDrive\Desktop\FreeSpace\FreeSpace\GradProject\FreeSpace.Web\Videos\"; ; // Path to directory where videos will be saved
        string fileName = $"{Guid.NewGuid().ToString()}{Path.GetExtension(videoFile.FileName)}"; // Generate unique file name
        string filePath = Path.Combine(videoDirectory, fileName);

        // Ensure the directory exists or create it if it doesn't
        if (!Directory.Exists(videoDirectory))
        {
            Directory.CreateDirectory(videoDirectory);
        }

        // Copy the video file to the specified location
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            videoFile.CopyTo(stream);
        }

        return filePath; // Return the file path where the video is saved
    }


    private bool IsVideoFile(string fileName)
    {
        string[] videoExtensions = { ".mp4", ".mpeg", ".mov", ".avi", ".wmv" };
        string fileExtension = Path.GetExtension(fileName).ToLower();
        return videoExtensions.Contains(fileExtension);
    }

}


