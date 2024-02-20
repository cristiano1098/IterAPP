namespace Backend.Data.ViewModels.Request
{
    /// <summary>
    /// View Model class for Creat User reqeust
    /// </summary>
    public class GenerateRouteVM
    {
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime FinishTime { get; set; }
        public Boolean VisitedPlaces { get; set; }
        public List<string> Categories { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="name">Route's name</param>
        /// <param name="startTime">Time that route starts</param>
        /// <param name="finishTime">Time that route ends</param>
        /// <param name="visitedPlaces">Whether or not the user wants to visit places already visited</param>
        /// <param name="categories">Categories of palces that user chose</param>
        public GenerateRouteVM(string name, DateTime startTime, DateTime finishTime, Boolean visitedPlaces, 
        List<String> categories)
        {
            this.Name = name;
            this.StartTime = startTime;
            this.FinishTime = finishTime;
            this.VisitedPlaces = visitedPlaces;
            this.Categories = categories;
        }
    }
}