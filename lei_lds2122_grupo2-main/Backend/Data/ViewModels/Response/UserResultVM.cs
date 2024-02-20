using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Data.ViewModels.Response
{
    /// <summary>    
    /// View Model class for each result in UserSearchListVM
    /// </summary>
    public class UserResultVM
    {
        public string UserName { get; set; }
        public string Name { get; set; }
        public string ProfilePhoto { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="userName">User's unique identifier</param>
        /// <param name="name">User's full name</param>
        /// <param name="profilePhoto">User's profile photo</param>
        public UserResultVM(string userName, string name, string profilePhoto)
        {
            this.UserName = userName;
            this.Name = name;
            this.ProfilePhoto = profilePhoto;
        }

    }
}