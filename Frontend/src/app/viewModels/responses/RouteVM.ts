import { CommentType } from "../Types/CommentType";
import { RouteResumeType } from "../Types/RouteResumeType";

/**
 * View Model that represents a response when a route is requested
 */
export class RouteVM {

    /**
     * Construct's an instance of {@link RouteVM}
     * 
     * @param createDate route's creation date
     * @param routeResume route's resume
     * @param comments route's comment list
     */
    constructor(
        public createDate: Date,
        public routeResume: RouteResumeType,
        public comments?: Array<CommentType>
    ) { }
}