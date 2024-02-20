import { toJSONString } from "../interfaces/toJSONString";

/**
 * View Model class for Change Password request
 */
export class ChangePasswordVM implements toJSONString{

    /**
     * Construct's an instance of {@link ChangePasswordVM}
     * 
     * @param password new password
     */
    constructor(
        public password: string
    ) { }

    /**
     * Converts the class into a string representation of a json object 
     * 
     * @returns string representation of the object
     */
    public toJSONString(): string {
        return JSON.stringify({"password":this.password})
    }
}