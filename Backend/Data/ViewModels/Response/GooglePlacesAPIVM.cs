
using System.Net.Http;
using Microsoft.IdentityModel.Protocols;

namespace Backend.Data.ViewModels.Response
{
    public class Review

    {
        public string? Author_name { get; set; }
        public string? Author_url { get; set; }
        public string? Language { get; set; }
        public string? Profile_photo_url { get; set; }
        public int? Rating { get; set; }
        public string? Relative_time_description { get; set; }
        public string? Text { get; set; }
        public int? Time { get; set; }
    }
    public class AddressComponent
    {
        public string? Long_name { get; set; }
        public string? Short_name { get; set; }
        public List<string>? Types { get; set; }
    }
    public class Location
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
        public Location(double lat, double lng)
        {
            this.Lat = lat;
            this.Lng = lng;
        }
    }

    public class Northeast
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }

    public class Southwest
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }

    public class Viewport
    {
        public Northeast? Northeast { get; set; }
        public Southwest? Southwest { get; set; }
    }

    public class Geometry
    {
        public Location? Location { get; set; }
        public Viewport? Viewport { get; set; }

        public Geometry(Location loc)
        {
            this.Location = loc;
        }
    }

    public class Photo
    {
        public int Height { get; set; }
        public List<string>? Html_attributions { get; set; }
        public string Photo_reference { get; set; }
        public int? Width { get; set; }
        public Photo(string photoReference)
        {
            this.Photo_reference = photoReference;
        }
    }

    public class PlusCode
    {
        public string? Compound_code { get; set; }
        public string? Global_code { get; set; }
    }

    public class Close
    {
        public int? Day { get; set; }
        public string? Time { get; set; }
        public Close(int? day, string? time)
        {
            this.Day = day;
            this.Time = time;
        }
    }

    public class Open
    {
        public int Day { get; set; }
        public string Time { get; set; }
        public Open(int day, string time)
        {
            this.Day = day;
            this.Time = time;
        }
    }

    public class Period
    {
        public Close? Close { get; set; }
        public Open Open { get; set; }
        public Period(Close? close, Open open)
        {
            this.Close = close;
            this.Open = open;
        }
    }

    public class OpeningHours
    {
        public bool Open_now { get; set; }
        public List<Period>? Periods { get; set; }
        public List<string>? Weekday_text { get; set; }
        public OpeningHours(List<Period>? periods)
        {
            this.Periods = periods;
        }
    }

    public class Result
    {
        /*        public List<AddressComponent>? Address_components { get; set; }
                public string? Adr_address { get; set; }*/
        public string? Business_status { get; set; }
        /*  public string? Formatted_address { get; set; }
         
          public string? Icon { get; set; }
          public string? Icon_background_color { get; set; }
          public string? Icon_mask_base_uri { get; set; }
          public List<Photo>? Photos { get; set; }  */
        public string Place_id { get; set; }

        public Geometry? Geometry { get; set; }

        public string Name { get; set; }
        //public PlusCode? Plus_code { get; set; }
        public double? Rating { get; set; }
        /*         public List<Review>? Reviews { get; set; }
                public string? Reference { get; set; }  */
        public List<string>? Types { get; set; }
        public int User_ratings_total { get; set; }

        /*   public int Utc_offset { get; set; }
          public string? Vicinity { get; set; }
          public string? Website { get; set; } */
        public OpeningHours? Opening_hours { get; set; }

        public List<Photo>? Photos { get; set; }

        public double SuggestionScore { get; set; }
        public int VisitDurationTime { get; set; }
        public int AverageVisitTime { get; set; }

        public Result(String? businessStatus, String placeId, Geometry geometry, String name, double? rating,
        List<string>? types, List<Photo>? photos, int userRatingsTotal, OpeningHours? openingHours, int averageVisitTime)
        {
            this.Business_status = businessStatus;
            this.Place_id = placeId;
            this.Geometry = geometry;
            this.Name = name;
            this.Rating = rating;
            this.Types = types;
            this.Photos = photos;
            this.User_ratings_total = userRatingsTotal;
            this.Opening_hours = openingHours;
            this.AverageVisitTime = averageVisitTime;
        }
        public Result()
        {
            this.Business_status = null!;
            this.Place_id = null!;
            this.Geometry = null!;
            this.Name = null!;
            this.Rating = null!;
            this.Types = null!;
            this.Photos = null!;
            this.User_ratings_total = 0;
            this.Opening_hours = null!;
            this.AverageVisitTime = 0;
        }
    }

    public class Response
    {
        //   public List<object>? Html_attributions { get; set; }
        public string? Next_page_token { get; set; }
        public List<Result>? Results { get; set; }
        public Result? Result { get; set; }
        public string? Status { get; set; }
    }
}
