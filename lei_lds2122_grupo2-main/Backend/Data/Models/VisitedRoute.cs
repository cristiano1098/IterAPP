namespace Backend.Data.Models
{
    public class VisitedRoute
    {
        public VisitedRoute(DateTime visitDate, string userName, long routeId)
        {
            VisitDate = visitDate;
            UserName = userName;
            User = null!;
            RouteId = routeId;
            Route = null!;
        }

        public DateTime VisitDate { get; set; }

        //Navigations Properties 


        public string UserName { get; set; }//foreignKey
        public virtual User User { get; set; }//foreignKey

        public long RouteId { get; set; }//foreignKey   
        public virtual Route Route { get; set; }//foreignKey           

    }
}