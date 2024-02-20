/**
 * This class represents an User
 */
export class User {

    /**
     * Construct's an instance of {@link User}
     * 
     * @param userName user's user name
     * @param name user's name
     * @param birthDate user's birth date
     * @param email user's email
     * @param password user's password
     * @param privateProfile defines if the user profile is private or visible to other users
     * @param description user's description
     * @param profilePhoto user's profile photo url
     */
    constructor(
        public userName: string,
        public name: string,
        public birthDate: Date,
        public email: string,
        public password: string,
        public privateProfile: Boolean,
        public description?: string,
        public profilePhoto?: string
        // Profile photo can be obtained by querying the backend with username
    ) { }
}
