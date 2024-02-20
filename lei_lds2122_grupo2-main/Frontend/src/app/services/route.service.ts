import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentRouteVM } from '../viewModels/requests/CommentRouteVM';
import { CreateUseRouteVM } from '../viewModels/requests/CreateUseRouteVM';
import { GenerateRouteVM } from '../viewModels/requests/GenerateRouteVM';
import { UsedRouteVM } from '../viewModels/requests/UsedRouteVM';
import { GeneratedRouteVM } from '../viewModels/responses/GeneratedRouteVM';
import { ListRoutesVM } from '../viewModels/responses/ListRoutesVM';
import { RouteVM } from '../viewModels/responses/RouteVM';
import { EvaluateRouteVM } from '../viewModels/requests/EvaluateRouteVM';
import { RouteResumeType } from '../viewModels/Types/RouteResumeType';

/**
 * Http Options for all http requests.
 */
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

/**
 * Service that interacts with the backend relative to route creation usage, generation, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class RouteService {

  /**
   * Base Url to connect to the backedn server.
   */
  private baseUrl = "https://localhost:7072/api/Routes/"

  /**
   * @ignore
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Sends a create Route request.
   * 
   * @param routeVm the route to be created.
   * @returns an observable with the provided answer.
   */
  createRoute(routeVm: CreateUseRouteVM): Observable<any> {
    return this.http.post(this.baseUrl + "createRoute", routeVm.toJSONString(), httpOptions)
  }

  /**
   * Sends a generate route request
   * 
   * @param generateRouteVM route to be generated
   * @returns an observable with the provided answer.
   */
  generateRoute(generateRouteVM: GenerateRouteVM): Observable<GeneratedRouteVM> {
    return this.http.post<GeneratedRouteVM>(this.baseUrl + "generateRoute", generateRouteVM.toJSONString(), httpOptions)
  }

  /**
   * Sends a request to get the information about a route given it's id.
   * 
   * @param id the route's id to get.
   * @returns an observable with the provided answer.
   */
  getRoute(id: number): Observable<RouteVM> {
    return this.http.get<RouteVM>(this.baseUrl + id, httpOptions)
  }

  /**
   * Sends a request to use a route given a {@link UsedRouteVM}.
   * 
   * @param usedRoute the used route.
   * @returns an observable with the provided answer.
   */
  useRoute(usedRoute: UsedRouteVM): Observable<any> {
    return this.http.post(this.baseUrl + "useRoute", usedRoute.toJSONString(), httpOptions)
  }

  /**
   * Sends a request to verify if a route is valid .
   * 
   * @param routeVM the route to be verified.
   * @returns an observable with the provided answer.
   */
  verifyRoute(routeVM: CreateUseRouteVM): Observable<any> {
    return this.http.post(this.baseUrl + 'verifyRoute', routeVM.toJSONString(), httpOptions)
  }

  /**
   * Sends a request to get the home page routes for an authenticated user.
   * The routes are the ones created by the users, that the user follows.
   * 
   * @returns the routes of the following users.
   */
  getFollowingRoutes(): Observable<ListRoutesVM> {
    return this.http.get<ListRoutesVM>(this.baseUrl + "followingRoutes")
  }

  /**
   * Sends a request to add a route to the logged in user favorite routes.
   * 
   * @param routeID the route to be added to the favorite routes
   * @returns An observable with no relevant information
   */
  addFavoriteRoute(routeID: number): Observable<any> {
    return this.http.post(this.baseUrl + `${routeID}/favorite`, "")
  }

  /**
   * Sends a request to remove a route from the logged in user favorite routes.
   * 
   * @param routeID the route to be removed from the favorite routes
   * @returns An observable with no relevant information
   */
  removeFavoriteRoute(routeID: number): Observable<any> {
    return this.http.delete(this.baseUrl + `${routeID}/favorite`)
  }

  /**
   * Gets the used routes from the logged in user
   * 
   * @returns the {@link ListRoutesVM}
   */
  getUsedRoutes(): Observable<ListRoutesVM> {
    return this.http.get<ListRoutesVM>(this.baseUrl + "used")
  }

  /**
   * Gets the favorite routes from the logged in user
   * 
   * @returns the {@link ListRoutesVM}
   */
   getFavoriteRoutes(): Observable<ListRoutesVM> {
    return this.http.get<ListRoutesVM>(this.baseUrl + "favorite")
  }

  /**
   * Comments a route
   * 
   * @param routeID the route to be commented
   * @param comment the comment made by the user
   * @returns an observable without relevant information.
   */
  commentRoute(routeID: number, comment: CommentRouteVM): Observable<any> {
    return this.http.post(this.baseUrl + routeID.toString() + "/commentRoute", comment.toJSONString(), httpOptions)
  }

  /**
   *Evaluate a route
   * @param routeID 
   * @param rate 
   * @returns 
   */
  evaluateRoute(routeID: number, rate: number): Observable<any> {
    return this.http.post(this.baseUrl + routeID.toString() + "/rate", new EvaluateRouteVM(rate).toJSONString(), httpOptions)
  }

  /**
   * Searches a route by its name or a part of it.
   * 
   * @param routeName the name, or a part of it, of the route to be searched.
   */
  searchRoute(routeName: string): Observable<Array<RouteResumeType>> {
    return this.http.get<Array<RouteResumeType>>(this.baseUrl + `search/${routeName}`, httpOptions)
  }

}
