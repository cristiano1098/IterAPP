import { toJSONString } from "../interfaces/toJSONString"
import { RoutePlaceType } from "../Types/RoutePlaceType"

/**
 * View Model class to Create a Route, this can be used to either created and generated routes requests
 */
export class CreateRouteVM implements toJSONString {

    /**
     * Construct's an instance of {@link CreateRouteVM}.
     * 
     * @param places route's places.
     * @param name route's name.
     * @param isPrivate specifies if the route is private to the creator.
     */
    constructor(
        public places: Array<RoutePlaceType>,
        public name?: string,
        public isPrivate?: boolean
    ) { }

    /**
     * Converts the class into a string representation of a json object
     * 
     * @returns string representation of the object
     */
    public toJSONString(): string {
        return JSON.stringify(this)
    }
}