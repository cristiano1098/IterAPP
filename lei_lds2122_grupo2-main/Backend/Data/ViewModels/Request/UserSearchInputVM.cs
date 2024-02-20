using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Data.ViewModels.Request
{
    /// <summary>    
    /// View Model class for the search input for a user
    /// </summary>
    public class UserSearchVM
    {
        public string UserName { get; set; }
        
        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="userName">User's unique identifier</param>
        public UserSearchVM(String userName)
        {
            this.UserName = userName;
        }
    }
}