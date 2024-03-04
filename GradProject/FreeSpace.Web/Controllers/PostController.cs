﻿using FreeSpace.Web.Data;
using FreeSpace.Web.Entities;
using FreeSpace.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Text.Json;

namespace FreeSpace.Web.Controllers;

[Route("api/[controller]")]
[Authorize()]
[ApiController]
public class PostController : ControllerBase
{
    protected readonly ApplicationDbContext _dbContext;

    public PostController(ApplicationDbContext dbContext)
    {
        _dbContext =  dbContext;
    }

    [HttpGet("get-posts")]
    public List<PostModel> GetPosts()
    {
        Guid userId = Guid.Parse(User.Identity?.Name);

        var followers = _dbContext.FriendShips.Where(c => ( c.SourceId == userId || c.TargetId == userId) && c.Status== "Approved").ToList();
        var sourceList = followers.Select(c => c.SourceId).ToList();
        var targetList = followers.Select(c => c.TargetId).ToList();
        var allUsers = targetList.Concat(sourceList);



        var posts = _dbContext.Posts.Where(c => allUsers.Contains(c.UserId) || c.UserId==userId)
             .Include(p => p.Likes)
             .Include(p => p.Comments).OrderByDescending(c=>c.CreatedDate)
             .Include(p => p.Medias).OrderByDescending(c => c.CreatedDate)
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

            if (postEntity.Medias != null)
            {
                List<MediaModel> mediaList = new List<MediaModel>();
                foreach (var postMedia in postEntity.Medias)
                {
                    MediaModel mediaModel = new MediaModel();
                    mediaModel.File = postMedia.File;
                    mediaModel.Url = postMedia.Url;
                    mediaModel.FileName = postMedia.FileName;
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
                    CommentModel.Content = comment.Content;
                    CommentModel.CreatedDate = comment.CreatedDate;
                    if (user.ProfilePicture != null)
                    {
                        //convert pfp from Byte[] to dataUrl
                        var base64String = Convert.ToBase64String(user.ProfilePicture);
                        var dataUrl = $"data:image/jpeg;base64,{base64String}";
                        CommentModel.ProfilePicture = dataUrl;
                    }
                    commentList.Add(CommentModel);
                }
                postModel.Comments = commentList;
            }

            postListResult.Add(postModel);
        }

        return postListResult;
    }

    [HttpGet("get-posts/{userId}")]
    public List<PostModel> GetPosts(string userId)
    {
        var data = _dbContext.Posts.Where(c => c.UserId == Guid.Parse(userId))
              .Include(p => p.Likes)
              .Include(p => p.Comments)
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

            if (postEntity.Medias != null)
            {
                List<MediaModel> mediaList = new List<MediaModel>();
                foreach (var postMedia in postEntity.Medias)
                {
                    MediaModel mediaModel = new MediaModel();
                    mediaModel.File = postMedia.File;
                    mediaModel.Url = postMedia.Url;
                    mediaModel.FileName = postMedia.FileName;
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
                    CommentModel.Content = comment.Content;
                    CommentModel.CreatedDate = comment.CreatedDate;

                    if (user.ProfilePicture != null)
                    {
                        //convert pfp from Byte[] to dataUrl
                        var base64String = Convert.ToBase64String(user.ProfilePicture);
                        var dataUrl = $"data:image/jpeg;base64,{base64String}";
                        CommentModel.ProfilePicture = dataUrl;
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
       var notifications =  _dbContext.Notifications.Where(c=>c.UserId== userId).ToList().OrderByDescending(c=>c.CreatedDate);

        
        if (notifications!=null && notifications.Count()>0)
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
        notification.FullName = userName ;
        notification.UserId = post.UserId;
        notification.UserRefrenceId = userId;

        notification.PostId = model.PostId;
        notification.CreatedDate= DateTime.Now;

        _dbContext.Notifications.Add(notification);


        _dbContext.SaveChanges();

        return true;
    }

     

    [HttpPost("make-disLike")]
    public bool DisLike(LikeModel model)
    {

        Guid userId = Guid.Parse(User.Identity?.Name);
        var like = _dbContext.Likes.FirstOrDefault(c => c.UserId == userId && c.PostId == model.PostId);

        if (like!=null)
        {
            _dbContext.Likes.Remove(like);
            _dbContext.SaveChanges();
            return true;
        }

        return true;
    }



    [HttpPost("make-comment")]
    public bool AddComment(CommentModel model)
    {

        Guid userId = Guid.Parse(User.Identity?.Name);
        var user = _dbContext.Users.Find(userId);
        var post = _dbContext.Posts.Find(model.PostId);

        Comment comment = new Comment();
        comment.UserId = userId;
        comment.PostId = model.PostId;
        comment.Content = model.Content;
        comment.CreatedDate= DateTime.UtcNow;

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

        return true;
    }



    [HttpPost("create-post")]
    public IActionResult Create()
    {
        string postModelContent = Request.Form["postModel"];
        PostMediaModel model = JsonSerializer.Deserialize<PostMediaModel>(postModelContent);
       

        var files = Request.Form.Files;


        Guid userId = Guid.Parse(User.Identity?.Name);
          Post post = new Post();
          post.UserId = userId;
          post.Content = model.content;
          post.CreatedDate = DateTime.UtcNow;
          post.CreatedBy = userId;
          if (files != null)
          {
              List<Media> mediaList = new List<Media>();
              foreach (var file in files)
              {

                using (var memoryStream = new MemoryStream())
                {
                    // Copy the content of the file to the memory stream asynchronously
                    file.CopyToAsync(memoryStream);

                    var base64String = Convert.ToBase64String(memoryStream.ToArray());
                    var dataUrl = $"data:image/jpeg;base64,{base64String}";


                    Media mediaModel = new Media();
                    mediaModel.File = memoryStream.ToArray();
                    mediaModel.Url = dataUrl;
                    mediaModel.FileName = file.FileName;
                    mediaList.Add(mediaModel);

                }
             

              }
              post.Medias = mediaList;
          }

          _dbContext.Posts.Add(post);
          _dbContext.SaveChanges();
        return Ok();
    }

}