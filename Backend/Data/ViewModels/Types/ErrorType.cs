namespace Backend.Data.ViewModels.Types
{
    /// <summary>
    /// Class that defines comment type
    /// </summary>
    public class ErrorType
    {
        public string Name { get; set; }
        public string Description { get; set; }

        /// <summary>
        /// Class' constructor method 
        /// </summary>
        /// <param name="name">Name of the variable that is wrong</param>
        /// <param name="description">Error descritpion</param>
        public ErrorType(string name, string description)
        {
            this.Name = name;
            this.Description = description;
        }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        public ErrorType() {
            this.Name = null!;
            this.Description = null!;
        }
    }
}
