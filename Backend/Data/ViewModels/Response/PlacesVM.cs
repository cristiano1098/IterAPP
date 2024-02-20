namespace Backend.Data.ViewModels
{
    /// <summary>
    /// View Model class for followers and following reqeust
    /// </summary>
    public class PlacesVM
    {
        public List<String> Places { get; set; }

        /// <summary>
        /// Class' construcot method
        /// </summary>
        /// <param name="places">List of places' id</param>
        public PlacesVM(List<String> places)
        {
            this.Places = places;
        }
    }
}