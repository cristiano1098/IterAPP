import { ErrorType } from "../Types/ErrorType";

/**
 * View Model for a response with errors
 */
export class ErrorsVM {

    /**
     * Construct's an instance of {@link ErrorsVM}
     * 
     * @param errors errors array
     */
    constructor(
        public errors: Array<ErrorType>
    ) { }
}