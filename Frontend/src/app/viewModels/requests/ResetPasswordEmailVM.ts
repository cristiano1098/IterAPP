import { toJSONString } from "../interfaces/toJSONString";

/**
 * View Model for a reset password link request
 * This model its used to get a link to the specified email so that the user password can be changed
 */
export class ResetPasswordEmailVM implements toJSONString {

    /**
     * Construct's an instance of {@link ResetPasswordEmailVM}
     * 
     * @param email user's email.
     */
    constructor(
        public email: string
    ) { }

    /**
     * Converts the class into a string representation of a json object 
     * 
     * @returns string representation of the object
     */
    toJSONString(): string {
        return JSON.stringify({ "email": this.email })
    }

}