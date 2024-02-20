import { PlaceView } from "./Place";

/**
 * Represents a route
 */
export class Route {

  /**
   * Construct's an instance of {@link Route}.
   * 
   * @param Id route's id
   * @param name route's name
   * @param isPrivate specifies if the route is private to the user who created it 
   * @param description route's description
   * @param creationDate route's creation date
   * @param userName route's creator user name
   */
  constructor(
    public Id: Number,
    public name: String,
    public isPrivate: Boolean,
    public description: string,
    public creationDate: Date,
    public userName: string
  ) { }
}

/**
 * This Model represents the information need to display a {@link Route} in a {@link Route} card, such as the ones that are present in the {@link AuthenticatedHomePageComponent}
 */
export class RouteView {

  /**
   * Construct's an instance of {@link RouteView}.
   * 
   * @param name the route name
   * @param routeID the route id
   * @param averageRating the route average rating
   * @param userName the route creator user name
   * @param description the route description
   * @param numberOfUses the route number of uses
   * @param places the route places
   * @param categories the route categories
   * @param profilePhoto the route creator profile photo url
   */
  constructor(
    public name: string,
    public routeID: number,
    public averageRating: number,
    public userName: string,
    public description: string,
    public numberOfUses: number,
    public places: Array<PlaceView>, /* x */
    public categories: Array<string>, /* x */
    public profilePhoto?: string

  ) { }
}