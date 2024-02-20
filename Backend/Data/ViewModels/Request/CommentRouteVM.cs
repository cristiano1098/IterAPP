namespace Backend.Data.ViewModels.Request
{
    /// <summary>
    /// View Model class for commnet route request
    /// </summary>
    public class CommentRouteVM
    {
        public string Comment{ get; set; }

        /// <summary>
        /// Class' contructor method
        /// </summary>
        /// <param name="comment">Commnet to add</param>
        public CommentRouteVM(string comment)
        {
            this.Comment = comment;
        }
    }
}