namespace Backend.Data.ViewModels
{
    /// <summary>
    /// View Model class for Creat User reqeust
    /// </summary>
    public class CreateUserVM
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public DateTime BirthDate { get; set; }
        public string Password { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="userName">User's unique identifier</param>
        /// <param name="email">User's email</param>
        /// <param name="name">User's name</param>
        /// <param name="birthDate">User's birth date</param>
        /// <param name="password">User's password</param>
        public CreateUserVM(string userName, string email, string name, DateTime birthDate, string password)
        {
            this.UserName = userName;
            this.Email = email;
            this.Name = name;
            this.BirthDate = birthDate;
            this.Password = password;
        }
    }
}