using Microsoft.AspNetCore.Mvc;
using Backend.Data.Services;
using Backend.Data.Models;
using Backend.Data.ViewModels.Request;
using Backend.Data.ViewModels;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Backend.Data.ViewModels.Response;
using Backend.Data.ViewModels.Types;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly UsersService _usersService;

        public UsersController(UsersService usersService)
        {
            _usersService = usersService;
        }

        /// <summary>
        /// Create User
        /// </summary>
        /// <returns></returns>
        [HttpPost("createAccount")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerOperation(Summary = "Create User", Description = "Create User on DataBase")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserVM user)
        {

            ErrorsVM erros = _usersService.ValidateUser(user);

            if (erros.Errors.Count != 0) return BadRequest(erros);

            try
            {
                await _usersService.AddUser(user);
            }
            catch (System.Data.DataException e)
            {
                return BadRequest(e.StackTrace);
            }


            return Ok();
        }

        /// <summary>
        /// Login
        /// </summary>
        /// <returns></returns>
        [HttpPost("login")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerOperation(Summary = "Login", Description = "User Login")]
        public async Task<IActionResult> PostLogin([FromBody] LoginVM login)
        {

            ErrorsVM erros = _usersService.ValidateLogin(login);

            if (erros.Errors.Count != 0) return BadRequest(erros);

            var log = await _usersService.Login(login);
            if (log == null)
            {
                erros.Errors.Add(new ErrorType("Password", "Password incorreta"));
                return BadRequest(erros);
            }

            return Ok(log);
        }

        /// <summary>
        /// Account
        /// </summary>
        /// <returns></returns>
        [HttpGet("account")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerOperation(Summary = "Account", Description = "User account")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetAccount()
        {

            string user = GetUserNameFromHeader();

            try
            {
                return Ok(await _usersService.GetAccount(user));
            }
            catch (System.Data.DataException e)
            {
                return NotFound(e.StackTrace);
            }


        }


        /// <summary>
        /// Edit Account
        /// </summary>
        /// <returns></returns>
        [HttpPut("account")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerOperation(Summary = "Edit Account", Description = "Edit User account")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> EditAccount([FromBody] UserVM userUpdate)
        {

            string user = GetUserNameFromHeader();
            if (!user.Equals(userUpdate.UserName)) return Unauthorized();

            if (!_usersService.IsValidEmail(userUpdate.Email)) return BadRequest();
            if (userUpdate.Name.Trim().Equals("")) return BadRequest();

            try
            {
                await _usersService.EditAccount(userUpdate);
                return Ok();
            }
            catch (System.Data.DataException e)
            {
                return BadRequest(e.StackTrace);
            }


        }


        /// <summary>
        /// User's routes
        /// </summary>
        /// <returns></returns>
        [HttpGet("routes")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerOperation(Summary = "Routes", Description = "Get public or private routes")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetRoutes([FromQuery(Name = "isPrivate")] string isPrivate)
        {

            string user = GetUserNameFromHeader();

            return isPrivate switch
            {
                "true" => Ok(await _usersService.GetUserRoutes(user, true)),
                "false" => Ok(await _usersService.GetUserRoutes(user, false)),
                _ => BadRequest(),
            };
        }

        /// <summary>
        /// User's profile
        /// </summary>
        /// <returns></returns>
        [HttpGet("{username}")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "User profile", Description = "Get user profile")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetUser(string username)
        {

            string user = GetUserNameFromHeader();

            if (!_usersService.UserExists(username, ""))
            {
                return NotFound();
            }

            try
            {
                return Ok(await _usersService.GetUserProfile(username, user));
            }
            catch (Exception)
            {
                return BadRequest();
            }


        }

        /// <summary>
        /// Follow User
        /// </summary>
        /// <returns></returns>
        [HttpPost("{username}/follow")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Follow user", Description = "Follow user")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> FollowUser(string username)
        {

            string user = GetUserNameFromHeader();

            if (!_usersService.UserExists(username, ""))
            {
                return NotFound();
            }

            try
            {
                await _usersService.FollowUser(username, user);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }


        }

        /// <summary>
        /// Unfollow User
        /// </summary>
        /// <returns></returns>
        [HttpDelete("{username}/unfollow")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Unfollow User", Description = "Unfollow User")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UnfollowUser(string username)
        {

            string user = GetUserNameFromHeader();

            if (!_usersService.UserExists(username, ""))
            {
                return NotFound();
            }

            try
            {
                await _usersService.UnfollowUser(username, user);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }


        }

        /// <summary>
        /// Followers
        /// </summary>
        /// <returns></returns>
        [HttpGet("{username}/followers")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Followers", Description = "Followers")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Followers(string username)
        {
            string user = GetUserNameFromHeader();

            if (!_usersService.UserExists(username, ""))
            {
                return NotFound();
            }

            try
            {
                return Ok(await _usersService.GetFollowers(username, user));
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }

        /// <summary>
        /// Following
        /// </summary>
        /// <returns></returns>
        [HttpGet("{username}/following")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Following", Description = "Following")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Following(string username)
        {
            string user = GetUserNameFromHeader();

            if (!_usersService.UserExists(username, ""))
            {
                return NotFound();
            }

            try
            {
                return Ok(await _usersService.GetFollowing(username, user));
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }

        /// <summary>
        /// Accept Request to Follow
        /// </summary>
        /// <returns></returns>
        [HttpPost("{username}/accept")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Accept request to follow", Description = "Accept request to follow, to do this is necessary to be authenticated")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AcceptRequestToFollow(string username)
        {

            string user = GetUserNameFromHeader();

            if (!_usersService.UserExists(username, ""))
            {
                return NotFound();
            }

            try
            {
                await _usersService.AcceptRequestToFollow(username, user);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }


        }


        /// <summary>
        /// Reject Request to Follow
        /// </summary>
        /// <returns></returns>
        [HttpDelete("{username}/reject")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Reject request to follow", Description = "Reject request to follow, to do this is necessary to be authenticated")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RejectRequestToFollow(string username)
        {

            string user = GetUserNameFromHeader();

            if (!_usersService.UserExists(username, ""))
            {
                return NotFound();
            }

            try
            {
                await _usersService.UnfollowUser(user, username);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }


        }


        /// <summary>
        /// List requests to follow
        /// </summary>
        /// <returns></returns>
        [HttpGet("account/requestsToFollow")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "List requests to follow", Description = "List requests to follow, to do this is necessary to be authenticated")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RequestsToFollow()
        {
            string user = GetUserNameFromHeader();

            try
            {
                return Ok(await _usersService.GetRequestsToFollow(user));
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }

        /// <summary>
        /// Get the userName uncrypted
        /// </summary>
        /// <returns>Returns the userName uncrypted or null.</returns>
        private string GetUserNameFromHeader()
        {
            if (HttpContext.User.Identity is ClaimsIdentity identity)
            {
                var userName = identity.Claims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value;
                if (userName != null)
                {
                    return userName;
                }
            }
            throw new Exception();
        }

        /// <summary>
        /// Search User
        /// </summary>
        /// <returns></returns>
        [HttpGet("search/{searchstring}")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Search user", Description = "Allows a user to search for another user")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult SearchUser(String searchstring)
        {
            try
            {
                var list = _usersService.SearchUser(searchstring);
                return Ok(list);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

    }
}
