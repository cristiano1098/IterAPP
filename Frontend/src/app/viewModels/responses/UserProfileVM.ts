import { RouteResumeType } from "../Types/RouteResumeType";

/**
 * View Model that represents an User and it's routes.
 */
export class UserProfileVM {

    /**
     * Construct's an instance of {@link UserProfileVM}
     * 
     * @param userName user's user name
     * @param name user's name
     * @param privateProfile Specifies if the user has a private profile
     * @param description user's description
     * @param profilePhoto user's profile photo url
     * @param publicRoutes user's list of public routes
     * @param numberFollowers user's number of followers
     * @param numberFollowing number of users followed by the user.
     * @param followState indicates if the logged in user follows this user.
     */
    constructor(
        public userName: string,
        public name: string,
        public privateProfile: Boolean,
        public description: string,
        public profilePhoto: string,
        public publicRoutes?: Array<RouteResumeType>,
        public numberFollowers?: number,
        public numberFollowing?: number,
        public followState?: number
        
    ) { }
}