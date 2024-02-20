import { toJSONString } from "../interfaces/toJSONString";

/**
 * View Model class for a Create User request
 */
export class GenerateRouteVM implements toJSONString {

    /**
     * Construct's an instance of {@link GenerateRouteVM}
     * 
     * @param name route's name.
     * @param startTime route's start date.
     * @param finishTime route's finish date.
     * @param visitedPlaces Specifies if the generated route should have palces already visited.
     * @param categories route's categories.
     */
    constructor(
        public name: string,
        public startTime: Date,
        public finishTime: Date,
        public visitedPlaces: Boolean,
        public categories: Array<string>
    ) { }

    /**
     * Converts the class into a string representation of a json object 
     * 
     * @returns string representation of the object
     */
    toJSONString(): string {
        return JSON.stringify(this)
    }

}