using System.Text.RegularExpressions;
using Backend.Data.Constants;
using Backend.Data.Enumerations;
using Backend.Data.Models;
using Backend.Data.ViewModels;
using Backend.Data.ViewModels.Request;
using Backend.Data.ViewModels.Response;
using Backend.Data.ViewModels.Types;
using Newtonsoft.Json;

namespace Backend.Data.Services
{

    public class RoutesService
    {
        private readonly AppDbContext _context;

        static readonly HttpClient client = new();
        private readonly PlacesService _placesService;

        public RoutesService(AppDbContext context, PlacesService placesService)
        {
            this._context = context;
            this._placesService = placesService;
        }

        /// <summary>
        /// Creates a route in the database
        /// </summary>
        /// <param name="route">The route to be created in the database</param>
        /// <param name="userName">The user that is creating the route</param>
        /// <returns></returns>
        public async Task<long> SaveRoute(CreateUseRouteVM route, string userName)
        {
            List<RoutePlace> placesList = ConvertToRoutePlace(route.Places);

            var _route = new Backend.Data.Models.Route(route.Name, false,
            "", DateTime.Now, userName)
            {
                Places = placesList
            };

            _context.Routes.Add(_route);
            await _context.SaveChangesAsync();
            return _route.Id;
        }

        /// <summary>
        /// Generates a route
        /// </summary>
        /// <param name="routeInfo">Info about the route to be generate</param>
        /// <param name="userName">User name of the authenticated user or null if the user is not authenticated</param>
        /// <returns></returns>
        /// <exception cref="Exception">If is not possible to access to the google api response</exception>
        public async Task<GeneratedRouteVM> GenerateRoute(GenerateRouteVM routeInfo, string userName)
        {
            HttpResponseMessage response = await client.GetAsync("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=41.442535%2C-8.2917857&radius=7500" + Common.APIKey.Key);
            string responseBody = await response.Content.ReadAsStringAsync();
            Response? placesAPI = JsonConvert.DeserializeObject<Response>(responseBody);

            if (placesAPI != null && placesAPI.Results != null)
            {
                placesAPI = await GetPlacesNextPage(placesAPI);

                List<Result> places = await PlacesSuggestion(routeInfo, placesAPI, userName);

                if (userName != null && !routeInfo.VisitedPlaces)
                {
                    places = await RemoveVisitedPlaces(places, userName);
                }

                GeneratedRouteVM generatedRoute = CreateRoute(routeInfo, places);

                return generatedRoute;
            }
            throw new Exception("Erro na exceção do método gerar rota");
        }

        /// <summary>
        /// Removes all visited places by the user of the list
        /// </summary>
        /// <param name="places">List of places</param>
        /// <param name="userName">User name of authenticated user</param>
        /// <returns>List without the visited places</returns>
        public async Task<List<Result>> RemoveVisitedPlaces(List<Result> places, string userName)
        {
            PlacesVM visitedPlaces = await _placesService.ListVisitedPlaces(userName);

            places.RemoveAll(p => visitedPlaces.Places.Contains(p.Place_id));
            return places;
        }

        /// <summary>
        /// Creates a route
        /// </summary>
        /// <param name="routeInfo">Info about the route to be created</param>
        /// <param name="places">List of places for the route</param>
        /// <returns></returns>
        public GeneratedRouteVM CreateRoute(GenerateRouteVM routeInfo, List<Result> places)
        {
            List<RoutePlaceType> route = new();
            int totalNumberOfPeriods = (routeInfo.FinishTime.Hour * 60 + routeInfo.FinishTime.Minute - (routeInfo.StartTime.Hour * 60 + routeInfo.StartTime.Minute)) / 20;
            int i = 0, occupiedPeriods = 0;
            bool complete = false;
            List<Result> suggestedPlaces = places;
            TimeSpan currentTime = new(routeInfo.StartTime.Hour, routeInfo.StartTime.Minute, 0);


            while (!complete && (i < places.Count))
            {
                double doubleNumberOfPeriods = (double)suggestedPlaces[i].AverageVisitTime / 20;
                int numberOfPeridos = (int)Math.Truncate(doubleNumberOfPeriods);

                if ((doubleNumberOfPeriods - numberOfPeridos) != 0)
                {
                    numberOfPeridos++;
                }

                if (numberOfPeridos <= (totalNumberOfPeriods - occupiedPeriods))
                {
                    TimeSpan visitTime = TimeSpan.FromMinutes(numberOfPeridos * 20);
                    DateTime startVisit = new(routeInfo.StartTime.Year, routeInfo.StartTime.Month, routeInfo.StartTime.Day, currentTime.Hours, currentTime.Minutes, currentTime.Seconds);

                    currentTime += visitTime;
                    DateTime finishVisit = new(routeInfo.StartTime.Year, routeInfo.StartTime.Month, routeInfo.StartTime.Day, currentTime.Hours, currentTime.Minutes, currentTime.Seconds);

                    RoutePlaceType routePlace = new(suggestedPlaces[i].Place_id, startVisit, finishVisit);
                    route.Add(routePlace);
                    occupiedPeriods += numberOfPeridos;

                    if (occupiedPeriods < totalNumberOfPeriods)
                    {
                        TimeSpan intervalTime = TimeSpan.FromMinutes(20);
                        currentTime += intervalTime;
                        occupiedPeriods++;
                    }
                    else
                    {
                        complete = true;
                    }
                    suggestedPlaces.RemoveAt(i);
                }
                else
                {
                    i++;
                }
            }

            List<string> possiblePlaces = new();

            foreach (Result place in places)
            {
                possiblePlaces.Add(place.Place_id);
            }

            return new GeneratedRouteVM(routeInfo.Name, routeInfo.StartTime, new DateTime(routeInfo.StartTime.Year, routeInfo.StartTime.Month, routeInfo.StartTime.Day, currentTime.Hours, currentTime.Minutes, currentTime.Seconds), route, possiblePlaces);

        }

        /// <summary>
        /// Gets the places from the next page and adds to the list. It also changes the nextpage token from the given list
        /// </summary>
        /// <param name="actualList">The list in which we want to add the new places</param>
        /// <returns>A list with the places from the next page and a new net page token , in case it exists, or null in case it doesn't</returns>
        public async Task<Response> GetPlacesNextPage(Response actualList)
        {
            if (actualList.Next_page_token != null)
            {
                HttpResponseMessage response = await client.GetAsync("https://maps.googleapis.com/maps/api/place/textsearch/json?location=41.442535%2C-8.2917857&type=tourist_attraction&radius=7500" + Common.APIKey.Key + "&pagetoken=" + actualList.Next_page_token);
                string responseBodyNextPage = await response.Content.ReadAsStringAsync();
                Response? nextPage = JsonConvert.DeserializeObject<Response>(responseBodyNextPage);

                if (nextPage != null && nextPage.Results != null)
                {
                   
                    if (actualList.Results != null)
                    {
                        foreach (Result result in nextPage.Results)
                        {
                            actualList.Results.Add(result);
                        }
                    }
                   
                    if (nextPage.Next_page_token != null)
                    {
                        actualList.Next_page_token = nextPage.Next_page_token;
                    }
                    else
                    {
                        actualList.Next_page_token = null;
                    }
                }
            }
            return actualList;
        }

        /// <summary>
        /// Organizes the places according with user's preferences
        /// </summary>
        /// <param name="routeInfo">Information about the route to be generated</param>
        /// <param name="places">Places to be organized</param>
        /// <returns>A list with places organized by user's preferences</returns>
        private async Task<List<Result>> PlacesSuggestion(GenerateRouteVM routeInfo, Response places, string userName)
        {
            var interestedPlaces = new PlacesVM(new List<String>());
            List<CategoryScore> favouriteCategories = new();

            if (userName != null)
            {
                interestedPlaces = await _placesService.ListInterestedPlaces(userName);
                favouriteCategories = MostProbablyToLikeCategories(userName);

            }
            if (places.Results != null)
            {
                List<Result> resultList = new();

                foreach (Result placeList in places.Results)
                {
                    Result place = await _placesService.PlaceExists(placeList.Place_id);

                    
                    if (place.Types != null && VerifyPlaceAvailable(place, routeInfo.StartTime, routeInfo.FinishTime) && place.Place_id != null)
                    {
                        double categoriesScore = CalculateCategoriesScore(routeInfo.Categories, place.Types);
                        double placeGoogleRating = 0;

                        if (place.Rating != null)
                        {
                            placeGoogleRating = place.Rating.Value;
                        }

                        if (userName != null)
                        {
                          
                            place.SuggestionScore += categoriesScore * 0.20 + placeGoogleRating * 0.20;

                            if (interestedPlaces.Places.Contains(place.Place_id)) place.SuggestionScore += 5 * 0.275;

                            double scoreCategories = 0;

                            foreach (CategoryScore categoryScore in favouriteCategories)
                            {
                                if (place.Types.Contains(categoryScore.CategoryName)) scoreCategories += categoryScore.Score;
                            }

                            place.SuggestionScore += scoreCategories * 0.325;
                        }
                        else
                        {
                            place.SuggestionScore += categoriesScore * 0.70 + placeGoogleRating * 0.30;

                        }
                        resultList.Add(place);
                    }
                }
                resultList.Sort(ComparePlacesScore);
                resultList.Reverse();

                return resultList;
            }
            return new List<Result>();
        }
        /// <summary>
        /// Calculates what are the categories most likekly for the user to like
        /// </summary>
        /// <param name="userName">Name of the authenticated user</param>
        /// <returns>A list with most probably to like categories</returns>
        private List<CategoryScore> MostProbablyToLikeCategories(string userName)
        {
            List<string> categories = new();
            List<CategoryScore> categoriesScore = new();
            int i = 0;

            List<VisitedPlace> visitedPlaces = _context.VisitedPlaces.Where(vp => vp.UserName.Equals(userName)).ToList();

            foreach (VisitedPlace visitedPlace in visitedPlaces)
            {
                List<PlaceCategory> placeCategory = visitedPlace.Place.Categories.ToList();
                List<string> placeCategories = placeCategory.Select(p => p.Category.CategoryId).ToList();
                categories.AddRange(placeCategories);
            }

            List<InterestedPlace> interestedPlaces = _context.InterestedPlaces.Where(ip => ip.UserName.Equals(userName)).ToList();

            foreach (InterestedPlace interestedPlace in interestedPlaces)
            {
                List<PlaceCategory> placeCategory = interestedPlace.Place.Categories.ToList();
                List<string> placeCategories = placeCategory.Select(p => p.Category.CategoryId).ToList();
                categories.AddRange(placeCategories);
            }

            while (i < categories.Count)
            {
                string category = categories[i];
                int count = categories.Where(c => c.Equals(category)).Select(c => c).Count();
                categoriesScore.Add(new(category, count));
                categories.RemoveAll(c => c.Equals(category));
                i++;
            }

            categoriesScore.Sort(CompareCategoriesScore);
            categoriesScore.Reverse();

            if (categoriesScore.Count != 0)
            {
                double maxValue = categoriesScore[0].Score;

                foreach (CategoryScore categoryScore in categoriesScore)
                {
                    categoryScore.Score = 5 * categoryScore.Score / maxValue;
                }
            }
            return categoriesScore;
        }

        /// <summary>
        /// Calculates the score of a place according to a list of most like categories and place's categories
        /// </summary>
        /// <param name="categories">List of most liked categories</param>
        /// <param name="placeCategories">List of categories that the place has</param>
        /// <returns>The place's score</returns>
        public double CalculateCategoriesScore(List<string> categories, List<string> placeCategories)
        {
            double score = 0;

            if (placeCategories.Contains(categories[0]))
            {
                score += 5;
            }
            if (placeCategories.Contains(categories[1]))
            {
                score += 4;
            }
            if (placeCategories.Contains(categories[2]))
            {
                score += 3;
            }
            if (placeCategories.Contains(categories[3]))
            {
                score += 2;
            }
            if (placeCategories.Contains(categories[4]))
            {
                score += 1;
            }
            return score;
        }

        /// <summary>
        /// Verify if a given place is available in route's schedule. Because there are places that don't have information 
        /// about their schedule, that places are considered available. A place isn't available if it has the period information and if the shcedule is not 
        /// compatible with route's schedule.
        /// </summary>
        /// <param name="place">Place to verify</param>
        /// <param name="startTime">Route's start time</param>
        /// <param name="finishTime">Route's finish time</param>
        /// <returns>True if the place is available or false if it isn't</returns>
        public bool VerifyPlaceAvailable(Result place, DateTime startTime, DateTime finishTime)
        {
            int startDay = (int)startTime.DayOfWeek;
            string startTimeMinutes = startTime.Minute.ToString();
            string finishTimeMinutes = finishTime.Minute.ToString();

            if (startTimeMinutes.Length < 2)
            {
                startTimeMinutes += "0";
            }

            if (finishTimeMinutes.Length < 2)
            {
                finishTimeMinutes += "0";
            }

            int convertedStartHours = Int32.Parse(startTime.Hour.ToString() + startTimeMinutes);
            int convertedFinishHours = Int32.Parse(finishTime.Hour.ToString() + finishTimeMinutes);

            bool isValid = false;
            bool found = false;
            int numberOfPeriods;


            if (place.Business_status != null && !place.Business_status.Equals("OPERATIONAL"))
            {
                isValid = false;
            }
            else
            {
                if (place.Opening_hours != null && place.Opening_hours.Periods != null && place.Opening_hours.Periods.Count != 0)
                {
                    numberOfPeriods = place.Opening_hours.Periods.Count;
                    int iterator = numberOfPeriods;

                    while (!found && iterator > 0)
                    {
                        iterator--;
                        ViewModels.Response.Period period = place.Opening_hours.Periods[iterator];

                        if (period.Open != null && period.Close != null && period.Open.Time != null && period.Close.Time != null)
                        {
                            if (numberOfPeriods == 1 && period.Close.Day == -1)
                            {
                                isValid = true;
                                found = true;
                            }
                            else
                            {
                                if (period.Open.Day == startDay)
                                {
                                    if (Int32.Parse(period.Open.Time) < convertedFinishHours && Int32.Parse(period.Close.Time) > convertedStartHours)
                                    {
                                        isValid = true;
                                        found = true;
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    isValid = true;
                }
            }
            return isValid;
        }

        /// <summary>
        /// Converts a places list to a routePlace list
        /// </summary>
        /// <param name="places">List of places</param>
        /// <returns>A RoutePlace list</returns>
        public List<RoutePlace> ConvertToRoutePlace(List<RoutePlaceType> places)
        {
            List<RoutePlace> placesList = new();

            foreach (RoutePlaceType place in places)
            {
                placesList.Add(new RoutePlace(place.IdPlace, place.StartTime, place.FinishTime));
            }
            return placesList;
        }
        /// <summary>
        /// Edits a given route
        /// </summary>
        /// <param name="route">Edited route</param>
        /// <returns></returns>
        public async Task EditRoute(EditRouteVM route)
        {
            var routeDB = await _context.Routes.FindAsync(route.RouteID);
            List<RoutePlace> placesList = ConvertToRoutePlace(route.Places);

            if (routeDB != null)
            {
                foreach (RoutePlace place in routeDB.Places)
                {
                    _context.RoutePlaces.Remove(place);
                }
                routeDB.IsPrivate = route.PrivateRoute;
                routeDB.Description = route.Description;
                routeDB.Name = route.Name;
                routeDB.Places = placesList;
                await _context.SaveChangesAsync();
            }
        }
        /// <summary>
        /// Verify if a route belogns to a user
        /// </summary>
        /// <param name="routeID">Route's id</param>
        /// <param name="userName">User name</param>
        /// <returns>true if belongs or false if it doesn't</returns>
        public bool VerifyRouteUser(long routeID, string userName)
        {
            return _context.Routes.Any(r => r.Id == routeID && r.UserName.Equals(userName));
        }


        /// <summary>
        /// Returns the route resume of all route of users that the authenticated user is following
        /// </summary>
        /// <param name="userName">User who is requesting data</param>
        /// <returns>List with all routes</returns>
        public async Task<ListRoutesVM> GetFollowingRoutes(string userName)
        {
            List<RouteResumeType> routes = new();
            FollowVM following = await GetFollowing(userName, userName);

            foreach (FollowType userFollowing in following.Follow)
            {
                List<Models.Route> userRoutes = _context.Routes.Where(u => u.UserName.Equals(userFollowing.UserName)).ToList();

                foreach (Models.Route route in userRoutes)
                {
                    routes.Add(await GetRouteResume(route, userName));
                }
            }

            return new ListRoutesVM(routes);
        }

        public async Task<FollowVM> GetFollowing(string userFollowers, string userName)
        {
            var user = await _context.Users.FindAsync(userFollowers);
            var userRequest = await _context.Users.FindAsync(userName);
            FollowVM result = new(new());

            if (user != null && userRequest != null)
            {
                var list = user.Follow.Where(n => n.State == FollowStatus.Accepted).Select(n => new FollowType(n.UserFollowed.UserName,
                n.UserFollowed.Name, userRequest.Follow.Exists(f => f.Followed == n.UserFollowed.UserName),
                 n.UserFollowed.ProfilePhoto)).ToList();
                result.Follow = list;

                return result;
            }
            else throw new Exception();
        }

        /// Returns a list with all used routes by the authenticated user
        /// </summary>
        /// <param name="userName">Authenticated user</param>
        /// <returns>A list with all routes</returns>
        public async Task<ListRoutesVM> GetUsedRoutes(string userName)
        {
            List<RouteResumeType> routes = new();

            List<VisitedRoute> usedRoutes = _context.VisitedRoutes.Where(r => r.UserName.Equals(userName)).ToList();

            foreach (VisitedRoute route in usedRoutes)
            {
                routes.Add(await GetRouteResume(route.Route, userName));
            }

            return new ListRoutesVM(routes);
        }

        /// <summary>
        /// Saves in the database the information related to the used route
        /// </summary>
        /// <param name="route">Used route</param>
        /// <param name="userName">User of used the route</param>
        public async Task UseRoute(UsedRouteVM route, string userName)
        {


            foreach (RoutePlaceType place in route.VisitedPlaces)
            {
                if (_context.VisitedPlaces.Find(place.IdPlace, userName) == null)
                {
                    _context.VisitedPlaces.Add(new VisitedPlace(place.IdPlace, userName));
                }
            }

            if (route.RouteID != 0 && _context.VisitedRoutes.Find(userName, route.RouteID) == null)
            {
                _context.VisitedRoutes.Add(new VisitedRoute(DateTime.Now.Date, userName, route.RouteID));
            }
            await _context.SaveChangesAsync();
        }

        public async Task<ErrorsVM> VerifyUsedRoute(UsedRouteVM route)
        {
            List<ErrorType> errors = new();
            if (route.RouteID != 0)
            {
                ErrorsVM errorsVerifyPlaces = VerifyPlacesRoute(route);

                if (errorsVerifyPlaces != null)
                {
                    return errorsVerifyPlaces;
                }
            }
            else
            {
                try
                {
                    foreach (RoutePlaceType place in route.VisitedPlaces)
                    {
                        await _placesService.PlaceExists(place.IdPlace);
                    }
                }
                catch (Exception exception)
                {
                    errors.Add(new ErrorType("Place", "O place id: " + exception.Message + " não é válido"));
                }
            }
            return new ErrorsVM(errors);

        }

        /// <summary>
        /// Verify if a the routeID is valid and if the places belongs to the given route
        /// </summary>
        /// <param name="route">Route to be checked</param>
        /// <returns></returns>
        public ErrorsVM VerifyPlacesRoute(UsedRouteVM route)
        {
            bool belongs = true;
            List<ErrorType> errors = new();

            if (_context.Routes.Find(route.RouteID) == null)
            {
                errors.Add(new ErrorType("RouteID", "O route ID está incorreto"));
            }
            else
            {
                Models.Route routeDB = _context.Routes.Find(route.RouteID)!;
                foreach (RoutePlaceType place in route.VisitedPlaces)
                {
                    var exists = from placeDB in routeDB.Places where placeDB.PlaceId.Equals(place.IdPlace) select placeDB;
                    if (!exists.Any()) belongs = false;
                }
                if (!belongs) errors.Add(new ErrorType("VisitedPlaces", "Os sítios não pertencem à rota"));
            }

            return new ErrorsVM(errors);
        }


        /// <summary>
        /// Validates if a route is correct, this method checks the following: 
        /// - If the name field is  filled
        /// - If all places belong to google API
        /// - If the route has places
        /// - If the place's schedule is correct 
        /// </summary>
        /// <param name="route">Route to be validat</param>
        /// <returns>An ErrorsVM object with errors , or an empty on if there aren't any errors</returns>
        public async Task<ErrorsVM> ValidateRoute(CreateUseRouteVM route)
        {
            List<ErrorType> errors = new();

            if (route.Name == null || route.Name.Trim().Equals("")) errors.Add(new ErrorType("Name", "O campo necessita de estar preenchido"));

            if (route.Places == null || route.Places.Count == 0)
            {
                errors.Add(new ErrorType("Places", "É necessário adicionar locais à rota"));
            }
            else
            {
                foreach (RoutePlaceType place in route.Places)
                {
                    try
                    {
                        await _placesService.PlaceExists(place.IdPlace);
                    }
                    catch (Exception exception)
                    {
                        errors.Add(new ErrorType("Places", "O place id: " + exception.Message + " não é válido"));
                        return new ErrorsVM(errors);
                    }

                }

                if (!ValidSchedule(route.Places)) errors.Add(new ErrorType("Places", "Existem sítios sobrepostos"));
            }
            return new ErrorsVM(errors);
        }

        /// <summary>
        /// Verify if exists a route in the data base with the given routeID
        /// </summary>
        /// <param name="routeID">Route's ID</param>
        /// <returns>true if exists or false if it doesn't</returns>
        public async Task<bool> RouteExists(long routeID)
        {
            var exists = await _context.Routes.FindAsync(routeID);

            if (exists != null)
            {
                return true;
            }
            return false;
            //return _context.Routes.Any(r => routeID.Equals(r.Id));
        }

        /// <summary>
        /// Returns the information of the given route
        /// </summary>
        /// <param name="userName">Name of the user who is trying to access the route</param>
        /// <param name="routeID">Route's ID</param>
        /// <returns>A RouteVm object with route's information</returns>
        /// <exception cref="UnauthorizedAccessException">If the user who is trying to acess the route doesn't have authorization, either because the route is private 
        /// or because the route is from a user who has a private profile and the user doesn't follow him.</exception>
        /// <exception cref="Exception">If occurs an error related to the DB</exception>
        public async Task<RouteVM> GetRoute(string userName, long routeID)
        {
            var routeDB = await _context.Routes.FindAsync(routeID);

            if (routeDB != null)
            {
                if (routeDB.IsPrivate && routeDB.UserName != userName)
                {
                    throw new UnauthorizedAccessException();
                }


                if (routeDB.User.PrivateProfile && routeDB.UserName != userName)
                {
                    if (!routeDB.User.Followed.Exists(u => u.Follower.Equals(userName) && u.State.Equals(Enumerations.FollowStatus.Accepted))) throw new UnauthorizedAccessException();
                }



                RouteVM routeVM = new(new(), await GetRouteResume(routeDB, userName), routeDB.CreationDate);
                List<CommentType> routeComments = new();

                routeVM.Comments = routeDB.Comments.Select(n => new CommentType(n.UserName, n.Commentary)).ToList();
                return routeVM;
            }
            throw new Exception();
        }

        /// <summary>
        /// Returns the route's resume information
        /// </summary>
        /// <param name="route">Route to be returned the information of</param>
        /// <param name="userName">User's who is requesting the data</param>
        /// <returns>Route's information</returns>
        public async Task<RouteResumeType> GetRouteResume(Models.Route route, string userName)
        {
            var userEvaluation = await _context.RouteEvaluations.FindAsync(userName, route.Id);

            RouteResumeType routeData = new(route.Name, route.UserName,
            route.User.ProfilePhoto, _context.FavoriteRoutes.Any(n => n.RouteId == route.Id && n.UserName.Equals(userName)),
            _context.VisitedRoutes.Any(n => n.RouteId == route.Id && n.UserName.Equals(userName)), -1, route.Id, RouteAverageRating(route), route.Description,
            route.RouteVisited.Count, ConvertPlacesToRoutePlaceType(route.Places.ToList()));

            if (userEvaluation != null) routeData.UserEvaluation = userEvaluation.Evaluation;

            return routeData;
        }

        public List<RoutePlaceType> ConvertPlacesToRoutePlaceType(List<RoutePlace> places)
        {
            List<RoutePlaceType> routePlaceList = new();

            foreach (RoutePlace routePlace in places)
            {
                RoutePlaceType routePlaceType = new(routePlace.PlaceId, routePlace.StartTime, routePlace.FinishTime);
                routePlaceList.Add(routePlaceType);
            }
            return routePlaceList;
        }

        /// <summary>
        /// Calculate route's average rating 
        /// </summary>
        /// <param name="route">route to calculate</param>
        /// <returns>Return the average rating;</returns>
        public int RouteAverageRating(Models.Route route)
        {
            var listEvaluations = route.RouteEvaluations.Select(n => n.Evaluation).ToList();
            if (listEvaluations.Count > 0)
            {
                int sum = 0;
                foreach (int number in listEvaluations)
                {
                    sum += number;
                }

                int avg = sum / listEvaluations.Count;
                return avg;
            }
            return 0;
        }

        /// <summary>
        /// Validates if the place's schedule is correct. this metohd checks the following:
        /// - If there aren't any places overlapping each other
        /// </summary>
        /// <param name="places">List of route's places</param>
        /// <returns>True if the schedule is valid or false if the schedule is invalid</returns>
        private bool ValidSchedule(List<RoutePlaceType> places)
        {
            places.Sort(ComparePlacesSchedule);
            int i = 0;

            while (i < places.Count)
            {
                if (i == (places.Count - 1))
                {
                    if (places[i].StartTime.TimeOfDay >= places[i].FinishTime.TimeOfDay) return false;
                }
                else if (places.Count > 1 && (places[i].StartTime.TimeOfDay >= places[i].FinishTime.TimeOfDay || places[i].FinishTime.TimeOfDay >= places[i + 1].StartTime.TimeOfDay))
                {
                    return false;
                }

                i++;
            }

            return true;
        }

        /// <summary>
        /// Compares if the start time of place one is smaller, equal or greater that the start time of place two
        /// </summary>
        /// <param name="firstPlace">The first place</param>
        /// <param name="secondPlace">The second place</param>
        /// <returns>-1 if the start time of place one is smaller that place two, 0 if is equal or 1 if is greater</returns>
        private int ComparePlacesSchedule(RoutePlaceType firstPlace, RoutePlaceType secondPlace)
        {
            if (firstPlace.StartTime.Hour < secondPlace.StartTime.Hour)
            {
                return -1;
            }
            else if (firstPlace.StartTime.Hour == secondPlace.StartTime.Hour)
            {
                return 0;
            }

            return 1;
        }
        /// <summary>
        /// Allows users to rate a given route
        /// </summary>
        /// <param name="routeID">The id of the route</param>
        /// <param name="userName">The user who is rating the route</param>
        /// <param name="rating">The rating</param>
        /// <returns></returns>
        public async Task RateRoute(long routeID, string userName, long rating)
        {
            var routeDB = await _context.Routes.FindAsync(routeID);

            if (routeDB != null)
            {
                if ((routeDB.IsPrivate == true && routeDB.UserName != userName) || (routeDB.User.PrivateProfile == true && routeDB.UserName != userName))
                {
                    throw new UnauthorizedAccessException();
                }
                var rateDB = await _context.RouteEvaluations.FindAsync(userName, routeID);
                if (rateDB != null)
                {
                    _context.RouteEvaluations.Remove(rateDB);
                }
                _context.RouteEvaluations.Add(new RouteEvaluation(rating, userName, routeID));
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception();
            }
        }

        /// <summary>
        /// Allows users to publish comments on a given route
        /// </summary>
        /// <param name="routeID">Route's ID</param>
        /// <param name="comment">The comment</param>
        /// <param name="userName">Name of the user who is commenting on the route</param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException">If the user who is trying to acess the route doesn't have authorization, either because the route is private 
        /// or because the route is from a user who has a private profile and the user doesn't follow him.</exception>
        /// <exception cref="Exception">If occurs an error related to the DB</exception>
        public async Task CommentRoute(long routeId, String comment, String userName)
        {
            var routeDB = await _context.Routes.FindAsync(routeId);

            if (routeDB != null)
            {
                if ((routeDB.IsPrivate == true && routeDB.UserName != userName) || (routeDB.User.PrivateProfile == true && routeDB.UserName != userName))
                {
                    throw new UnauthorizedAccessException();
                }

                routeDB.Comments.Add(new Comment(comment, userName, routeId));
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception();
            }
        }

        /// Verifies if the given FavoriteRoute exists in the database (IterDb), given the user
        /// </summary>
        /// <param name="routeId">Id of the route"</param>
        /// <param name="userName">The user</param>
        public bool FavoriteRouteExists(long routeId, string userName)
        {
            var route = _context.FavoriteRoutes.Find(userName, routeId);
            if (route != null)
            {
                return true;
            }
            return false;
        }


        /// <summary>
        /// Removes a route from the list of favorite routes
        /// </summary>
        /// <param name="routeId">Id of the route that is being removed"</param>
        /// <param name="userName">User that is removing the route"</param>
        public async Task RemoveFavoriteRoute(long routeId, string userName)
        {
            var route = await _context.FavoriteRoutes.FindAsync(userName, routeId);
            if (route != null)
            {
                _context.FavoriteRoutes.Remove(route);
                await _context.SaveChangesAsync();
            }
        }
        /// Marks a route as favorite
        /// </summary>
        /// <param name="userName">User that marks the route</param>
        /// <param name="routeId">Id of the route that is being marked"</param>
        public async Task AddFavoriteRoute(long routeId, String userName)
        {
            _context.FavoriteRoutes.Add(new FavoriteRoute(userName, routeId));
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Compares if the rating of place one is smaller, equal or greater that the rating of place two
        /// </summary>
        /// <param name="firstPlace">The first place</param>
        /// <param name="secondPlace">The second place</param>
        /// <returns>-1 if the rating of place one is smaller that place two or if the rating of place 1 is null, 
        /// 0 if is equal or if they ara both null, or 1 if is greater or place two is null</returns>
        public int ComparePlacesScore(Result firstPlace, Result secondPlace)
        {
            if (firstPlace.SuggestionScore < secondPlace.SuggestionScore)
            {
                return -1;
            }
            else if (firstPlace.SuggestionScore == secondPlace.SuggestionScore)
            {
                return 0;
            }

            return 1;
        }

        /// <summary>
        /// Allows a user to search for a route
        /// </summary>
        /// <param name="route">The route that is being searched for</param>
        /// <param name="userName">The user that is searching for the route</param>
        /// <returns></returns>
        public async Task<List<RouteResumeType>> SearchRoute(String route, String userName)
        {
            var routeList = new List<Models.Route>();
            Regex rx = new(route, RegexOptions.IgnoreCase);

            foreach (Models.Route r in _context.Routes)
            {
                if (r != null)
                {
                    if (rx.IsMatch(r.Name))
                    {
                        routeList.Add(r);
                    }
                }
            }

            var routePlaceList = await AddRoutesToSubList(routeList, userName);

            var resultList = new List<RouteResumeType>(routePlaceList);

            return resultList;
        }

        /// <summary>
        /// Lists the most used routes
        /// </summary>
        /// <param name="userName">The current user</param>
        public async Task<IOrderedEnumerable<RouteResumeType>> GetHighestRatedRoutes(String userName)
        {
            var routes = _context.Routes.ToList();

            var routePlaceList = await AddRoutesToSubList(routes, userName);

            var orderedRoutes = new List<RouteResumeType>(routePlaceList);

            return orderedRoutes.OrderByDescending(o => o.AverageRating);
        }

        private async Task<List<RouteResumeType>> AddRoutesToSubList(List<Models.Route> routes, string userName)
        {
            var routePlaceList = new List<RoutePlaceType>();
            var resultList = new List<RouteResumeType>();

            foreach (Models.Route r in routes)
            {
                foreach (RoutePlace rp in r.Places)
                {
                    routePlaceList.Add(new RoutePlaceType(rp.PlaceId, rp.StartTime, rp.FinishTime));
                }

                var isFavourite = await _context.FavoriteRoutes.FindAsync(userName, r.Id) != null;
                var wasUsed = await _context.VisitedRoutes.FindAsync(userName, r.Id) != null;
                var userEvaluation = await _context.RouteEvaluations.FindAsync(userName, r.Id);

                if (userEvaluation != null)
                {
                    resultList.Add(new RouteResumeType(r.Name, r.UserName, r.User.ProfilePhoto, isFavourite, wasUsed,
                    (int)userEvaluation.Evaluation, r.Id, AverageRating(r), r.Description, r.RouteVisited.Count, routePlaceList));
                }
                else
                {
                    resultList.Add(new RouteResumeType(r.Name, r.UserName, r.User.ProfilePhoto, isFavourite, wasUsed,
                                       -1, r.Id, AverageRating(r), r.Description, r.RouteVisited.Count, routePlaceList));
                }
            }
            return resultList;
        }
        public Double AverageRating(Models.Route route)
        {
            Double avg = 0;
            if (route.RouteEvaluations.Count != 0)
            {
                foreach (RouteEvaluation r in route.RouteEvaluations)
                {
                    avg += r.Evaluation;
                }

                avg /= route.RouteEvaluations.Count;
            }

            return avg;
        }

        ///<summary>
        /// Lists the routes the user has marked as Favorite
        ///</summary>
        /// <param name="userName">The user"</param>
        public async Task<ListRoutesVM> GetFavoriteRoutes(string userName)
        {
            var list = new List<Models.Route>();
            var user = await _context.Users.FindAsync(userName);
            if (user != null)
            {
                var routes = user.FavoriteRoutes.Select(n => n.RouteId).ToList();
                foreach (long fr in routes)
                {
                    foreach (Models.Route r in _context.Routes)
                    {
                        if (r != null)
                        {
                            if (fr == r.Id)
                            {
                                list.Add(r);
                            }
                        }
                    }
                }
                return new ListRoutesVM(new List<RouteResumeType>(await AddRoutesToSubList(list, userName)));
            }
            throw new Exception();
        }

        /// <summary>
        /// Compares if the score of caetgory one is smaller, equal or greater that the score of category two
        /// </summary>
        /// <param name="firstCategory">The first category</param>
        /// <param name="secondCategory">The second category</param>
        /// <returns>-1 if the socre of category one is smaller that category two or if the score of category 1 is null, 
        /// 0 if is equal or if they ara both null, or 1 if is greater or category two is null</returns>
        public int CompareCategoriesScore(CategoryScore firstCategory, CategoryScore secondCategory)
        {
            if (firstCategory.Score < secondCategory.Score)
            {
                return -1;
            }
            else if (firstCategory.Score == secondCategory.Score)
            {
                return 0;
            }
            return 1;
        }

    }
}