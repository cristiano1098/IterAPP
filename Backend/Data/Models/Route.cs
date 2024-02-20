using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Models
{
    public class Route
    {
        public Route(string name, bool isPrivate, string description,
        DateTime creationDate, string userName)
        {
            this.Name = name;
            this.IsPrivate = isPrivate;
            this.Description = description;
            this.CreationDate = creationDate;
            this.UserName = userName;

            this.User = null!;
            this.Places = new();
            this.FavoriteRoutes = new();
            this.Comments = new();
            this.RouteEvaluations = new();
            this.RouteVisited = new();

        }

        public long Id { get; set; }
        public string Name { get; set; }
        [Required]
        public bool IsPrivate { get; set; }
        public string Description { get; set; }
        public DateTime CreationDate { get; set; }

        //Navigations Properties

        public string UserName { get; set; }//foreignKey
        public virtual User User { get; set; }//foreignKey

        public virtual List<FavoriteRoute> FavoriteRoutes { get; set; }
        public virtual List<Comment> Comments { get; set; }
        public virtual List<RouteEvaluation> RouteEvaluations { get; set; }
        public virtual List<VisitedRoute> RouteVisited { get; set; }

        public virtual List<RoutePlace> Places { get; set; }


    }
}