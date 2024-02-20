namespace Backend.Data.ViewModels.Request
{
    /// <summary>
    /// View model class for evaluate route request
    /// </summary>
    public class EvaluateRouteVM
    {
        public long Evaluation { get; set; }

        /// <summary>
        /// Class's constructor method
        /// </summary>
        /// <param name="evaluation">Evaluation</param>
        public EvaluateRouteVM(long evaluation)
        {
            this.Evaluation = evaluation;

        }
    }
}