using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Models
{
    public class User
    {

        public User(string userName, string name, DateTime birthDate,
         string email, string password, bool privateProfile, string description,
          string profilePhoto)
        {
            this.UserName = userName;
            this.Name = name;
            this.BirthDate = birthDate;
            this.Email = email;
            this.Password = password;
            this.PrivateProfile = privateProfile;
            this.Description = description;
            this.ProfilePhoto = profilePhoto;
            this.Routes = new();
            this.FavoriteRoutes = new();
            this.Comments = new();
            this.RouteEvaluations = new();
            this.VisitedRoutes = new();
            this.InterestedPlaces = new();
            this.VisitedPlaces = new();
            this.Follow = new();
            this.Followed = new();
        }

        [Key]
        public string UserName { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public DateTime BirthDate { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public Boolean PrivateProfile { get; set; }
        public string Description { get; set; }
        [Required]
        public string ProfilePhoto { get; set; }

        //Navigations Properties

        public virtual List<Route> Routes { get; set; }


        public virtual List<FavoriteRoute> FavoriteRoutes { get; set; }
        public virtual List<Comment> Comments { get; set; }
        public virtual List<RouteEvaluation> RouteEvaluations { get; set; }
        public virtual List<VisitedRoute> VisitedRoutes { get; set; }


        public virtual List<InterestedPlace> InterestedPlaces { get; set; }
        public virtual List<VisitedPlace> VisitedPlaces { get; set; }


        public virtual List<Follow> Follow { get; set; }
        public virtual List<Follow> Followed { get; set; }
    }
}