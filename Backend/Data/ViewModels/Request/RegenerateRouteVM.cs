namespace Backend.Data.ViewModels.Request
{
    /// <summary>
    /// View Model class for regenerate route reqeust
    /// </summary>
    public class RegenerateRouteVM : GenerateRouteVM
    {
        public List<String> DeletedPlaces { get; set; }

        /// <summary>
        /// Class' constructor method
        /// </summary>
        /// <param name="name">Route's name</param>
        /// <param name="startTime">Time that route starts</param>
        /// <param name="finishTime">Time that route ends</param>
        /// <param name="visitedPlaces">Whether or not the user wants to visit places already visited</param>
        /// <param name="categories">Categories of palces that user chose</param>
        /// <param name="deletedPlaces">List with the places that the user deleted, 
        /// this list is use to know what places the user didn't want in the previous route, so we regenerate different places</param>
        public RegenerateRouteVM(string name, DateTime startTime, DateTime finishTime,
        Boolean visitedPlaces, List<String> categories, List<String> deletedPlaces) : base (name, startTime, finishTime, visitedPlaces, categories)
        {
            this.DeletedPlaces = deletedPlaces;
        }
    }
}