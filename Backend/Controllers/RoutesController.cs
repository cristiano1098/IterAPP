using Microsoft.AspNetCore.Mvc;
using Backend.Data.Models;
using Backend.Data.ViewModels;
using Backend.Data.Services;
using Backend.Data.ViewModels.Response;
using Backend.Data.ViewModels.Request;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using Backend.Data;


namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoutesController : ControllerBase
    {
        public RoutesService _routesService;
        public PlacesService _placesService;
        private readonly AppDbContext _context;

        public RoutesController(RoutesService routesService, AppDbContext context, PlacesService placesService)
        {
            _routesService = routesService;
            _placesService = placesService;
            _context = context;
        }

        /// <summary>
        /// Create Route
        /// </summary>
        /// <returns></returns>
        [HttpPost("createRoute")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(401, "Unauthorized")]
        [SwaggerOperation(Summary = "Create route", Description = "Creates a route in DataBase")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> CreateRoute([FromBody] CreateUseRouteVM route)
        {
            ErrorsVM errors = await _routesService.ValidateRoute(route);

            if (errors.Errors.Count != 0) return BadRequest(errors);

            try
            {
                long routeID = await _routesService.SaveRoute(route, GetUserNameFromHeader());
                return Ok(new RouteIDVM(routeID));
            }
            catch (System.Data.DataException e)
            {
                return BadRequest(e.StackTrace);
            }
        }

        /// <summary>
        /// Generates a route
        /// </summary>
        /// <returns></returns>
        [HttpPost("generateRoute")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerOperation(Summary = "Generates a route", Description = "Generates a route and sends it to the client")]
        public async Task<IActionResult> GenerateRoute([FromBody] GenerateRouteVM routeInfo)
        {
            string? userName;
            try
            {
                userName = GetUserNameFromHeader();

            }
            catch
            {
                userName = null;
            }

            if (routeInfo.Categories.Count != 5)
            {
                return BadRequest("Deve selecionar 5 categorias");
            }

            try
            {
                GeneratedRouteVM res = await _routesService.GenerateRoute(routeInfo, userName!);
                return Ok(res);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);

            }
        }

        /// Edit Route
        /// </summary>
        /// <returns></returns>
        [HttpPost("editRoute")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(401, "Unauthorized")]
        [SwaggerOperation(Summary = "Edit route", Description = "Edits the route in DB")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> EditRoute([FromBody] EditRouteVM route)
        {
            if (_routesService.VerifyRouteUser(route.RouteID, GetUserNameFromHeader()))
            {
                CreateUseRouteVM editedRoute = new(route.Name, route.Places);
                ErrorsVM errors = await _routesService.ValidateRoute(editedRoute);
                if (errors.Errors.Count != 0) return BadRequest(errors);
                try
                {
                    await _routesService.EditRoute(route);
                    return Ok(new RouteIDVM(route.RouteID));
                }
                catch (System.Data.DataException e)
                {
                    return BadRequest(e.StackTrace);
                }
            }
            else
            {
                return Unauthorized();
            }
        }

        /// <summary>
        /// Verify if a route, that is not create, is correct to be use
        /// </summary>
        /// <returns></returns>
        [HttpPost("verifyRoute")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerOperation(Summary = "Verify if a route is correct to be use", Description = "Verify if a route, that is not created in the database is correct to be use")]
        public async Task<IActionResult> VerifyRoute([FromBody] CreateUseRouteVM route)
        {
            ErrorsVM erros = await _routesService.ValidateRoute(route);

            if (erros.Errors.Count != 0) return BadRequest(erros);

            return Ok(route);
        }

        /// <summary>
        /// Displays the route information
        /// </summary>
        /// <returns></returns>
        [HttpGet("{routeID}")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(409, "Conflit")]
        [SwaggerOperation(Summary = "Get route", Description = "Get route's information")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetRoute(long routeID)
        {
            string user = GetUserNameFromHeader();

            if (await _routesService.RouteExists(routeID))
            {
                try
                {
                    var route = await _routesService.GetRoute(user, routeID);
                    return Ok(route);
                }
                catch (UnauthorizedAccessException)
                {
                    return Unauthorized();
                }
                catch (Exception)
                {
                    return Conflict();
                }
            }
            return BadRequest("The route ID isn't valid");
        }

        /// <summary>
        /// Displays the routes of the user's that the authenticated user is following
        /// </summary>
        /// <returns></returns>
        [HttpGet("followingRoutes")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerOperation(Summary = "Get routes", Description = "Get route's information")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetRoutesFollowing()
        {
            return Ok(await _routesService.GetFollowingRoutes(GetUserNameFromHeader()));
        }

        /// List all used routes by the authenticated user
        /// </summary>
        /// <returns></returns>
        [HttpGet("used")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerOperation(Summary = "Get used route", Description = "Get used routes")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetUsedRoutes()
        {
            return Ok(await _routesService.GetUsedRoutes(GetUserNameFromHeader()));

        }

        /// <summary>
        /// Saves the information of the used route in the database
        /// </summary>
        /// <returns></returns>
        [HttpPost("useRoute")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(401, "Unauthorized")]
        [SwaggerOperation(Summary = "Saves the information of the used route", Description = "Saves the information of the used route in the database, to do this is necessary to be authenticated")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UseRoute([FromBody] UsedRouteVM route)
        {
            ErrorsVM errors = await _routesService.VerifyUsedRoute(route);
            if (errors.Errors.Count != 0)
            {
                return BadRequest(errors);
            }
            try
            {

                await _routesService.UseRoute(route, GetUserNameFromHeader());
            }
            catch (System.Data.DataException e)
            {
                return BadRequest(e.StackTrace);
            }
            return Ok();
        }

        /// <summary>
        /// Rate Route
        /// </summary>
        /// <returns></returns>
        [HttpPost("{routeID}/rate")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(401, "Unauthorized")]
        [SwaggerOperation(Summary = "Rate Route", Description = "Allows authenticated users to rate a given route")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RateRoute(long routeID, [FromBody] EvaluateRouteVM rating)
        {
            if (await _routesService.RouteExists(routeID))
            {
                if (rating.Evaluation < 0 || rating.Evaluation > 10)
                {
                    return BadRequest("Invalid rating values");
                }

                try
                {
                    await _routesService.RateRoute(routeID, GetUserNameFromHeader(), rating.Evaluation);
                    return Ok();
                }
                catch (UnauthorizedAccessException)
                {
                    return Unauthorized();
                }
                catch (Exception)
                {
                    return Conflict();
                }

            }
            return BadRequest("The route ID isn't valid");
        }

        /// Marks a route as favorite
        /// </summary>
        /// <returns></returns>
        [HttpPost("{routeId}/favorite")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Unauthorized")]
        [SwaggerOperation(Summary = "Add Favorite Route", Description = "Marks a route as favorite")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddFavoriteRoute(long routeId)
        {
            var verifyRoute = _context.FavoriteRoutes.Find(GetUserNameFromHeader(), routeId);
            if (verifyRoute == null)
            {
                await _routesService.AddFavoriteRoute(routeId, GetUserNameFromHeader());
            }
            return Ok();
        }

        /// <summary>
        /// Remove Favorite Route
        /// </summary>
        /// <returns></returns>
        [HttpDelete("{routeId}/favorite")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Remove Favorite Route", Description = "Removes a route from the list of routes the user has marked as favorite")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RemoveFavoriteRoute(long routeId)
        {
            bool routeExists = _routesService.FavoriteRouteExists(routeId, GetUserNameFromHeader());
            if (routeExists)
            {
                try
                {
                    await _routesService.RemoveFavoriteRoute(routeId, GetUserNameFromHeader());
                    return Ok();
                }
                catch (System.Data.DataException e)
                {
                    return BadRequest(e.StackTrace);
                }
            }
            else
            {
                return NotFound();
            }
        }

        ///<summary>
        /// List Favorite Routes
        /// </summary>
        /// <returns></returns>
        [HttpGet("favorite")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Unauthorized")]
        [SwaggerOperation(Summary = "List Favorite Routes", Description = "Lists the routes the user has marked as favorite")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> ListFavoriteRoutes()
        {
            ListRoutesVM list = await _routesService.GetFavoriteRoutes(GetUserNameFromHeader());
            if (list != null)
            {
                //Esta implementação gera propriedades de Task irrelevantes na resposta JSON -> var resultList = list.FavoriteRoutes.Select(async obj => await _routesService.GetRoute(GetUserNameFromHeader(), obj)).ToList();
                /*var resultList = new List<RouteVM>();

                foreach (long fr in list.FavoriteRoutes)
                {
                    resultList.Add(await _routesService.GetRoute(GetUserNameFromHeader(), fr));
                }*/

                return Ok(list);
            }
            return NotFound();
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
        /// Search Route
        /// </summary>
        /// <returns></returns>
        [HttpGet("search/{searchstring}")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(401, "Not Authorized")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Search route", Description = "Allows a user to search for a route")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> SearchRoute(String searchstring)
        {
            try
            {
                var list = await _routesService.SearchRoute(searchstring, GetUserNameFromHeader());
                return Ok(list);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
        /// <summary>
        /// Comment Route
        /// </summary>
        /// <returns></returns>
        [HttpPost("{routeId}/commentRoute")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerResponse(401, "Unauthorized")]
        [SwaggerOperation(Summary = "Comment Route", Description = "Allows authenticated users to publish comments on a given route")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> CommentRoute(long routeId, [FromBody] CommentRouteVM comment)
        {
            if (await _routesService.RouteExists(routeId))
            {
                try
                {
                    await _routesService.CommentRoute(routeId, comment.Comment, GetUserNameFromHeader());
                    return Ok();
                }
                catch (UnauthorizedAccessException)
                {
                    return Unauthorized();
                }
                catch (Exception)
                {
                    return Conflict();
                }

            }
            return BadRequest("The route ID isn't valid");
        }

        /// <summary>
        /// Get Highest Rated
        /// </summary>
        /// <returns>List of the highest rated routes</returns>
        [HttpGet("highestrated")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerOperation(Summary = "Get Highest Rated", Description = "Returns a list of the highest rated routes")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetHighestRatedRoutes()
        {
            try
            {
                var routes = await _routesService.GetHighestRatedRoutes(GetUserNameFromHeader());
                return Ok(routes);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}
