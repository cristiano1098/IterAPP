import { toJSONString } from "../interfaces/toJSONString"
import { RoutePlaceType } from "../Types/RoutePlaceType"

/**
 * View Model class for Route creatin and verification requests.
 */
export class CreateUseRouteVM implements toJSONString {

    /**
     * Construct's an instance of {@link CreateUseRouteVM}
     * 
     * @param places places used on the route and it's visiting times.
     * @param name route's name
     */
    constructor(
        public places: Array<RoutePlaceType>,
        public name: string
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