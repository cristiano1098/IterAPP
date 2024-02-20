using Backend.Data.ViewModels.Types;

namespace Backend.Data.ViewModels
{
    /// <summary>
    /// View Model class for Creat and Use Route, this can be used to either created and generated routes reqeusts or to validate a route request
    /// </summary>
    public class CreateUseRouteVM
    {
        public string Name{get; set;}
        public List<RoutePlaceType> Places{get; set;}

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="name">Route's name</param>
        /// <param name="places">List of places that the route has</param>
        public CreateUseRouteVM(string name, List<RoutePlaceType> places){
            this.Name = name;
            this.Places = places;
        }
    }
}