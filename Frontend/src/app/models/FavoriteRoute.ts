/**
 * This model represents an user's favorite route 
 */
export class FavoriteRoute {

    /**
     * Construct's an instance of {@link FavoriteRoute}
     * 
     * @param userName the user that has the route marked as favorite
     * @param routeId the route marked as favorite
     */
    constructor(
        public userName: string,
        public routeId: string
    ) { }
}