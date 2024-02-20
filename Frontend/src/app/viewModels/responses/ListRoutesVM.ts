import { RouteResumeType } from "../Types/RouteResumeType";

/**
 * Represents a resumed route list, that is, without the locals information 
 */
export class ListRoutesVM {

    /**
     * Construct's an instance of {@link ListRoutesVM}
     * 
     * @param routes list of routes
     */
    constructor(
        public routes: Array<RouteResumeType>
    ) { }
}