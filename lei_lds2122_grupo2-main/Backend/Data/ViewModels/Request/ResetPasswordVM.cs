namespace Backend.Data.ViewModels.Request
{
    /// <summary>
    /// View model class for the reset password last step request. 
    /// This class represents the last step where the user sends the new password.
    /// This class extends ChangePasswordVM once the only difference is that in this one 
    /// we also need to have the user's email.
    /// </summary>
    public class ResetPasswordVM : ChangePasswordVM
    {
        public string Email { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="email">User's email</param>
        /// <param name="password">User's password</param>
        public ResetPasswordVM(string email, string password) : base(password)
        {
            this.Email = email;
        }
    }
}