using Backend.Data.ViewModels.Types;

namespace Backend.Data.ViewModels.Response
{
    /// <summary>
    /// View model class for the list routes response
    /// </summary>
    public class ListRoutesVM
    {
        public List<RouteResumeType> Routes { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="routes">List of routes</param>
        public ListRoutesVM(List<RouteResumeType> routes)
        {
            this.Routes = routes;
        }
    }
}