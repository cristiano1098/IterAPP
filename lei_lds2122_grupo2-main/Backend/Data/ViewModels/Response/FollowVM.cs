using Backend.Data.ViewModels.Types;

namespace Backend.Data.ViewModels
{
    /// <summary>
    /// View Model class for followers and following reqeust
    /// </summary>
    public class FollowVM
    {
        public List<FollowType> Follow{get; set;}
        
        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="follow">List of users (followers or following)</param>
        public FollowVM(List<FollowType> follow){
            this.Follow = follow;
        }
    }
}