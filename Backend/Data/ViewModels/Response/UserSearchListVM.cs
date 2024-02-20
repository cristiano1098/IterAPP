using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data.Models;

namespace Backend.Data.ViewModels.Response
{
    /// <summary>    
    /// View Model class for the list of users that results from a search
    /// </summary>
    public class UserSearchListVM
    {
        public List<UserResultVM> Users { get; set; }


        /// <summary>
        /// Class' constructor method
        /// </summary>
        public UserSearchListVM()
        {
            this.Users = new List<UserResultVM>();
        }
    }
}