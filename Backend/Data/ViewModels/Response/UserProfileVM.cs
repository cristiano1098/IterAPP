using Backend.Data.ViewModels.Types;

namespace Backend.Data.ViewModels
{
    /// <summary>
    /// View Model class for view user profile reqeust
    /// </summary>
    public class UserProfileVM
    {
        public string UserName { get; set; }
        public string Name { get; set; }
        public Boolean PrivateProfile { get; set; }
        public string Description { get; set; }
        public string ProfilePhoto { get; set; }
        public List<RouteResumeType> PublicRoutes { get; set; }
        public int NumberFollowers { get; set; }
        public int NumberFollowing { get; set; }
        public int FollowState { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="userName">User's unique identifier</param>
        /// <param name="name">User's name</param>
        /// <param name="privateProfile">Whether or not user's profile is private</param>
        /// <param name="description">User's profile description</param>
        /// <param name="profilePhoto">User's profile photo </param>
        /// <param name="publicRoutes">List with all user's public routes</param>   
        /// <param name="numberFollowers">Number of user's followers</param>
        /// <param name="numberFollowing">Number of people that user is following</param> 
        public UserProfileVM(string userName, string name, Boolean privateProfile,
        string description, string profilePhoto, List<RouteResumeType> publicRoutes, int numberFollowers, int numberFollowing, int followState)
        {
            this.UserName = userName;
            this.Name = name;
            this.PrivateProfile = privateProfile;
            this.Description = description;
            this.ProfilePhoto = profilePhoto;
            this.PublicRoutes = publicRoutes;
            this.NumberFollowers = numberFollowers;
            this.NumberFollowing = numberFollowing;
            this.FollowState = followState;
        }
    }
}