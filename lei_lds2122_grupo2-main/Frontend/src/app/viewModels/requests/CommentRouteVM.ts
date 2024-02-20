import { toJSONString } from "../interfaces/toJSONString";

/**
 * View Model class for a comment request
 */
export class CommentRouteVM implements toJSONString {

    /**
     * Construct's an instance of {@link CommentRouteVM}
     * 
     * @param comment the comment
     */
    constructor(
        public comment: string
    ) { }

    /**
     * Converts the class into a string representation of a json object 
     * 
     * @returns string representation of the object
     */
    public toJSONString(): string {
        return JSON.stringify({ "comment": this.comment })
    }
}