using Backend.Data.ViewModels.Types;

namespace Backend.Data.ViewModels.Response
{
    /// <summary>
    /// View model class for the list of errors response
    /// </summary>
    public class ErrorsVM
    {
        public List<ErrorType> Errors { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="errors">List with the errors</param>
        public ErrorsVM(List<ErrorType> errors)
        {
            this.Errors = errors;
        }


    }
}