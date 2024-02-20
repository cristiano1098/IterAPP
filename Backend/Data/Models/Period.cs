
namespace Backend.Data.Models
{
    public class Period
    {
        public Period(int openDay, string openTime, int? closeDay, string? closeTime)
        {
            PlaceId = "";
            OpenDay = openDay;
            OpenTime = openTime;
            CloseDay = closeDay;
            CloseTime = closeTime;
            Place = null!;
        }

        public int OpenDay { get; set; }
        public string OpenTime { get; set; }
        public int? CloseDay { get; set; }
        public string? CloseTime { get; set; }

        //Navigations Properties

        public string PlaceId { get; set; }//foreignKey
        public virtual Place Place { get; set; }//foreignKey
    }
}