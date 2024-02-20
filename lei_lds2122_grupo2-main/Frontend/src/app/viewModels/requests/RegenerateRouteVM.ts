import { toJSONString } from "../interfaces/toJSONString";
import { GenerateRouteVM } from "./GenerateRouteVM";

/**
 * View Model class for a re-generate Route request
 */
export class RegenerateRouteVM extends GenerateRouteVM implements toJSONString {

    /**
     * Construct's an instance of {@link RegenerateRouteVM}
     * 
     * @param name route's name
     * @param startTime route's start date
     * @param finishTime route's finishs date
     * @param visitedPlaces Specifies if the generated route should have palces already visited.
     * @param categories route's categories
     * @param deletedPlaces places that were deleted by the user.
     */
    constructor(
        public name: string,
        public startTime: Date,
        public finishTime: Date,
        public visitedPlaces: Boolean,
        public categories: Array<string>,
        public deletedPlaces?: Array<string>
    ) {
        super(name, startTime, finishTime, visitedPlaces, categories)
    }

    /**
     * Converts the class into a string representation of a json object 
     * 
     * @returns string representation of the object
     */
    toJSONString(): string {
        return JSON.stringify(this)
    }

}