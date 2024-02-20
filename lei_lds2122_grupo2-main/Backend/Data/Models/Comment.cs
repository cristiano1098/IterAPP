
namespace Backend.Data.Models
{
    public class Comment
    {
        public Comment(string commentary, string userName, long routeId)
        {
            Commentary = commentary;
            UserName = userName;
            User = null!;
            RouteId = routeId;
            Route = null!;
        }

        public string Commentary { get; set; }


        //Navigations Properties 


        public string UserName { get; set; }//foreignKey
        public virtual User User { get; set; }//foreignKey

        public long RouteId { get; set; }//foreignKey   
        public virtual Route Route { get; set; }//foreignKey           

    }
}