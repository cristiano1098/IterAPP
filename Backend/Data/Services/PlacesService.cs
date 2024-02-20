using System.Text.Json;
using System.Text.Json.Serialization;
using Backend.Data.Models;
using Backend.Data.ViewModels.Response;
using Backend.Data.Constants;
using Newtonsoft.Json;
using System.Linq;
using System.Runtime.CompilerServices;
using Backend.Data.ViewModels;

namespace Backend.Data.Services
{
    public class PlacesService
    {

        private readonly AppDbContext _context;

        static readonly HttpClient client = new();
        public PlacesService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Removes a place from the list of interested places
        /// </summary>
        /// <param name="place">Place that is being removed"</param>
        public async Task RemoveInterestedPlace(string placeId, string userName)
        {
            var place = await _context.InterestedPlaces.FindAsync(placeId, userName);
            if (place != null)
            {
                _context.InterestedPlaces.Remove(place);
                await _context.SaveChangesAsync();
            }
        }

        /// <summary>
        /// Removes a place from the list of visited places
        /// </summary>
        /// <param name="place">Place that is being removed"</param>
        public async Task RemoveVisitedPlace(string placeId, string userName)
        {
            var place = await _context.VisitedPlaces.FindAsync(placeId, userName);
            if (place != null)
            {
                _context.VisitedPlaces.Remove(place);
                await _context.SaveChangesAsync();
            }
        }
        /// <summary>
        /// Verifies if the given InterestedPlace exists in the database (IterDb), given the user
        /// </summary>
        /// <param name="place">Id of the place"</param>
        /// <param name="userName">The user</param>
        public bool InterestedPlaceExists(string placeId, string userName)
        {
            var place = _context.InterestedPlaces.Find(placeId, userName);
            if (place != null)
            {
                return true;
            }
            return false;
        }
        /// <summary>
        /// Verifies if the given VisitedPlace exists in the database (IterDb), given the user
        /// </summary>
        /// <param name="place">Id of the place"</param>
        /// <param name="userName">The user</param>
        public bool VisitedPlaceExists(string placeId, string userName)
        {
            var place = _context.VisitedPlaces.Find(placeId, userName);
            if (place != null)
            {
                return true;
            }
            return false;
        }
        /// <summary>
        /// Verifies if a place exists in the Google Places API, given its id
        /// </summary>
        /// <param name="placeId">The id of the place</param>
        public async Task<bool> PlaceExistsinGoogleAPI(string placeId)
        {

            HttpResponseMessage response = await client.GetAsync("https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeId + Common.APIKey.Key);
            var responseString = await response.Content.ReadAsStringAsync();
            Response? result = JsonConvert.DeserializeObject<Response>(responseString);

            if (result != null)
            {
                if (result.Status == "OK")
                {
                    return true;
                }
                else
                {
                    return false;
                }

            }
            return false;

        }
        /// Adds a place to the list of interested places
        /// </summary>
        /// <param name="user">User that adds the place</param>
        /// <param name="placeId">Id of the place that is being added"</param>
        public async Task AddInterestedPlace(string userName, string placeId)
        {
            _context.InterestedPlaces.Add(new InterestedPlace(placeId, userName));
            await _context.SaveChangesAsync();
        }


        /// <summary>
        /// Adds a place to the list of visited places
        /// </summary>
        /// <param name="user">User that adds the place</param>
        /// <param name="placeId">Id of the place that is being added"</param>
        public async Task AddVisitedPlace(string userName, string placeId)
        {
            _context.VisitedPlaces.Add(new VisitedPlace(placeId, userName));
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Lists the places the user has visited
        /// </summary>
        /// <param name="place">The user"</param>
        public async Task<PlacesVM> ListVisitedPlaces(string userName)
        {
            var user = await _context.Users.FindAsync(userName);
            if (user != null)
            {
                var places = user.VisitedPlaces.Select(n => n.PlaceId).ToList();
                return new PlacesVM(places);
            }
            throw new Exception();
        }

        /// <summary>
        /// Lists the places the user has marked as Interested
        /// </summary>
        /// <param name="place">The user"</param>
        public async Task<PlacesVM> ListInterestedPlaces(string userName)
        {
            var user = await _context.Users.FindAsync(userName);
            if (user != null)
            {
                var places = user.InterestedPlaces.Select(n => n.PlaceId).ToList();
                return new PlacesVM(places);
            }
            throw new Exception();
        }

        /// <summary>
        /// Verifies if a place exists in our IterDb, given its id, and returns it
        /// </summary>
        /// <param name="placeId">The id of the place</param>
        /// <returns>A GoogleAPIVM class</returns> 
        public async Task<Result> PlaceExists(String placeId)
        {
            var place = await _context.Places.FindAsync(placeId);

            if (place != null)
            {
                return GetResult(place);
            }
            else
            {
                Result result = await AddPlaceToIterDb(placeId);
                return result;
            }
        }
        
        /// <summary>
        /// Returns the info of a place in same format as the response from a Google API request
        /// </summary>
        /// <param name="place">The place</param>
        /// <returns>"A Result class</returns>
        public Result GetResult(Place place)
        {
            var periodList = new List<ViewModels.Response.Period>();
            var categoryList = new List<String>();
            var photoList = new List<Photo>();
            OpeningHours? openingHours = null;

            if (place.Periods != null)
            {
                foreach (Models.Period p in place.Periods)
                {
                    periodList.Add(new ViewModels.Response.Period(new Close(p.CloseDay, p.CloseTime), new Open(p.OpenDay, p.OpenTime)));
                }
                openingHours = new OpeningHours(periodList);
            }

            foreach (PlaceCategory pc in place.Categories)
            {
                categoryList.Add(pc.CategoryId);
            }

            photoList.Add(new Photo(place.PhotoReference));

            return new Result(place.BusinessStatus, place.PlaceId, new Geometry(new Location(place.Latitude, place.Longitude)), place.Name,
            place.Rating, categoryList, photoList, place.UserRatingsTotal, openingHours, place.AverageVisitTime);
        }

        /// <summary>
        /// Adds a place to the Iterdb, given its id
        /// </summary>
        /// <param name="placeId">The id of the place</param>
        /// <returns>"A Result class</returns>
        public async Task<Result> AddPlaceToIterDb(String placeId)
        {
            HttpResponseMessage response = await client.GetAsync("https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeId + Common.APIKey.Key+"&language=pt");
            var responseString = await response.Content.ReadAsStringAsync();
            Response? result = JsonConvert.DeserializeObject<Response>(responseString);

            if (result != null && result.Result != null && result.Result.Geometry != null && result.Result.Geometry.Location != null && result.Result.Types != null)
            {
                var periodList = new List<Models.Period>();
                var categoryList = new List<PlaceCategory>();


                foreach (String s in result.Result.Types)
                {
                    categoryList.Add(new PlaceCategory(s));
                }

                await AddPlaceCategories(categoryList);

                string photoReference = "";

                if (result.Result.Photos != null && result.Result.Photos[0].Photo_reference != null)
                {
                    photoReference = result.Result.Photos[0].Photo_reference;
                }

                if (result.Result.Opening_hours != null && result.Result.Opening_hours.Periods != null)
                {
                    foreach (ViewModels.Response.Period p in result.Result.Opening_hours.Periods)
                    {
                        if (p.Close != null)
                        {
                            periodList.Add(new Models.Period(p.Open.Day, p.Open.Time, p.Close.Day, p.Close.Time));
                        }
                        else
                        {
                            periodList.Add(new Models.Period(p.Open.Day, p.Open.Time, -1, ""));
                        }
                    }

                    _context.Places.Add(new Place(result.Result.Place_id, result.Result.Name, 60, result.Result.Business_status, result.Result.Rating,
                 result.Result.User_ratings_total, periodList, categoryList, result.Result.Geometry.Location.Lat, result.Result.Geometry.Location.Lng, photoReference));
                    await _context.SaveChangesAsync();

                    var resultPlace = await PlaceExists(placeId);
                    return resultPlace;
                }
                else
                {
                    _context.Places.Add(new Place(result.Result.Place_id, result.Result.Name, 60, result.Result.Business_status, result.Result.Rating,
                  result.Result.User_ratings_total, categoryList, result.Result.Geometry.Location.Lat, result.Result.Geometry.Location.Lng, photoReference));
                    await _context.SaveChangesAsync();

                    var resultPlace = await PlaceExists(placeId);
                    return resultPlace;
                }

            }
            throw new Exception(placeId);
        }

        /// <summary>
        /// Adds a place's categories to the Iterdb
        /// </summary>
        /// <param name="categories">The list of categories</param>
        /// <returns></returns>
        public async Task AddPlaceCategories(List<PlaceCategory> categories)
        {
            foreach (PlaceCategory pc in categories)
            {
                if (await _context.Categories.FindAsync(pc.CategoryId) == null)
                {
                    _context.Categories.Add(new Category(pc.CategoryId));
                }
            }
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Gets a place's photo, given its id
        /// </summary>
        /// <param name="placeId">The id of the place</param>
        /// <returns></returns>
        public async Task<Stream> GetPlacePhoto(String placeId)
        {
            var place = await PlaceExists(placeId);
            if (place != null && place.Photos != null)
            {
                Stream image = await client.GetStreamAsync("https://maps.googleapis.com/maps/api/place/photo?photo_reference=" + place.Photos[0].Photo_reference + Common.APIKey.Key + "&maxwidth=5000");
                return image;
            }
            throw new Exception();
        }

        /// <summary>
        /// Lists the best rated places
        /// </summary>
        public PlacesVM GetHighestRatedPlaces()
        {
            var places = _context.Places.ToList();

            var orderedPlaces = places.OrderByDescending(o => o.Rating);

            var resultList = new List<String>();

            foreach (Place op in orderedPlaces)
            {
                resultList.Add(op.PlaceId);
            }

            return new PlacesVM(resultList);
        }

        /// Lists the most visited places
        /// </summary>
        public PlacesVM GetMostVisitedPlaces()
        {
            var places = _context.Places.ToList();

            var orderedPlaces = places.OrderByDescending(o => o.VisitedPlaces.Count);

            var resultList = new List<String>();

            foreach (Place op in orderedPlaces)
            {
                resultList.Add(op.PlaceId);
            }

            return new PlacesVM(resultList);
        }


    }
}
