using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Data.ViewModels.Request
{
    /// <summary>    
    /// View Model class for the search input for a user
    /// </summary>
    public class RouteSearchInputVM
    {

        public string RouteName { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="routeName">The name of the route</param>
        public RouteSearchInputVM(String routeName)
        {
            this.RouteName = routeName;
        }
    }
}