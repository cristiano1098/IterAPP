namespace Backend.Data.ViewModels.Response
{
    /// <summary>
    /// View Model class to send the RouteID response
    /// </summary>
    public class RouteIDVM
    {
        public long RouteID { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="RouteID">Route's ID</param>
        public RouteIDVM(long RouteID)
        {
            this.RouteID = RouteID;
        }
    }
}