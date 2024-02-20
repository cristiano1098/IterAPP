namespace Backend.Data.ViewModels
{
    /// <summary>
    /// View Model class for Change Password reqeust
    /// </summary>
    public class ChangePasswordVM
    {
        public string Password { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="password">The new password</param>
        public ChangePasswordVM(String password){
            this.Password = password;
        }
    }
}