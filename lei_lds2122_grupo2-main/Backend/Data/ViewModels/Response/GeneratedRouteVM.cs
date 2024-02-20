using Backend.Data.ViewModels.Types;

namespace Backend.Data.ViewModels.Response
{
    /// <summary>
    /// View Model class for the generated route 
    /// </summary>
    public class GeneratedRouteVM
    {
        public string Name { get; set; }
        public DateTime startTime;
        public DateTime finishTime;
        public List<RoutePlaceType> Route { get; set; }
        public List<string> PossiblePlaces { get; set; }

        /// <summary>
        /// Class' constructor
        /// </summary>
        /// <param name="name">Route's name</param>
        /// <param name="route">List of places</param>
        /// <param name="possiblePlaces">List of possible places for the route in case the user wants to regenerate on place</param>
        public GeneratedRouteVM(string name, DateTime startTime, DateTime finishTime, List<RoutePlaceType> route, List<string> possiblePlaces)
        {
            this.Name = name;
            this.startTime = startTime;
            this.finishTime = finishTime;
            this.Route = route;
            this.PossiblePlaces = possiblePlaces;
        }
    }
}