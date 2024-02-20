using Backend.Data.ViewModels.Types;

namespace Backend.Data.ViewModels.Response
{
    /// <summary>
    /// View model class for edit route request and response
    /// </summary>
    public class EditRouteVM
    {
        public string Name { get; set; }
        public List<RoutePlaceType> Places { get; set; }
        public string Description { get; set; }
        public Boolean PrivateRoute { get; set; }

        public long RouteID{ get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="name">Route's name</param>
        /// <param name="places">List of route's places</param>
        /// <param name="description">Route's description</param>
        /// <param name="privateRoute">Whether or not route is private</param>
        public EditRouteVM(string name, List<RoutePlaceType> places, string description, Boolean privateRoute, long routeID)
        {
            this.Name = name;
            this.Description = description;
            this.PrivateRoute = privateRoute;
            this.Places = places;
            this.RouteID = routeID;
        }
    }
}