/**
 * This model represents a comment in a route that belongs to a certain user
 */
export class Comment {

    /**
     * Construct's an instance of {@link Comment}
     * 
     * @param comment the comment made by the user about a route
     * @param userName the user who made the comment
     * @param routeId the routeId on what the comment was made
     */
    constructor(
        public comment: string,
        public userName: string,
        public routeId: Number
    ) { }
}