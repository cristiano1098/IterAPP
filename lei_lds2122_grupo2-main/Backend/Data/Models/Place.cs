
using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Models
{
    public class Place
    {
        public Place(string placeId, string name, int averageVisitTime,
         string? businessStatus, double? rating, int userRatingsTotal, List<Period> periods, List<PlaceCategory> categories,
          double latitude, double longitude, string photoReference)
        {
            PlaceId = placeId;
            AverageVisitTime = averageVisitTime;
            RoutePlaces = null!;
            InterestedPlaces = null!;
            VisitedPlaces = null!;
            BusinessStatus = businessStatus;
            Rating = rating;
            UserRatingsTotal = userRatingsTotal;
            // Categories = null!;
            Categories = categories;
            Name = name;
            //   Periods = null!;
            Periods = periods;
            Latitude = latitude;
            Longitude = longitude;
            PhotoReference = photoReference;
        }
        public Place(string placeId, string name, int averageVisitTime,
        string? businessStatus, double? rating, int userRatingsTotal, List<PlaceCategory> categories,
         double latitude, double longitude, string photoReference)
        {
            PlaceId = placeId;
            AverageVisitTime = averageVisitTime;
            RoutePlaces = null!;
            InterestedPlaces = null!;
            VisitedPlaces = null!;
            BusinessStatus = businessStatus;
            Rating = rating;
            UserRatingsTotal = userRatingsTotal;
            // Categories = null!;
            Categories = categories;
            Name = name;
            Periods = null!;
            Latitude = latitude;
            Longitude = longitude;
            PhotoReference = photoReference;
        }

        public Place(string placeId)
        {
            PlaceId = placeId;
            Name = null!;
            RoutePlaces = null!;
            InterestedPlaces = null!;
            VisitedPlaces = null!;
            Categories = null!;
            Periods = null!;
            PhotoReference = null!;

        }

        [Key]
        public string PlaceId { get; set; }
        public int AverageVisitTime { get; set; }
        public string? BusinessStatus { get; set; }
        public double? Rating { get; set; }
        public int UserRatingsTotal { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Name { get; set; }
        public string PhotoReference { get; set; }


        //Navigations Properties

        public virtual List<RoutePlace> RoutePlaces { get; set; }


        public virtual List<InterestedPlace> InterestedPlaces { get; set; }


        public virtual List<VisitedPlace> VisitedPlaces { get; set; }

        public virtual List<PlaceCategory> Categories { get; set; }

        public virtual List<Period> Periods { get; set; }
    }
}