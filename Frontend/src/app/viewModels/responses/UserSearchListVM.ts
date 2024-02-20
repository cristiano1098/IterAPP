import { UserResultVM } from "./UserResultVM";

/**
 * View Model class for the list of users that results from a user search
 */
export class UserSearchListVM {

    /**
     * Construct's an instance of {@link UserSearchListVM}
     * 
     * @param users an array of {@link UserResultVM}
     */
    constructor(
        public users: Array<UserResultVM>
    ){}
}