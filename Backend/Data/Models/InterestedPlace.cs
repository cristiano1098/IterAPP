using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Models
{
    public class InterestedPlace
    {
        public InterestedPlace(string placeId, string userName)
        {
            PlaceId = placeId;
            UserName = userName;
            User = null!;
            Place = null!;
        }




        //Navigations Properties                                

        public string UserName { get; set; }//foreignKey
        public virtual User User { get; set; }//foreignKey
        [Required]
        public string PlaceId { get; set; }//foreignKey
        public virtual Place Place { get; set; }//foreignKey
    }
}