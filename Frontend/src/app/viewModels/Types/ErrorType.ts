/**
 * Type class that represents an error with a name and description
 */
export class ErrorType {

    /**
     * Construct's an instance of {@link ErrorType}
     * 
     * @param name error's name
     * @param description error's description
     */
    constructor(
        public name: string,
        public description: string
    ) { }
}