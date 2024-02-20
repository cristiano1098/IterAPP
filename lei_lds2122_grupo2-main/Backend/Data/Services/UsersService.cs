using Backend.Data.ViewModels;
using Backend.Data.Models;
using Backend.Data.ViewModels.Request;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Backend.Data.ViewModels.Response;
using System.Text;
using Backend.Data.ViewModels.Types;
using Backend.Data.Enumerations;
using System.Linq;
using System.Runtime.ExceptionServices;

namespace Backend.Data.Services
{
    public class UsersService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly RoutesService _routesService;

        public UsersService(IConfiguration configuration, AppDbContext context, RoutesService routesService)
        {
            _context = context;
            _configuration = configuration;
            _routesService = routesService;
        }

        /// <summary>
        /// Create an user in db
        /// </summary>
        /// <param name="user">User that want create in db</param>
        public async Task AddUser(CreateUserVM user)
        {

            var _user = new User(user.UserName, user.Name, user.BirthDate,
             user.Email, BCrypt.Net.BCrypt.HashPassword(user.Password), false, "", "");
            _context.Users.Add(_user);

            await _context.SaveChangesAsync();

        }

        /// <summary>
        /// Get an UserVM to view account details
        /// </summary>
        /// <param name="userName">UserName of the user that want UserVM</param>
        /// <returns>UserVM that represents an user</returns>
        public async Task<UserVM> GetAccount(string userName)
        {

            var userDB = await _context.Users.FindAsync(userName);
            if (userDB != null)
            {
                return new UserVM(userDB.UserName, userDB.Email,
                         userDB.Name, userDB.BirthDate, userDB.PrivateProfile, userDB.Description, userDB.ProfilePhoto);

            }
            throw new Exception();

        }

        /// <summary>
        /// Edit an account
        /// </summary>
        /// <param name="user">UserVm to update account</param>
        public async Task EditAccount(UserVM user)
        {
            var userDB = _context.Users.Find(user.UserName);
            if (userDB != null)
            {
                userDB.UserName = user.UserName;
                userDB.Name = user.Name;
                userDB.Email = user.Email;
                userDB.BirthDate = user.BirthDate;
                userDB.PrivateProfile = user.PrivateProfile;
                userDB.ProfilePhoto = user.ProfilePhoto;
                userDB.Description = user.Description;
                await _context.SaveChangesAsync();
            }

        }

        /// <summary>
        /// API login to get authentication token
        /// </summary>
        /// <param name="login">LoginVM with authentication credentials</param>
        public async Task<TokenVM?> Login(LoginVM login)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == login.Email);
            if (user != null)
            {
                bool isValidPassword = BCrypt.Net.BCrypt.Verify(login.Password, user.Password);
                if (isValidPassword)
                {
                    return new TokenVM(GenerateToken(user.UserName), user.UserName);
                }
                return null;
            }
            throw new Exception();
        }



        /// <summary>
        /// Get user´s private routes
        /// </summary>
        /// <param name="userName">UserName of the user that want the routes</param>
        /// <returns>ListRoutesVM that represents a list of routes</returns>
        public async Task<ListRoutesVM> GetUserRoutes(string userName, Boolean isPrivate)
        {

            var userDB = await _context.Users.FindAsync(userName);

            if (userDB != null)
            {
                return new ListRoutesVM(GetListRoutes(userDB, userDB, isPrivate));
            }
            throw new Exception();

        }

        /// <summary>
        /// Get user profile
        /// </summary>
        /// <param name="userProfile">UserName of the user profile</param>
        /// <param name="userName">UserName of the user that want the userprofile</param>
        /// <returns>USerProfileVM that represents the user profile</returns>
        public async Task<UserProfileVM> GetUserProfile(string userProfile, string userName)
        {

            var userDB = await _context.Users.FindAsync(userProfile);
            var userRequest = await _context.Users.FindAsync(userName);


            if (userDB != null && userRequest != null)
            {
                UserProfileVM profile = new(userProfile, userDB.Name, userDB.PrivateProfile,
                userDB.Description, userDB.ProfilePhoto, new(), userDB.Followed.Where(n => n.State == FollowStatus.Accepted).Count(), userDB.Follow.Where(n => n.State == FollowStatus.Accepted).Count(), -1);
                var follow = userRequest.Follow.FirstOrDefault(n => n.Followed == userProfile);
                if (!userDB.PrivateProfile
                    || follow != null || userProfile.Equals(userName))
                {
                    profile.PublicRoutes = GetListRoutes(userDB, userRequest, false);
                }
                if (follow != null)
                {
                    profile.FollowState = (int)follow.State;
                }

                return profile;
            }
            throw new Exception();

        }

        /// <summary>
        /// Follow user
        /// </summary>
        /// <param name="userFollow">UserName of who will be followed</param>
        /// <param name="userName">Username of who wants to follow</param>
        /// <exception cref="Exception">Exception if users do not exist 
        /// in the database or if the parameters are the same</exception>
        public async Task FollowUser(string userFollow, string userName)
        {

            var user = await _context.Users.FindAsync(userFollow);
            var userRequest = await _context.Users.FindAsync(userName);

            if (user != null && userRequest != null && !userFollow.Equals(userName))
            {
                userRequest.Follow.Add(new Follow(userName, userFollow, FollowStatus.Pending));

                await _context.SaveChangesAsync();
                if (user.PrivateProfile == false)
                {
                    var request = await _context.Follow.FirstAsync(n => n.Follower.Equals(userName) && n.Followed.Equals(userFollow));
                    if (request != null) request.State = FollowStatus.Accepted;

                }
                await _context.SaveChangesAsync();

            }
            else
            {
                throw new Exception();
            }

        }

        /// <summary>
        /// Unfollow user
        /// </summary>
        /// <param name="userFollow">Username of the followed</param>
        /// <param name="userName">Follower username</param>
        /// <exception cref="Exception">Exception if users do not exist 
        /// in the database or if the parameters are the same</exception>
        public async Task UnfollowUser(string userFollow, string userName)
        {

            var user = await _context.Users.FindAsync(userFollow);
            var userRequest = await _context.Users.FindAsync(userName);

            if (user != null && userRequest != null && !userFollow.Equals(userName))
            {
                var follow = await _context.Follow.FindAsync(userName, userFollow);
                if (follow == null)
                {
                    throw new Exception();
                }
                _context.Follow.Remove(follow);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception();
            }

        }

        /// <summary>
        /// Followers
        /// </summary>
        /// <param name="userProfile">UserName to search your followers</param>
        /// <param name="userName">Username of the user who wants to obtain the information</param>
        /// <returns>FollowVM that represents the followers list</returns>
        public async Task<FollowVM> GetFollowers(string userFollowers, string userName)
        {

            var user = await _context.Users.FindAsync(userFollowers);
            var userRequest = await _context.Users.FindAsync(userName);
            FollowVM result = new(new());

            if (user != null && userRequest != null)
            {
                var list = user.Followed.Where(n => n.State == FollowStatus.Accepted).Select(n => new FollowType(n.UserFollower.UserName,
                n.UserFollower.Name, userRequest.Follow.Exists(f => f.Followed == n.UserFollower.UserName && f.State == FollowStatus.Accepted),
                 n.UserFollower.ProfilePhoto)).ToList();
                result.Follow = list;

                return result;
            }
            else
            {
                throw new Exception();
            }

        }

        /// <summary>
        /// Following
        /// </summary>
        /// <param name="userProfile">UserName to search for the people that this user follows</param>
        /// <param name="userName">Username of the user who wants to obtain the information</param>
        /// <returns>FollowVM that represents the following list</returns>
        public async Task<FollowVM> GetFollowing(string userFollowers, string userName)
        {

            var user = await _context.Users.FindAsync(userFollowers);
            var userRequest = await _context.Users.FindAsync(userName);
            FollowVM result = new(new());

            if (user != null && userRequest != null)
            {
                var list = user.Follow.Where(n => n.State == FollowStatus.Accepted).Select(n => new FollowType(n.UserFollowed.UserName,
                n.UserFollowed.Name, userRequest.Follow.Exists(f => f.Followed == n.UserFollowed.UserName && f.State == FollowStatus.Accepted),
                 n.UserFollowed.ProfilePhoto)).ToList();
                result.Follow = list;

                return result;
            }
            else throw new Exception();


        }

        /// <summary>
        /// Accept request to follow
        /// </summary>
        /// <param name="userFollow">Name of the user who made the request</param>
        /// <param name="userName">Name of the user who will accept the request</param>
        /// <exception cref="Exception">If occurs an error related to the DB</exception>
        public async Task AcceptRequestToFollow(string userFollow, string userName)
        {

            var user = await _context.Users.FindAsync(userFollow);
            var userRequest = await _context.Users.FindAsync(userName);

            if (user != null && userRequest != null && !userFollow.Equals(userName))
            {
                var request = userRequest.Followed.Find(n => n.State == FollowStatus.Pending && n.Follower.Equals(userFollow));

                if (request == null) throw new Exception();


                request.State = FollowStatus.Accepted;
                await _context.SaveChangesAsync();
            }
            else throw new Exception();


        }

        /// <summary>
        /// Returns a list of requests to follow
        /// </summary>
        /// <param name="userName">Name of the user trying to get the request list</param>
        /// <returns>A FollowVm object with a list of requests to follow</returns>
        /// <exception cref="Exception">If occurs an error related to the DB</exception>
        public async Task<FollowVM> GetRequestsToFollow(string userName)
        {


            var user = await _context.Users.FindAsync(userName);
            FollowVM result = new(new());

            if (user != null)
            {
                var list = user.Followed.Where(n => n.State == FollowStatus.Pending).Select(n => new FollowType(n.UserFollower.UserName,
                n.UserFollower.Name, user.Follow.Exists(f => f.Followed == n.UserFollower.UserName),
                 n.UserFollower.ProfilePhoto)).ToList();
                result.Follow = list;

                return result;
            }
            else throw new Exception();


        }


        /// <summary>
        /// Return a list of routes
        /// </summary>
        /// <param name="user">User from whom you want the routes</param>
        /// <param name="userRequest">User thart want the routes</param>
        /// <param name="isPrivate">Specify private or public routes</param>
        /// <returns>Return a list of RouteResumeType</returns>
        private List<RouteResumeType> GetListRoutes(User user, User userRequest, Boolean isPrivate)
        {
            List<RouteResumeType> list = new();
            var routes = user.Routes.Where(n => n.IsPrivate == isPrivate).ToList();
            var visitedRoutes = userRequest.VisitedRoutes;
            var evaluationRoutes = userRequest.RouteEvaluations;
            var favouriteRoutes = userRequest.FavoriteRoutes;

            foreach (Models.Route route in routes)
            {
                var evaluationUser = evaluationRoutes.Find(n => n.RouteId == route.Id);

                RouteResumeType routeData = new(route.Name, user.UserName,
                user.ProfilePhoto, favouriteRoutes.Exists(n => n.RouteId == route.Id),
                visitedRoutes.Exists(n => n.RouteId == route.Id), -1, route.Id,
                _routesService.RouteAverageRating(route), route.Description,
                 route.RouteVisited.Count, _routesService.ConvertPlacesToRoutePlaceType(route.Places.ToList()));

                if (evaluationUser != null) routeData.UserEvaluation = evaluationUser.Evaluation;

                list.Add(routeData);
            }
            return list;
        }

        /// <summary>
        /// Verify if an user exists in db
        /// </summary>
        /// <param name="userName">userName of the user that want verify in db</param>
        /// <param name="email">email of the user that want verify in db</param>
        /// <returns>Return true if exists in db;
        /// Return false if doesn´t exist in db;</returns>
        public bool UserExists(string userName, string email)
        {
            return _context.Users.Any(e => userName.Equals(e.UserName)) || _context.Users.Any(e => email.Equals(e.Email));
        }

        /// <summary>
        /// Verify if the email is valid
        /// </summary>
        /// <param name="email">Email to validate</param>
        /// <returns>Return true if email is valid;
        /// Return false if email isn't valid;</returns>
        public bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z", RegexOptions.IgnoreCase);
        }


        /// <summary>
        /// Generate JW Token
        /// </summary>
        /// <param name="username"> Username to encrypt</param>
        /// <returns>String with Token</returns>
        private string GenerateToken(string username)
        {
            var claims = new[]
           {
            new Claim(ClaimTypes.NameIdentifier, username),

        };

            var token = new JwtSecurityToken
            (

                issuer: _configuration.GetValue<string>("Jwt:Issuer"),
                audience: _configuration.GetValue<string>("Jwt:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(60),
                notBefore: DateTime.UtcNow,
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>("Jwt:Key"))),
                    SecurityAlgorithms.HmacSha256)
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return tokenString;
        }


        /// <summary>
        /// Verify if CreateUserVM is valid
        /// </summary>
        /// <param name="user">CreateUserVM to validate</param>
        /// <returns>An ErrorsVM object with errors , or an empty on if there aren't any errors</returns>
        public ErrorsVM ValidateUser(CreateUserVM user)
        {
            List<ErrorType> errors = new();

            if (user.Name.Trim().Equals("")) errors.Add(new ErrorType("Name", "Name inválido"));

            if (user.Password.Trim().Equals("")) errors.Add(new ErrorType("Password", "Password inválida"));

            if (user.UserName.Trim().Equals(""))
            {
                errors.Add(new ErrorType("UserName", "UserName inválido"));
            }
            else
            {
                if (UserExists(user.UserName, "")) errors.Add(new ErrorType("UserName", "UserName já utilizado"));

            }
            if (!IsValidEmail(user.Email))
            {
                errors.Add(new ErrorType("Email", "Email inválido"));
            }
            else
            {
                if (UserExists("", user.Email)) errors.Add(new ErrorType("Email", "Email já utilizado"));

            }


            return new ErrorsVM(errors);
        }

        /// <summary>
        /// Verify if VM is valid
        /// </summary>
        /// <param name="user">LoginVM to validate</param>
        /// <returns>An ErrorsVM object with errors , or an empty on if there aren't any errors</returns>
        public ErrorsVM ValidateLogin(LoginVM login)
        {
            List<ErrorType> errors = new();

            if (!IsValidEmail(login.Email))
            {
                errors.Add(new ErrorType("Email", "Email inválido"));
            }
            else
            {
                if (!UserExists("", login.Email)) errors.Add(new ErrorType("Email", "Email não existente"));
            }
            if (login.Password.Trim().Equals("")) errors.Add(new ErrorType("Password", "Password inválida"));
            return new ErrorsVM(errors);
        }

        /// <summary>
        /// Allows a user to search for another user
        /// </summary>
        /// <param name="username">The username of the user that is being searched for</param>
        /// <returns></returns>
        public UserSearchListVM SearchUser(String username)
        {
            var userList = new UserSearchListVM();
            Regex rx = new(username, RegexOptions.IgnoreCase);

            foreach (User u in _context.Users)
            {
                if (u != null)
                {
                    if (rx.IsMatch(u.UserName))
                    {
                        userList.Users.Add(new UserResultVM(u.UserName, u.Name, u.ProfilePhoto));
                    }
                }
            }
            return userList;
        }

    }
}
