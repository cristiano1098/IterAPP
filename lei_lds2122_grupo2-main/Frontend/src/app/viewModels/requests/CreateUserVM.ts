import { toJSONString } from "../interfaces/toJSONString";

/**
 * View Model class for a Create User request
 */
export class CreateUserVM implements toJSONString {

    /**
     * Construct's an instance of {@link CreateUserVM}
     * 
     * @param userName user's user name
     * @param email user's email
     * @param name user's name
     * @param birthDate user's birth date
     * @param password user's password
     */
    constructor(
        public userName: string,
        public email: string,
        public name: string,
        public birthDate: Date,
        public password: string
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