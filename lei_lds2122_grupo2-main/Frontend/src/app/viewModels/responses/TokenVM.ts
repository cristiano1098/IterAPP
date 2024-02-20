
/**
 * View Model that represents a Token repsonse
 * Tokens are received when angular performs a login request
 */
export class TokenVM {

    /**
     * Construct's an instance of {@link TokenVM}
     * 
     * @param token bearer token
     */
    constructor(
        public token: string
    ) { }
}