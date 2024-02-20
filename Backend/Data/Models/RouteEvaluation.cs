
namespace Backend.Data.Models
{
    public class RouteEvaluation
    {
        public RouteEvaluation(long evaluation, string userName, long routeId)
        {
            Evaluation = evaluation;
            UserName = userName;
            User = null!;
            RouteId = routeId;
            Route = null!;
        }

        public long Evaluation { get; set; }


        //Navigations Properties 


        public string UserName { get; set; }//foreignKey
        public virtual User User { get; set; }//foreignKey

        public long RouteId { get; set; }//foreignKey   
        public virtual Route Route { get; set; }//foreignKey           


    }
}