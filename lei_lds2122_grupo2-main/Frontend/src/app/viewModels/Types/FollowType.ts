/**
 * A type class that represents a user that follows another user
 */
export class FollowType {

    /**
     * Construct's an instance of {@link FollowType}
     * 
     * @param userName user's user name.
     * @param name user's name.
     * @param follow Specifies if the user follows the user.
     * @param profilePhoto user's profile photo url
     */
    constructor(
        public userName: string,
        public name: string,
        public follow: Boolean,
        public profilePhoto: string,
    ) { }
}