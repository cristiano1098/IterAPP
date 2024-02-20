using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Data.Services;
using Backend.Data.Models;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Backend.Data.ViewModels.Response;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlacesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PlacesService _placesService;

        public PlacesController(AppDbContext context, PlacesService placesService)
        {
            _context = context;
            _placesService = placesService;
        }

        /// <summary>
        /// Remove Interested Place
        /// </summary>
        /// <returns></returns>
        [HttpDelete("{placeId}/removeInterestedPlace")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Remove Interested Place", Description = "Removes a place from the list of places the user has marked as Interested")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RemoveInterestedPlace(string placeId)
        {

            bool placeExists = _placesService.InterestedPlaceExists(placeId, GetUserNameFromHeader());
            if (placeExists)
            {
                try
                {
                    await _placesService.RemoveInterestedPlace(placeId, GetUserNameFromHeader());
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

        /// <summary>
        /// Remove Visited Place
        /// </summary>
        /// <returns></returns>
        [HttpDelete("{placeId}/removeVisitedPlace")]
        [SwaggerResponse(200, " Ok")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Remove Visited Place", Description = "Removes a place from the list of places the user has visited")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RemoveVisitedPlace(string placeId)
        {

            bool placeExists = _placesService.VisitedPlaceExists(placeId, GetUserNameFromHeader());
            if (placeExists)
            {
                try
                {
                    await _placesService.RemoveVisitedPlace(placeId, GetUserNameFromHeader());
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

        /// <summary>
        /// List Interested Places
        /// </summary>
        /// <returns>List of places the user has marked as Interested</returns>
        [HttpGet("interested")]
        [SwaggerResponse(200, "Ok")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "List Interested Places", Description = "Lists the places the user has marked as Interested")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> ListInterestedPlaces()
        {
            var list = await _placesService.ListInterestedPlaces(GetUserNameFromHeader());
            if (list != null)
            {
                return Ok(list);
            }
            return NotFound();
        }

        /// <summary>
        /// Add Interested Place
        /// </summary>
        /// <returns></returns>
        [HttpPost("{placeId}/interested")]
        [SwaggerResponse(200, "Ok")]
        [SwaggerResponse(409, "Conflict")]
        [SwaggerOperation(Summary = "Add Interested Place", Description = "Adds a place to the list of places the user has marked as Interested")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddInterestedPlace(string placeId)
        {
            try
            {
                await _placesService.PlaceExists(placeId);

                var verifyPlace = _context.InterestedPlaces.Find(placeId, GetUserNameFromHeader());

                if (verifyPlace == null)
                {
                    await _placesService.AddInterestedPlace(GetUserNameFromHeader(), placeId);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// List Visited Places
        /// </summary>
        /// <returns>List of places the user has marked as Visited</returns>
        [HttpGet("visited")]
        [SwaggerResponse(200, "Ok")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "List Visited Places", Description = "Lists the places the user has marked as Visited")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> ListVisitedPlaces()
        {
            var list = await _placesService.ListVisitedPlaces(GetUserNameFromHeader());
            if (list != null)
            {
                return Ok(list);
            }
            return NotFound();
        }

        /// Add Visited Place
        /// </summary>
        /// <returns></returns>
        [HttpPost("{placeId}/visited")]
        [SwaggerResponse(200, "Ok")]
        [SwaggerOperation(Summary = "Add Visited Place", Description = "Adds a place to the list of places the user has marked as Visited")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddVisitedPlace(string placeId)
        {
            try
            {
                await _placesService.PlaceExists(placeId);

                var verifyPlace = _context.VisitedPlaces.Find(placeId, GetUserNameFromHeader());

                if (verifyPlace == null)
                {
                    await _placesService.AddVisitedPlace(GetUserNameFromHeader(), placeId);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Get Place Info
        /// </summary>
        /// <returns>Information of a place, given its id</returns>
        [HttpGet("{placeId}")]
        [SwaggerResponse(200, "Ok")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Get Place Info", Description = "Given a place's id, returns its information")]
        public async Task<IActionResult> GetPlaceInfo(String placeId)
        {
            try
            {
                Result place = await _placesService.PlaceExists(placeId);
                return Ok(place);
            }
            catch (Exception)
            {
                return BadRequest("Place does not exist in Google API or has incomplete data");
            }
        }
        /// <summary>
        /// Get Place Photo
        /// </summary>
        /// <returns>Photo of a place, given its id</returns>
        [HttpGet("photo/{placeId}")]
        [SwaggerResponse(200, "Ok")]
        [SwaggerResponse(404, "Not Found")]
        [SwaggerOperation(Summary = "Get Place Photo", Description = "Given a place's id, returns its photo")]
        public async Task<IActionResult> GetPlacePhoto(String placeId)
        {
            try
            {
                Stream place = await _placesService.GetPlacePhoto(placeId);
                return Ok(place);
            }
            catch (Exception)
            {
                return BadRequest("Place does not exist in Google API or has incomplete data");
            }
        }

        /// <summary>
        /// Get Highest Rated Places
        /// </summary>
        /// <returns>Highest rated places</returns>
        [HttpGet("highestrated")]
        [SwaggerResponse(200, "Ok")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerOperation(Summary = "Get Highest Rated Places", Description = "Returns the highest rated places")]
        public IActionResult GetHighestRatedPlaces()
        {
            try
            {
                var places = _placesService.GetHighestRatedPlaces();
                return Ok(places);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
        /// Get Most Visited Places
        /// </summary>
        /// <returns>Most visited places</returns>
        [HttpGet("mostvisited")]
        [SwaggerResponse(200, "Ok")]
        [SwaggerResponse(400, "Bad Request")]
        [SwaggerOperation(Summary = "Get Most Visited", Description = "Returns the most visited places")]
        public IActionResult GetMostVisitedPlaces()
        {
            try
            {
                var places = _placesService.GetMostVisitedPlaces();
                return Ok(places);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
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

    }
}
