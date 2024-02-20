import { RoutePlaceType } from "../Types/RoutePlaceType";

/**
 * View Model that represents a response with a generated route.
 */
export class GeneratedRouteVM {

    /**
     * Construct's an instance of {@link GeneratedRouteVM}
     * 
     * @param name route's name
     * @param startTime route's start date
     * @param finishTime route's finish date
     * @param route route's places and visiting times
     * @param possiblePlaces route's possible palce's replacements 
     */
    constructor(
        public name: string,
        public startTime: Date,
        public finishTime: Date,
        public route: Array<RoutePlaceType>,
        public possiblePlaces: Array<string>
    ) { }
}