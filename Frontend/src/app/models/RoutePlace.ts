/**
 * This Model represents a place in a route
 */
export class RoutePlace {

    /**
     * Construct's an instance of {@link RoutePlace}
     * 
     * @param placeId place's id
     * @param routeId route's id
     * @param startTime Start time of place visit
     * @param finishTime End time of place visit
     */
    constructor(
        public placeId: Number,
        public routeId: Number,
        public startTime: Date,
        public finishTime: Date
    ) { }
}
