
namespace Backend.Data.Models
{
    public class RoutePlace
    {
        public RoutePlace(string placeId, DateTime startTime, DateTime finishTime)
        {
            PlaceId = placeId;
            StartTime = startTime;
            FinishTime = finishTime;
            RouteId = 0;
            Route = null!;
            Place = null!;
        }

        public DateTime StartTime { get; set; }
        public DateTime FinishTime { get; set; }

        //Navigations Properties


        public long RouteId { get; set; }//foreignKey
        public virtual Route Route { get; set; }//foreignKey

        public string PlaceId { get; set; }//foreignKey
        public virtual Place Place { get; set; }//foreignKey
    }
}