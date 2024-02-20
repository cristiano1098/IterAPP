/**
 * This Model represents a route evaluation given by an user
 */
export class RouteEvaluation {

    /**
     * Construct's an instance of {@link RouteEvaluation}
     * 
     * @param evaluation route's evaluation
     * @param userName user name of the user that evaluated the route
     * @param routeId route's id that was evaluated
     */
    constructor(
        public evaluation: Number,
        public userName: string,
        public routeId: Number
    ) { }
}