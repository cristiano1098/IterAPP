/**
 * This class represents routes that where visited by the user
 */
export class RouteVisited {

    /**
     * Construct's an instance of {@link RouteVisited}
     * 
     * @param username the user that visited the route
     * @param routeID the route that was visited
     */
    constructor(
        public username: String,
        public routeID: Number
    ) { }
}