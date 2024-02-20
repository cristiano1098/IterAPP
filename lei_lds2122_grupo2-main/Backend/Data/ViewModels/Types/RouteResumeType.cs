using Backend.Data.ViewModels.Types;
namespace Backend.Data.ViewModels.Types
{
    /// <summary>
    /// Struct that repesents the resume of a route 
    /// </summary>
    public class RouteResumeType
    {
        public string Name { get; set; }
        public long RouteID { get; set; }
        public double AverageRating { get; set; }
        public string UserName { get; set; }
        public string ProfilePhoto { get; set; }
        public Boolean IsFavourite { get; set; }
        public Boolean WasUsed { get; set; }
        public string Description { get; set; }
        public int NumberOfUses { get; set; }
        public long UserEvaluation { get; set; }
        public List<RoutePlaceType> Places { get; set; }


        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="name">Route's name</param>
        /// <param name="userName">User name of route's creator</param>
        /// <param name="profilePhoto">Profile photoe of route's creator</param>
        /// <param name="isFavourite">Whether or not the route is a favourite route of the user that is authenticated</param>
        /// <param name="wasUsed">Whether or not the route was used by the user that is authenticated</param>
        /// <param name="userEvaluation">The evaluation of the user that is authenticated or -1 if he didn't evaluate the route</param>
        /// <param name="routeResume">Route's resume</param>
        /// <param name="routeID">Route's id</param>
        public RouteResumeType(string name, string userName, string profilePhoto, bool isFavourite,
        bool wasUsed, int userEvaluation, long routeID, double averageRating, string description, int numberOfUses, List<RoutePlaceType> places)
        {
            this.Name = name;
            this.UserName = userName;
            this.ProfilePhoto = profilePhoto;
            this.IsFavourite = isFavourite;
            this.WasUsed = wasUsed;
            this.RouteID = routeID;
            this.AverageRating = averageRating;
            this.Description = description;
            this.NumberOfUses = numberOfUses;
            this.UserEvaluation = userEvaluation;
            this.Places = places;
        }

        public RouteResumeType()
        {
            this.Name = null!;
            this.UserName = null!;
            this.ProfilePhoto = null!;
            this.Description = null!;
            this.Places = null!;
        }

    }
}
