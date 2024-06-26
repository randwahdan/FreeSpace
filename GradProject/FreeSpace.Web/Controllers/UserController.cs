﻿
using FreeSpace.Web.Data;
using FreeSpace.Web.Entities;
using FreeSpace.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
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

        [HttpGet("getNonFriendsWithCommonFriends")]
        public List<UserInfoModel> GetNonFriendsWithCommonFriends()
        {
            try
            {
                List<UserInfoModel> userInfoModels = new List<UserInfoModel>();
                Guid userId = Guid.Parse(User.Identity?.Name);

                // Get IDs of all friends of the authenticated user
                var userFriendsIds = _dbContext.FriendShips
                    .Where(f => (f.SourceId == userId || f.TargetId == userId) && f.Status == "Approved")
                    .Select(f => f.SourceId == userId ? f.TargetId : f.SourceId)
                    .ToList();

                // Get all non-friends of the authenticated user (users who are not friends)
                var nonFriendIds = _dbContext.Users
                    .Where(u => u.Id != userId && !userFriendsIds.Contains(u.Id)) // Exclude friends
                    .Select(u => u.Id)
                    .ToList();

                foreach (var nonFriendId in nonFriendIds)
                {
                    // Get friends of the current non-friend user excluding the authenticated user
                    var nonFriendFriendsIds = _dbContext.FriendShips
                        .Where(f => (f.SourceId == nonFriendId || f.TargetId == nonFriendId) && f.SourceId != userId && f.TargetId != userId) // Exclude authenticated user
                        .Select(f => f.SourceId == nonFriendId ? f.TargetId : f.SourceId)
                        .ToList();

                    // Calculate mutual friends count with the authenticated user
                    int mutualFriendsCount = nonFriendFriendsIds.Intersect(userFriendsIds).Count();

                    // Fetch user details including profile picture
                    var nonFriend = _dbContext.Users.FirstOrDefault(u => u.Id == nonFriendId);

                    if (nonFriend != null && mutualFriendsCount > 0)
                    {
                        // Create UserInfoModel for the non-friend user
                        UserInfoModel user = new UserInfoModel
                        {
                            Id = nonFriend.Id,
                            FirstName = nonFriend.FirstName,
                            LastName = nonFriend.LastName,
                            MutualFriendsCount = mutualFriendsCount,
                            Country=nonFriend.Country
                        };

                        // Assign profile picture data if available
                        if (nonFriend.ProfilePicture != null)
                        {
                            var base64String = Convert.ToBase64String(nonFriend.ProfilePicture);
                            var dataUrl = $"data:image/jpeg;base64,{base64String}";
                            user.ProfilePicture = dataUrl;
                        }

                        // Add user to the list
                        userInfoModels.Add(user);
                    }
                }

                return userInfoModels;
            }
            catch (Exception ex)
            {
                // Handle exceptions
                throw ex;
            }
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
                    .Where(f => f.SourceId == userId || f.TargetId == userId)
                    .ToList();

                // Extract the IDs of the source and target users from the friend relationships
                var sourceList = friendIds.Select(c => c.SourceId).ToList();
                var targetList = friendIds.Select(c => c.TargetId).ToList();
                var allUsers = targetList.Concat(sourceList);

                // Retrieve users who are not friends with the user and have a common country
                List<User> nonFriends = _dbContext.Users
                  .Where(u => !allUsers.Contains(u.Id) && u.Id != userId && u.Country.ToLower() == _dbContext.Users.FirstOrDefault(u => u.Id == userId).Country.ToLower())
                  .ToList();


                if (nonFriends != null && nonFriends.Count() > 0)
                {
                    foreach (var friend in nonFriends)
                    {
                        UserInfoModel user = new UserInfoModel();
                        user.Id = friend.Id;
                        user.FirstName = friend.FirstName;
                        user.LastName = friend.LastName;
                        user.Country = friend.Country;

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
              .Where(f => (f.SourceId == userId || f.TargetId == userId) && f.Status == "Approved")
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

        [HttpGet("getFriends/{userId}")]
        public ActionResult<List<UserInfoModel>> GetFriendsByUserId(string userId)
        {
            try
            {
                if (!Guid.TryParse(userId, out Guid userIdGuid))
                {
                    return BadRequest("Invalid userId format");
                }

                // Get the current user's ID from the authenticated context
                Guid currentUserId = Guid.Parse(User.Identity?.Name);

                // Retrieve the IDs of friends for both current user and specified user
                var currentUserFriends = _dbContext.FriendShips
                    .Where(f => (f.SourceId == currentUserId || f.TargetId == currentUserId) && f.Status == "Approved")
                    .Select(f => f.SourceId == currentUserId ? f.TargetId : f.SourceId)
                    .ToList();

                var specifiedUserFriends = _dbContext.FriendShips
                    .Where(f => (f.SourceId == userIdGuid || f.TargetId == userIdGuid) && f.Status == "Approved")
                    .Select(f => f.SourceId == userIdGuid ? f.TargetId : f.SourceId)
                    .ToList();

                // Find mutual friends by finding the intersection of friend IDs
                var mutualFriendIds = currentUserFriends.Intersect(specifiedUserFriends).ToList();

                // Retrieve UserInfoModels for mutual friends
                List<UserInfoModel> mutualFriends = _dbContext.Users
                    .Where(u => mutualFriendIds.Contains(u.Id))
                    .Select(u => new UserInfoModel
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        ProfilePicture = u.ProfilePicture != null ?
                            $"data:image/jpeg;base64,{Convert.ToBase64String(u.ProfilePicture)}" :
                            null
                    })
                    .ToList();

                return Ok(mutualFriends);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return StatusCode(500, "An error occurred while fetching mutual friends");
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

                if (friendIds != null && friendIds.Count() > 0)
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

            if (userAddedMe != null)
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
        [HttpPost("remove-friend")]
        public bool RemoveFriend([FromBody] FriendRequestModel friendRequestModel)
        {
            try
            {
                Guid userId = Guid.Parse(User.Identity?.Name);

                // Find the authenticated user and the friend to be removed
                var user = _dbContext.Users.Find(userId);

                if (friendRequestModel.UserSourceId.HasValue) // Check if UserSourceId is not null
                {
                    Guid friendId = friendRequestModel.UserSourceId.Value; // Convert Guid? to Guid

                    var friendToRemove = _dbContext.Users.Find(friendId);

                    friendRequestModel.UserTargetId = userId;

                    // Find the friendship between the authenticated user and the friend
                    FriendShip userFriendship = _dbContext.FriendShips.FirstOrDefault(u =>
                        ((u.SourceId == friendId && u.TargetId == userId) ||
                        (u.SourceId == userId && u.TargetId == friendId)) &&
                        u.Status == "Approved");

                    if (userFriendship != null)
                    {
                        // Update friendship status to "Removed" and remove from DbContext
                        userFriendship.Status = "Removed";
                        _dbContext.FriendShips.Remove(userFriendship);

                        // Update mutual friends count for both users
                        UpdateMutualFriendsCount(userId, friendId);

                        // Save changes to DbContext
                        _dbContext.SaveChanges();
                    }
                }
                else
                {
                    // Handle the case where friendRequestModel.UserSourceId is null
                    // (This might indicate an issue with the request)
                    return false;
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions
                return false;
            }

            return true;
        }
        private void UpdateMutualFriendsCount(Guid userId1, Guid userId2)
        {
            var user1FriendsIds = _dbContext.FriendShips
                .Where(f => f.SourceId == userId1 || f.TargetId == userId1)
                .Select(f => f.SourceId == userId1 ? f.TargetId : f.SourceId)
                .ToList();

            var user2FriendsIds = _dbContext.FriendShips
                .Where(f => f.SourceId == userId2 || f.TargetId == userId2)
                .Select(f => f.SourceId == userId2 ? f.TargetId : f.SourceId)
                .ToList();

            // Calculate mutual friends count for user 1
            int mutualFriendsCountUser1 = user1FriendsIds.Intersect(user2FriendsIds).Count();

            // Calculate mutual friends count for user 2
            int mutualFriendsCountUser2 = mutualFriendsCountUser1;

            // Update mutual friends count in UserInfoModel or User entity for both users
            // (You may need to fetch and update the corresponding entities)
        }


        [HttpPost("upload")]
        public IActionResult UploadProfileImage()
        {
            var files = Request.Form.Files;

            if (files.Count == 0 || files[0] == null || files[0].Length == 0)
            {
                return BadRequest(new { message = "No file received or file is empty" });
            }

            var file = files[0];

            // Check if the uploaded file is an image
            if (!IsImageFile(file))
            {
                return BadRequest(new { message = "Only image files are allowed" });
            }

            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);

                Guid userId = Guid.Parse(User.Identity?.Name);
                var user = _dbContext.Users.Find(userId);
                if (user != null)
                {
                    user.ProfilePicture = memoryStream.ToArray();
                    _dbContext.Entry(user).State = EntityState.Modified;
                    _dbContext.SaveChanges();

                    return Ok(new { message = "Image uploaded successfully" });
                }
            }

            return BadRequest(new { message = "Failed to upload image" });
        }


        [HttpPost("uploadCover")]
    public IActionResult UploadCoverImage()
    {
        var files = Request.Form.Files;

        if (files.Count == 0 || files[0] == null || files[0].Length == 0)
        {
            return BadRequest(new { message = "No file received or file is empty" });
        }

        var file = files[0];

        if (!IsImageFile(file))
        {
            return BadRequest(new { message = "Only image files are allowed" });
        }

        using (var memoryStream = new MemoryStream())
        {
            file.CopyTo(memoryStream);

            Guid userId = Guid.Parse(User.Identity?.Name);
            var user = _dbContext.Users.Find(userId);
            if (user != null)
            {
                user.CoverPicture = memoryStream.ToArray();
                _dbContext.Entry(user).State = EntityState.Modified;
                _dbContext.SaveChanges();

                return Ok(new { message = "Image uploaded successfully" });
            }
        }

        return BadRequest(new { message = "Failed to upload image" });
    }

    private bool IsImageFile(IFormFile file)
    {
        // Check if the uploaded file is an image
        return file.ContentType.StartsWith("image/");
    }


        [HttpPost("updateUserInfo")]
        public IActionResult UpdateUserInfo([FromBody] UserInfoModel model)
        {
            Guid userId = Guid.Parse(User.Identity?.Name);
            var user = _dbContext.Users.Find(userId);
            if (model == null)
            {
                return BadRequest(new { message = "Invalid data received" });
            }

            if (string.IsNullOrWhiteSpace(model.Bio) && string.IsNullOrWhiteSpace(model.NickName))
            {
                return BadRequest(new { message = "Bio and Nickname cannot be empty" });
            }
            if (string.IsNullOrWhiteSpace(model.Bio) && !string.IsNullOrWhiteSpace(model.NickName))
            {
                user.NickName = model.NickName;
                _dbContext.Entry(user).State = EntityState.Modified;
                _dbContext.SaveChanges();
                return Ok(new { message = "Your Nickname updated successfully" });

            }
            if (!string.IsNullOrWhiteSpace(model.Bio) && string.IsNullOrWhiteSpace(model.NickName))
            {
                user.Bio = model.Bio;
                _dbContext.Entry(user).State = EntityState.Modified;
                _dbContext.SaveChanges();
                return Ok(new { message = "Your Bio updated successfully" });
            }
            if (!string.IsNullOrWhiteSpace(model.Bio) && !string.IsNullOrWhiteSpace(model.NickName))
            {
                user.Bio = model.Bio;
                user.NickName = model.NickName;
                _dbContext.Entry(user).State = EntityState.Modified;
                _dbContext.SaveChanges();
                return Ok(new { message = "Your Info updated successfully" });
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
                if (BCrypt.Net.BCrypt.Verify(model.oldPassword, user.Password) == false)
                {
                    return BadRequest(new { message = "Old password is incorrect" });
                }
                if (model.newPassword != model.confirmPassword)
                {
                    return BadRequest(new { message = "New password and confirm password do not match" });
                }

                // Hash the new password before storing it
                user.Password = BCrypt.Net.BCrypt.HashPassword(model.newPassword);

                _dbContext.Entry(user).State = EntityState.Modified;
                _dbContext.SaveChanges();

                return Ok(new { message = "Password updated successfully" });
            }

            return BadRequest(new { message = "User not found" });
        }
        [HttpPost("deleteUser")]
        public IActionResult DeleteUser()
        {
            Guid userId = Guid.Parse(User.Identity?.Name);
            var user = _dbContext.Users.Find(userId);
            if (user != null)
            {
                _dbContext.Users.Remove(user);
                _dbContext.SaveChanges();

                return Ok(new { message = "User deleted successfully" });
            }

            return BadRequest(new { message = "User not found" });
        }


        [HttpGet("get-user/{userId}")]
        public ActionResult<UserInfoModel> GetUserById(string userId)
        {
            var targetUserId = Guid.Parse(userId);
            var currentUserId = Guid.Parse(User.Identity?.Name); // Assuming you are using authentication and have access to the current user's ID

            var user = _dbContext.Users.FirstOrDefault(u => u.Id == targetUserId);

            if (user == null)
            {
                return NotFound(); // Return 404 Not Found if user not found
            }

            // Map user data to UserInfoModel
            var userInfo = new UserInfoModel
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Bio = user.Bio,
                NickName = user.NickName,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender,
                MobileNumber = user.MobileNumber,
                CreatedDate = user.CreatedDate,
                Country=user.Country
                
                // You can include more properties as needed
            };

            // Handle profile and cover pictures if available
            if (user.ProfilePicture != null)
            {
                var base64String = Convert.ToBase64String(user.ProfilePicture);
                var dataUrl = $"data:image/jpeg;base64,{base64String}";
                userInfo.ProfilePicture = dataUrl;
            }

            if (user.CoverPicture != null)
            {
                var base64String = Convert.ToBase64String(user.CoverPicture);
                var dataUrl = $"data:image/jpeg;base64,{base64String}";
                userInfo.CoverPicture = dataUrl;
            }

            // Check if the target user is added by the current user
            var isFriend = _dbContext.FriendShips.Any(fs =>
                (fs.SourceId == currentUserId && fs.TargetId == targetUserId && fs.Status == "Approved") ||
                (fs.SourceId == targetUserId && fs.TargetId == currentUserId && fs.Status == "Approved"));
            if (isFriend)
            {
                userInfo.IsFriend = true;
            }
            var isPending = _dbContext.FriendShips.Any(fs =>
                (fs.SourceId == currentUserId && fs.TargetId == targetUserId && fs.Status == "Pending") ||
                (fs.SourceId == targetUserId && fs.TargetId == currentUserId && fs.Status == "Pending"));
            if (isPending) 
            {
                userInfo.IsAdded = true;
            }
            return Ok(userInfo); // Return user info with 200 OK status
        }
        [HttpGet("search/{name}")]
        public List<UserInfoModel> searchUsers(string name)
        {
            try
            {
                List<UserInfoModel> userModels = new List<UserInfoModel>();

                // Ensure name is not null or empty
                if (string.IsNullOrWhiteSpace(name))
                {
                    return userModels;
                }

                // Normalize the name (convert to lowercase)
                var normalizedName = name.ToLower();

                // Split the input into first and last names
                var names = normalizedName.Split(' ');

                // Query the database for users
                var users = _dbContext.Users.AsQueryable();

                // If both first and last names are provided, search for exact matches
                if (names.Length == 2)
                {
                    users = users.Where(u => u.FirstName.ToLower() == names[0] && u.LastName.ToLower() == names[1]);
                }
                else
                {
                    // Otherwise, search for matches in both first and last names
                    users = users.Where(u => EF.Functions.Like(u.FirstName.ToLower(), $"{names[0]}%") ||
                                              EF.Functions.Like(u.LastName.ToLower(), $"{names[0]}%"));
                }
                Guid userId = Guid.Parse(User.Identity?.Name);
                users = users.Where(u => u.Id != userId);
                // Execute the query
                var matchedUsers = users.ToList();

                // Map UserInfoModel to UserModel
                foreach (var user in matchedUsers)
                {
                    UserInfoModel userModel = new UserInfoModel
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Bio = user.Bio,
                        NickName = user.NickName,
                        DateOfBirth = user.DateOfBirth,
                        Gender = user.Gender,
                        MobileNumber = user.MobileNumber,
                        CreatedDate = user.CreatedDate,

                        // Map other properties as needed
                    };
                    if (user.ProfilePicture != null)
                    {
                        var base64String = Convert.ToBase64String(user.ProfilePicture);
                        var dataUrl = $"data:image/jpeg;base64,{base64String}";
                        userModel.ProfilePicture = dataUrl;
                    }

                    // Add user to the list
                    userModels.Add(userModel);
                }

                // Return the list of users
                return userModels;
            }
            catch (Exception ex)
            {
                // Log the exception or handle it accordingly
                Console.WriteLine($"An error occurred: {ex.Message}");
                return null; // Or return an empty list if appropriate
            }
        }



    }
}

    




