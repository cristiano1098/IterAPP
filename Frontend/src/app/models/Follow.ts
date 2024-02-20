/**
 * This model represents an user that is followed by another user
 * follower is the user that follows 
 * followed is the user that is being followed by the user referenced in the follower property
 */
export class Follow {
    /**
     * Construct's an instance of {@link Follow}
     * 
     * @param follower the follower user name
     * @param followed the user followed user name
     */
    constructor(
        public follower: string,
        public followed: string
    ) { }
}