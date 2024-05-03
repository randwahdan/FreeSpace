
using FreeSpace.Web.Data;
using FreeSpace.Web.Entities;
using FreeSpace.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using static System.Net.Mime.MediaTypeNames;

namespace FreeSpace.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        protected readonly ApplicationDbContext _dbContext;
        public AuthController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // POST: auth/login
        [AllowAnonymous]
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginUserModel user)
        {
            if (String.IsNullOrEmpty(user.Email))
            {
                return BadRequest(new { message = "Email address needs to entered" });
            }
            else if (String.IsNullOrEmpty(user.Password))
            {
                return BadRequest(new { message = "Password needs to entered" });
            }

            UserInfoModel loggedInUser = Login(user.Email, user.Password);

            if (loggedInUser != null)
            {
                return Ok(loggedInUser);
            }

            return BadRequest(new { message = "User login unsuccessful" });
        }


        [AllowAnonymous]
        [HttpGet("getUser")]
        public IActionResult getUser()
        {
           var userId = Guid.Parse(User.Identity?.Name);

            User? user = _dbContext.Users.FirstOrDefault(c => c.Id == userId);

            UserInfoModel userInfo = new UserInfoModel();

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

            userInfo.Id = user.Id;
            userInfo.Token = user.Token;
            userInfo.FirstName = user.FirstName;
            userInfo.LastName = user.LastName;
            userInfo.Email = user.Email;
            userInfo.Bio = user.Bio;
            userInfo.DateOfBirth = user.DateOfBirth;
            userInfo.Gender = user.Gender;
            userInfo.NickName = user.NickName;
            user.MobileNumber = user.MobileNumber;
            user.CreatedDate = user.CreatedDate;
            user.Country = user.Country;
            if (userInfo != null)
            {
                return Ok(userInfo);
            }

            return BadRequest(new { message = "User login unsuccessful" });
        }

        [HttpGet("CurrentUser")]
        [Authorize]
        public ActionResult CurrentUser()
        {
            return Ok(new
            {
                UserName = User.Identity?.Name,
                Role = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty,
            });
        }


        // POST: auth/register
        [AllowAnonymous]
        [HttpPost("Register")]
        public IActionResult Register([FromBody] RegisterModel user)
        {
            if (String.IsNullOrEmpty(user.FirstName))
            {
                return BadRequest(new { message = "First Name needs to entered" });
            }
            else if (String.IsNullOrEmpty(user.LastName))
            {
                return BadRequest(new { message = "Last Name needs to entered" });
            }
            else if (String.IsNullOrEmpty(user.Email))
            {
                return BadRequest(new { message = "Email needs to entered" });
            }
            else if (String.IsNullOrEmpty(user.Country))
            {
                return BadRequest(new { message = "Country of Residence needs to entered" });
            }
            else if (String.IsNullOrEmpty(user.Password))
            {
                return BadRequest(new { message = "Password needs to entered" });
            }
            else if (!IsValidEmailSyntax(user.Email))
            {
                return BadRequest(new { message = "Invalid email syntax" });
            }
            if (IsEmailAlreadyRegistered(user.Email))
            {
                return BadRequest(new { message = "Email is already registered" });
            }

            User userToRegister = new();
            userToRegister.FirstName = user.FirstName;
            userToRegister.LastName = user.LastName;
            userToRegister.Email = user.Email;
            userToRegister.Country = user.Country;
            userToRegister.Password = user.Password;
            userToRegister.DateOfBirth = user.DateOfBirth;
            userToRegister.Gender = user.Gender;
            userToRegister.CreatedDate = DateTime.UtcNow;


            User registeredUser = Register(userToRegister);

            UserInfoModel loggedInUser = Login(registeredUser.Email, user.Password);

            if (loggedInUser != null)
            {
                return Ok(loggedInUser);
            }

            return BadRequest(new { message = "User registration unsuccessful" });

        }
        private bool IsValidEmailSyntax(string email)
        {
            // Use regular expression for email validation
            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            return Regex.IsMatch(email, pattern);
        }
        private bool IsEmailAlreadyRegistered(string email)
        {
            // Assuming dbContext is an instance of your Entity Framework DbContext
            // and User is the entity representing your user data.

            // Check if any user already has the provided email
            bool isEmailRegistered = _dbContext.Users.Any(u => u.Email == email);

            return isEmailRegistered;
        }

        // GET: auth/test  extracting and returning the claims from  JWT
        [Authorize()]
        [HttpGet("GetClaims")]
        public IActionResult GetClaims()
        {
            string token = Request.Headers["Authorization"];

            if (token.StartsWith("Bearer"))
            {
                token = token.Substring("Bearer ".Length).Trim();
            }
            var handler = new JwtSecurityTokenHandler();

            JwtSecurityToken jwt = handler.ReadJwtToken(token);

            var claims = new Dictionary<string, string>();

            foreach (var claim in jwt.Claims)
            {
                claims.Add(claim.Type, claim.Value);
            }

            return Ok(claims);
        }


        

        private UserInfoModel Login(string email, string password)
        {
            //Check User Credentials
            User? user = _dbContext.Users.FirstOrDefault(c => c.Email == email);



            if (user == null || BCrypt.Net.BCrypt.Verify(password, user.Password) == false)
            {
                return null; //returning null intentionally to show that login was unsuccessful
            }

            //It sets up the configuration for creating a JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("FREE_SPACE_00a46798-71d0-4a85-9c92-c19f6afc4d64");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.GivenName, user.FirstName + user.LastName),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };
            // token creation
            var token = tokenHandler.CreateToken(tokenDescriptor);
            UserInfoModel userInfo = new UserInfoModel();

            //profile and cover picture handling
            if (user.ProfilePicture!=null)
            {
                //convert pfp from Byte[] to dataUrl
                var base64String = Convert.ToBase64String(user.ProfilePicture);
                var dataUrl = $"data:image/jpeg;base64,{base64String}";
                userInfo.ProfilePicture = dataUrl;
            }
           

            if (user.CoverPicture != null)
            {
                //convert cover  from Byte[] to dataUrl

                var base64String = Convert.ToBase64String(user.CoverPicture);
                var dataUrl = $"data:image/jpeg;base64,{base64String}";
                userInfo.CoverPicture = dataUrl;
            }

            var tokenValue = tokenHandler.WriteToken(token);
            user.Token = tokenValue;

            _dbContext.Entry(user).State = EntityState.Modified;
            _dbContext.SaveChanges();

            //Populates the userInfo object with various user information
            userInfo.Id = user.Id;
            userInfo.Token = tokenValue;
            userInfo.FirstName = user.FirstName;
            userInfo.LastName = user.LastName;
            userInfo.Email = user.Email;
            userInfo.Bio = user.Bio;
            userInfo.NickName = user.NickName;
            userInfo.DateOfBirth = user.DateOfBirth;
            userInfo.Gender = user.Gender;
            userInfo.MobileNumber = user.MobileNumber;
            userInfo.CreatedDate = user.CreatedDate;
            userInfo.Country= user.Country;
            return userInfo;
        }

        private User Register(User user)
        {
            // Hash the user's password using BCrypt
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            // Set the user's role to "Normal"
            user.Role = "Normal";

            // Set default paths for profile and cover pictures
            var imagePath = "D:\\GradBackend\\FreeSpace\\FreeSpace.Web\\Images\\defaultProfile.png";
            var imageCoverPath = "D:\\GradBackend\\FreeSpace\\FreeSpace.Web\\Images\\defaultCover.png";
            // Specify the image file name (adjust this based on your file name)

            // Read the image file into a byte array
            byte[] imageBytes = System.IO.File.ReadAllBytes(imagePath);
            byte[] imageCoverBytes = System.IO.File.ReadAllBytes(imageCoverPath);
            user.CoverPicture = imageCoverBytes;
            user.ProfilePicture = imageBytes;
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            return user;
        }

    }
}

