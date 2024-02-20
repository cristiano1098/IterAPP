using Backend.Data.ViewModels.Types;

namespace Backend.Data.ViewModels.Request
{
    public class UsedRouteVM
    {
        public long RouteID{ get; set; }
        public List<RoutePlaceType> VisitedPlaces{ get; set; }

        public UsedRouteVM(long routeID, List<RoutePlaceType> visitedPalces){
            this.RouteID = routeID;
            this.VisitedPlaces = visitedPalces;
        }
        public UsedRouteVM(){
            VisitedPlaces = new();
        }
    
    }
}