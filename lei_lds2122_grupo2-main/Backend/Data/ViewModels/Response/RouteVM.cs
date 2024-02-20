using Backend.Data.ViewModels.Types;

namespace Backend.Data.ViewModels.Response
{
    /// <summary>
    /// View model class with the route response
    /// </summary>
    public class RouteVM
    {
        public DateTime CreateDate { get; set; }
        public List<CommentType> Comments { get; set; }
        public RouteResumeType RouteResume { get; set; }


        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="comments">Route's commnets</param>
        /// <param name="routeResume">Route's resume</param>
        public RouteVM(List<CommentType> comments, RouteResumeType routeResume, DateTime createDate)
        {
            this.Comments = comments;
            this.RouteResume = routeResume;
            this.CreateDate = createDate;
        }
    }
}