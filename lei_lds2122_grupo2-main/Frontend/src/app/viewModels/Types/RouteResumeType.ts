import { RoutePlaceType } from "./RoutePlaceType";

/**
 * Represents the route's Resume
 */
export class RouteResumeType {
    
    /**
     * Construct's an instance of {@link RouteResumeType}.
     * 
     * @param name route's name
     * @param routeID route's id
     * @param averageRating route's average rating
     * @param userName route's creator user name
     * @param profilePhoto route's creator profile photo url
     * @param isFavourite specifies if the route is marked as favorite by the user.
     * @param wasUsed specifies if the route was alrealy used by the user
     * @param description route's description
     * @param numberOfUses route's number of uses
     * @param userEvaluation user evaluation of the route
     * @param places route's places
     */
    constructor(
        public name: string,
        public routeID: number,
        public averageRating: number,
        public userName: string,
        public isFavourite: boolean,
        public wasUsed: boolean,
        public description: string,
        public numberOfUses: number,
        public userEvaluation: number,
        public places: Array<RoutePlaceType>,
        public profilePhoto?: string
    ) { }
}   