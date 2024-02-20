namespace Backend.Data.ViewModels.Request
{
    /// <summary>
    /// View model class for the resset password first step request. 
    /// This class only represents the first request that is to
    /// send the emial with the link to change the password
    /// </summary>
    public class ResetPasswordEmailVM
    {
        public string Email { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="email">User's email</param>
        public ResetPasswordEmailVM(string email)
        {
            this.Email = email;
        }
    }
}