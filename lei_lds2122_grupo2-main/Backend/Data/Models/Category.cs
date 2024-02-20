using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Models
{
    public class Category
    {
        public Category()
        {
            CategoryId = "";
            PlaceCategories = null!;
        }

        public Category(string category)
        {
            CategoryId = category;
            PlaceCategories = null!;
        }

        [Key]
        public string CategoryId { get; set; }


        //Navigations Properties

        public virtual List<PlaceCategory> PlaceCategories { get; set; }
    }
}