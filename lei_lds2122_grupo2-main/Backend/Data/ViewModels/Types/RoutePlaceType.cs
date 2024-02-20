namespace Backend.Data.ViewModels.Types
{
    /// <summary>
    /// Struct that repesents a place in a route 
    /// </summary>
    public class RoutePlaceType
    {
        public string IdPlace { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime FinishTime { get; set; }

        /// <summary>
        /// Struct's constructor method
        /// </summary>
        /// <param name="id">Place's id</param>
        /// <param name="startTime">Time that visit starts</param>
        /// <param name="finishTime">Time that visit finishs</param>
        public RoutePlaceType(string id, DateTime startTime, DateTime finishTime)
        {
            this.IdPlace = id;
            this.StartTime = startTime;
            this.FinishTime = finishTime;
        }

        public RoutePlaceType()
        {
            this.IdPlace = null!;
        }
    }

}
