import { toJSONString } from "../interfaces/toJSONString";
import { RoutePlaceType } from "../Types/RoutePlaceType";

/**
 * Represents an used route that is sent to the backend in order to store information about the route usage by a specific user.
 */
export class UsedRouteVM implements toJSONString {

    /**
     * Construct's an instance of {@link UsedRouteVM}
     * 
     * @param routeID used route's id.
     * @param visitedPlaces places visited by the user.
     */
    constructor(
        public routeID: number,
        public visitedPlaces?: Array<RoutePlaceType>
    ) { }

    /**
     * Converts the class into a string representation of a json object 
     * 
     * @returns string representation of the object
     */
    toJSONString(): string {

        let obj: any = {
        }

        if (this.routeID) {
            obj["routeID"] = this.routeID
        }

        if (this.visitedPlaces) {
            obj["visitedPlaces"] = this.visitedPlaces
        }

        return JSON.stringify(obj)
    }
}