/**
 * View Model class for each result in UserSearchListVM
 */
export class UserResultVM {

    /**
     * Construct's an instance of {@link UserResultVM}
     * 
     * @param userName user name of the user
     * @param name full name of the user
     * @param profilePhoto url link to the user photo
     */
    constructor(
        public userName: string,
        public name: string,
        public profilePhoto: string
    ){}
}