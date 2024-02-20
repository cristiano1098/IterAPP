
/**
 * This type represents a comment from a specific user.
 */
export class CommentType {

    /**
     * Construct's an instance of {@link CommentType}
     * 
     * @param userName user name of the user who made the comment.
     * @param comment comment made by the user.
     */
    constructor(
        public userName: string,
        public comment: string
    ) { }
}