import { FollowType } from "../Types/FollowType";

/**
 * View Model that represents a list of the following users.
 */
export class FollowVM {

    /**
     * Construct's an instance of {@link FollowVM}
     * 
     * @param follow List of following users
     */
    constructor(
        public follow: Array<FollowType>
    ) { }
}