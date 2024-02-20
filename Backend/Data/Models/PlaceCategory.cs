
namespace Backend.Data.Models
{
    public class PlaceCategory
    {

        public PlaceCategory()
        {
            PlaceId = "";
            CategoryId = "";
            Category = null!;
            Place = null!;
        }

        public PlaceCategory(string placeId, string category)
        {
            PlaceId = placeId;
            CategoryId = category;
            Category = null!;
            Place = null!;
        }

        public PlaceCategory(string category)
        {
            PlaceId = "";
            CategoryId = category;
            Category = null!;
            Place = null!;
        }

        //Navigations Properties                                

        public string CategoryId { get; set; }//foreignKey
        public virtual Category Category { get; set; }//foreignKey
        public string PlaceId { get; set; }//foreignKey
        public virtual Place Place { get; set; }//foreignKey
    }
}