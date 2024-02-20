import { toJSONString } from "../interfaces/toJSONString"

/**
 * View Model for a login request
 */
export class LoginVM implements toJSONString {

    /**
     * Construct's an instance of {@link LoginVM}
     * 
     * @param email user's email
     * @param password user's password
     */
    constructor(
        public email: string,
        public password: string
    ) { }

    /**
     * Converts the class into a string representation of a json object 
     * 
     * @returns string representation of the object
     */
    public toJSONString(): string {
        return JSON.stringify(this)
    }
}