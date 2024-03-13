
using FreeSpace.Web.Data;
using FreeSpace.Web.Entities;
using FreeSpace.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;
namespace FreeSpace.Web.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        protected readonly ApplicationDbContext _dbContext;
        public UserController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

       [HttpGet("getNonFriends")]
        public List<UserInfoModel> GetNonFriends()
        {
            try
            {
                List<UserInfoModel> userInfoModels = new List<UserInfoModel>(); 
                Guid userId = Guid.Parse(User.Identity?.Name);

                // Query the database to get a list of friend relationships involving the authenticated user
                var friendIds = _dbContext.FriendShips
              .Where(f => (f.SourceId == userId || f.TargetId==userId) )
              .ToList();

                // Extract the IDs of the source and target users from the friend relationships
                var sourceList = friendIds.Select(c => c.SourceId).ToList();
                var targetList = friendIds.Select(c => c.TargetId).ToList();
                var allUsers = targetList.Concat(sourceList);

                // Retrieve users who are not friends with the user
                List<User> nonFriends = _dbContext.Users
                    .Where(u => !allUsers.Contains(u.Id) && u.Id !=userId)
                    .ToList();

                if (nonFriends!=null && nonFriends.Count()>0)
                {
                    foreach (var friend in nonFriends)
                    {
                        UserInfoModel user = new UserInfoModel();
                        user.Id = friend.Id;
                        user.FirstName = friend.FirstName;
                        user.LastName = friend.LastName;


                        if (friend.ProfilePicture != null)
                        {
                            var base64String = Convert.ToBase64String(friend.ProfilePicture);
                            var dataUrl = $"data:image/jpeg;base64,{base64String}";
                            user.ProfilePicture = dataUrl;
                        }

                        userInfoModels.Add(user);
                    }
                }

                // You might want to return a DTO or transform the entities before returning them
                return userInfoModels;
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                throw ex;
            }
        }


        


        [HttpGet("getFriends")]
        public List<UserInfoModel> GetFriends()
        {
            try
            {
                List<UserInfoModel> userInfoModels = new List<UserInfoModel>();
                Guid userId = Guid.Parse(User.Identity?.Name);

                // Query the database to get a list of friend relationships involving the authenticated user
                var friendIds = _dbContext.FriendShips
              .Where(f => (f.SourceId == userId || f.TargetId == userId )&& f.Status== "Approved")
              .ToList();

                // Extract the IDs of the source and target users from the friend relationships
                var sourceList = friendIds.Select(c => c.SourceId).ToList();
                var targetList = friendIds.Select(c => c.TargetId).ToList();
                var allUsers = targetList.Concat(sourceList);

                // Retrieve users who are friends with the user
                List<User> friends = _dbContext.Users
                    .Where(u => allUsers.Contains(u.Id) && u.Id != userId)
                    .ToList();

                if (friends != null && friends.Count() > 0)
                {
                    foreach (var friend in friends)
                    {
                        UserInfoModel user = new UserInfoModel();
                        user.Id = friend.Id;
                        user.FirstName = friend.FirstName;
                        user.LastName = friend.LastName;


                        if (friend.ProfilePicture != null)
                        {
                            var base64String = Convert.ToBase64String(friend.ProfilePicture);
                            var dataUrl = $"data:image/jpeg;base64,{base64String}";
                            user.ProfilePicture = dataUrl;
                        }

                        userInfoModels.Add(user);
                    }
                }

                // You might want to return a DTO or transform the entities before returning them
                return userInfoModels;
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                throw ex;
            }
        }


        [HttpGet("getPendingFriends")]
        public List<UserInfoModel> GetPendingFriends()
        {
            try
            {
                List<UserInfoModel> userInfoModels = new List<UserInfoModel>();
                Guid userId = Guid.Parse(User.Identity?.Name);

                // Query the database to get a list of pending friend requests targeting the authenticated user
                var friendIds = _dbContext.FriendShips
                    .Where(f => (f.TargetId == userId) && f.Status == "Pending")
                    .ToList();

                if (friendIds!=null && friendIds.Count()>0)
                {
                    // Extract the IDs of users who sent the pending friend requests
                    var sendersList = friendIds.Select(c => c.SourceId).ToList();

                    // Retrieve users who sent the pending friend requests
                    List<User> friends = _dbContext.Users
                        .Where(u => sendersList.Contains(u.Id) && u.Id != userId)
                        .ToList();

                    if (friends != null && friends.Count() > 0)
                    {
                        foreach (var friend in friends)
                        {
                            UserInfoModel user = new UserInfoModel();
                            user.Id = friend.Id;
                            user.FirstName = friend.FirstName;
                            user.LastName = friend.LastName;


                            if (friend.ProfilePicture != null)
                            {
                                var base64String = Convert.ToBase64String(friend.ProfilePicture);
                                var dataUrl = $"data:image/jpeg;base64,{base64String}";
                                user.ProfilePicture = dataUrl;
                            }

                            userInfoModels.Add(user);
                        }
                    }
                }
             

                // You might want to return a DTO or transform the entities before returning them
                return userInfoModels;
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                throw ex;
            }
        }




        [HttpPost("add-friend")]
        public bool AddFriend([FromBody] FriendRequestModel friendRequestModel)
        {

            Guid userId = Guid.Parse(User.Identity?.Name);

            // Retrieve the authenticated user from the database
            var user = _dbContext.Users.Find(userId);
            
            FriendShip friendShip = new FriendShip();
            friendShip.Status = "Pending";
            friendShip.SourceId = userId;
            friendShip.TargetId = (friendRequestModel.UserTargetId);

            _dbContext.FriendShips.Add(friendShip);


            Notification notification = new Notification();
            var userName = string.Concat(user.FirstName, " ", user.LastName);

            notification.Content = userName + " added you as Friend!";
            notification.FullName = userName;
            notification.UserId = friendShip.TargetId.Value;
            notification.UserRefrenceId = userId;
            notification.CreatedDate = DateTime.UtcNow;


            _dbContext.Notifications.Add(notification);

            _dbContext.SaveChanges();

            return true;
        }

        [HttpPost("aceept-reject-friend")]
        public bool AcceptOrRejectFriend([FromBody] FriendRequestModel friendRequestModel)
        {

            Guid userId = Guid.Parse(User.Identity?.Name);

            var user = _dbContext.Users.Find(userId);

            // Find the friend request sent by another user to the authenticated user
            FriendShip userAddedMe = _dbContext.FriendShips.Where(u => u.SourceId == (friendRequestModel.UserSourceId) && u.Status == "Pending").FirstOrDefault();
            
            if (userAddedMe!=null)
            {
                if (friendRequestModel.Status == "Approved")
                    userAddedMe.Status = "Approved";

                else
                {
                    userAddedMe.Status = "Reject";
                    _dbContext.FriendShips.Remove(userAddedMe);
                  
                }
                _dbContext.Entry(user).State = EntityState.Modified;
                _dbContext.SaveChanges();

                var sender = _dbContext.Users.Find(friendRequestModel.UserSourceId);

                Notification notification = new Notification();
                var userName = string.Concat(user.FirstName, " ", user.LastName);

                notification.Content = userName + " Accept your Friend Request";
                notification.FullName = userName;
                notification.UserId = sender.Id;
                notification.UserRefrenceId = userId;
                notification.CreatedDate = DateTime.UtcNow;


                _dbContext.Notifications.Add(notification);
                _dbContext.SaveChanges();

            }


            return true;
        }



        [HttpPost("upload")]
        public IActionResult UploadProfileImage()
        {
            // Retrieve the uploaded file from the request
            var file = Request.Form.Files[0];

            // Check if the uploaded file has content
            if (file.Length > 0)
            {
                // Use a memory stream to read the content of the file
                using (var memoryStream = new MemoryStream())
                {
                    // Copy the content of the file to the memory stream asynchronously
                    file.CopyToAsync(memoryStream);

                    Guid userId = Guid.Parse(User.Identity?.Name);
                   var user =  _dbContext.Users.Find(userId);
                    if (user!=null)
                    {
                        user.ProfilePicture = memoryStream.ToArray();
                        _dbContext.Entry(user).State = EntityState.Modified;
                        _dbContext.SaveChanges();
                    }

                 

                    return Ok(new { message = "Image uploaded successfully" });
                }
            }

            return BadRequest(new { message = "Failed to upload image" });
        }


        [HttpPost("uploadCover")]
        public IActionResult UploadCoverImage()
        {
            var file = Request.Form.Files[0];

            if (file.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    file.CopyToAsync(memoryStream);

                    Guid userId = Guid.Parse(User.Identity?.Name);
                    var user = _dbContext.Users.Find(userId);
                    if (user != null)
                    {
                        user.CoverPicture = memoryStream.ToArray();
                        _dbContext.Entry(user).State = EntityState.Modified;
                        _dbContext.SaveChanges();
                    }



                    return Ok(new { message = "Image uploaded successfully" });
                }
            }

            return BadRequest(new { message = "Failed to upload image" });
        }

        [HttpPost("updateUserInfo")]
        public IActionResult UpdateUserInfo([FromBody] UserInfoModel model)
        {
            if (model == null)
            {
                return BadRequest(new { message = "Invalid data received" });
            }

            Guid userId = Guid.Parse(User.Identity?.Name);
            var user = _dbContext.Users.Find(userId);
            if (user != null)
            {
                user.Bio = model.Bio;
                user.NickName = model.NickName;
                _dbContext.Entry(user).State = EntityState.Modified;
                _dbContext.SaveChanges();

                return Ok(new { message = "Profile Info updated successfully" });
            }

            return BadRequest(new { message = "User not found" });
        }

        [HttpPost("changePassword")]
        public IActionResult ChangePassword([FromBody] ChangePassword model)
        {
            if (model == null)
            {
                return BadRequest(new { message = "Invalid data received" });
            }

            Guid userId = Guid.Parse(User.Identity?.Name);
            var user = _dbContext.Users.Find(userId);
            if (user != null)
            {
                if (model.oldPassword != user.Password)
                {
                    return BadRequest(new { message = "Old password is incorrect" });
                }

                user.Password = model.newPassword;

                _dbContext.Entry(user).State = EntityState.Modified;
                _dbContext.SaveChanges();

                return Ok(new { message = "Password updated successfully" });
            }

            return BadRequest(new { message = "User not found" });
        }
    }

}

   

