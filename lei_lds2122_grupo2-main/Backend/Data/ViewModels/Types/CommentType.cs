namespace Backend.Data.ViewModels.Types
{
    /// <summary>
    /// Class that defines comment type
    /// </summary>
    public class CommentType
    {
        public string UserName { get; set; }
        public string Comment { get; set; }

        /// <summary>
        /// Class's contructor method
        /// </summary>
        /// <param name="userName">User name of user that commented the route</param>
        /// <param name="comment">User's commnent</param>
        public CommentType(string userName, string comment)
        {
            this.UserName = userName;
            this.Comment = comment;
        }

        public CommentType()
        {
            this.UserName = null!;
            this.Comment = null!;
        }
    }
}
