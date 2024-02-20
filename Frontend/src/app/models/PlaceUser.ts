/**
 * This model represents a place that the user marked as an place with interest.
 */
export class InterestedPlace {

    /**
     * Construct's an instance of {@link InterestedPlace}.
     * 
     * @param placeId the place id that the user has an interest of visiting.
     * @param userName the user that has an interest to visit a place.
     */
    constructor(
        public placeId: string,
        public userName: string
    ) { }
}

/**
 * This model represents a place was visited by the user
 */
export class VisitedPlaces {

    /**
     * Construct's an instance of {@link VisitedPlaces}.
     * 
     * @param username the user that visited the place.
     * @param placeID the visited place.
     */
    constructor(
        public username: String,
        public placeID: String
    ) { }
}
