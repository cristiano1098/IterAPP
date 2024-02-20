
namespace Backend.Data.Models
{
    public class FavoriteRoute
    {
        public FavoriteRoute(string userName, long routeId)
        {
            UserName = userName;
            User = null!;
            RouteId = routeId;
            Route = null!;
        }


        //Navigations Properties 


        public string UserName { get; set; }//foreignKey
        public virtual User User { get; set; }//foreignKey

        public long RouteId { get; set; }//foreignKey   
        public virtual Route Route { get; set; }//foreignKey           

    }
}