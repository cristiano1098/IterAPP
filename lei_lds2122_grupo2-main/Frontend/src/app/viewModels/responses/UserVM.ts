import { toJSONString } from "../interfaces/toJSONString";

/**
 * View Model that represents an User with all it's properties
 */
export class UserVM implements toJSONString{

    /**
     * Construct's an instance of {@link UserVM}
     * 
     * @param userName user's user name
     * @param email user's email
     * @param name user's name
     * @param birthDate user's birth date
     * @param privateProfile Specifies if the user has a private profile
     * @param description user's description
     * @param profilePhoto user's profile photo url
     */
    constructor(
        public userName: string,
        public email: string,
        public name: string,
        public birthDate: string,
        public privateProfile: Boolean,
        public description: string,
        public profilePhoto: string,
    ) { }

    /**
     * Converts the class into a string representation of a json object 
     * 
     * @returns string representation of the object
     */
    toJSONString(): string {
        return JSON.stringify(this)
    }

}