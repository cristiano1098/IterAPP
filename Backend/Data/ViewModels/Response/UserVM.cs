namespace Backend.Data.ViewModels
{
    /// <summary>    
    /// View Model class for user's account view reqeust and edit user's account response
    /// </summary>
    public class UserVM
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public DateTime BirthDate { get; set; }
        public Boolean PrivateProfile { get; set; }
        public string Description { get; set; }
        public string ProfilePhoto { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="userName">User's unique identifier</param>
        /// <param name="email">User's email</param>
        /// <param name="name">User's name</param>
        /// <param name="birthDate">User's birth date</param>
        /// <param name="privateProfile">Whether or not user's profile is private</param>
        /// <param name="description">User's profile description</param>
        /// <param name="profilePhoto">User's profile photo </param>
        public UserVM(string userName, string email, string name, DateTime birthDate, Boolean privateProfile,
         string description, string profilePhoto)
        {
            this.UserName = userName;
            this.Email = email;
            this.Name = name;
            this.BirthDate = birthDate;
            this.PrivateProfile = privateProfile;
            this.Description = description;
            this.ProfilePhoto = profilePhoto;
        }


    }
}