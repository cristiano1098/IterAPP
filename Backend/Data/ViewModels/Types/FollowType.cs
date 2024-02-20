namespace Backend.Data.ViewModels.Types
{
    /// <summary>
    /// Struct that repesents a follower or following 
    /// </summary>
    public class FollowType
    {
        public string UserName { get; set; }
        public string Name { get; set; }
        public Boolean Follow { get; set; }
        public string ProfilePhoto { get; set; }

        /// <summary>
        /// Struct's constructor method
        /// </summary>
        /// <param name="userName">User's unique identifier</param>
        /// <param name="name">User's name</param>
        /// <param name="follow">Whether or not the user follows this user</param>
        /// <param name="profilePhoto">User's profile photo </param>
        public FollowType(string userName, string name, Boolean follow, string profilePhoto)
        {
            this.UserName = userName;
            this.Name = name;
            this.Follow = follow;
            this.ProfilePhoto = profilePhoto;
        }
        public FollowType()
        {
            this.UserName = null!;
            this.Name = null!;
            this.ProfilePhoto = null!;
        }
    }
}
