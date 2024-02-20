import { toJSONString } from "../interfaces/toJSONString";
import { ChangePasswordVM } from "./ChangePasswordVM";

/**
 * View Model for a reset password request
 */
export class ResetPasswordVM extends ChangePasswordVM implements toJSONString {

    /**
     * Construct's an instance of {@link ResetPasswordVM}
     * 
     * @param password new password
     * @param email user's email
     */
    constructor(
        public password: string,
        public email: string
    ) {
        super(password)
    }

    /**
     * Converts the class into a string representation of a json object 
     * 
     * @returns string representation of the object
     */
    toJSONString(): string {
        return JSON.stringify(this)
    }

}