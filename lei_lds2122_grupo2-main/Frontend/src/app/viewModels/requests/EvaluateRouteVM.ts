import { toJSONString } from "../interfaces/toJSONString";

/**
 * View Model class for an Evaluate Route request
 */
export class EvaluateRouteVM implements toJSONString {

    /**
     * Construct's an instance of {@link EvaluateRouteVM}
     * 
     * @param evaluation given evaluation
     */
    constructor(
        public evaluation: Number
    ) { }

    /**
     * Converts the class into a string representation of a json object 
     * 
     * @returns string representation of the object
     */
    toJSONString(): string {
        return JSON.stringify({ "evaluation": this.evaluation })
    }

}