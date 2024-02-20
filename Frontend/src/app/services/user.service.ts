import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileVM } from '../viewModels/responses/UserProfileVM';
import { RouteResumeType } from '../viewModels/Types/RouteResumeType';
import { UserVM } from '../viewModels/responses/UserVM';
import { Follow } from '../models/Follow';
import { FollowVM } from '../viewModels/responses/FollowVM';
import { UserSearchListVM } from '../viewModels/responses/UserSearchListVM';
import { ListRoutesVM } from '../viewModels/responses/ListRoutesVM';

/**
 * Http Options for all http requests.
 */
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

/**
 * Service that interacts with the backend relative to user creation, edit, follow, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
   * Base Url to connect to the backedn server.
   */
  private baseUrl = "https://localhost:7072/api/Users/"

  /**
  * @ignore
  */
  constructor(private http: HttpClient) { }

  /**
   * Backend request to get an account
   * 
   */
  getAccount(): Observable<UserVM> {
    return this.http.get<UserVM>(this.baseUrl + "account", httpOptions)
  }

  /**
   * Backend request to get a routes list
   * @param privateRoutes 
   * @returns 
   */
  getRoutes(privateRoutes: boolean): Observable<ListRoutesVM> {
    return this.http.get<ListRoutesVM>(this.baseUrl + "routes" + `?isPrivate=${privateRoutes}`, httpOptions)
  }

  /**
   * Backend request to update an account
   * @param edit  View Model that will be sent to the backend with the updated data
   * @returns 
   */
  editAccount(edit: UserVM): Observable<any> {
    return this.http.put<any>(this.baseUrl + "account", edit.toJSONString(), httpOptions);
  }

  /**
    * Backend request to get a profile
    * @param userName
    * @returns 
    */
  getProfile(userName: String): Observable<UserProfileVM> {
    return this.http.get<UserProfileVM>(this.baseUrl + userName, httpOptions);
  }

  /**
    * Backend request to follow an user
    * @param userName
    * @returns 
    */
  follow(userName: String): Observable<any> {
    return this.http.post(this.baseUrl + userName + "/follow", httpOptions);
  }

  /**
   * Backend request to unfollow an user
   * @param userName
   * @returns 
   */
  unfollow(userName: String): Observable<any> {
    return this.http.delete<any>(this.baseUrl + userName + "/unfollow", httpOptions);
  }

   /**
   * Backend request to get follower list
   * @param userName
   * @returns 
   */
  getFollowers(userName: String): Observable<FollowVM> {
    return this.http.get<FollowVM>(this.baseUrl + userName + "/followers", httpOptions);
  }

  /**
   * Backend request to get following list
   * @param userName
   * @returns 
   */
  getFollowing(userName: String): Observable<FollowVM> {
    return this.http.get<FollowVM>(this.baseUrl + userName + "/following", httpOptions);
  }

  /**
   * Backend request to reject request to follow
   * @param userName
   * @returns 
   */
  rejectRequest(userName: String): Observable<FollowVM> {
    return this.http.delete<FollowVM>(this.baseUrl + userName + "/reject", httpOptions);
  }

  /**
   * Backend request to accept request to follow
   * @param userName
   * @returns 
   */
  acceptRequest(userName: String): Observable<FollowVM> {
    return this.http.post<FollowVM>(this.baseUrl + userName + "/accept", httpOptions);
  }

  /**
   * Backend request to get list of requests to follow
   * @param userName
   * @returns 
   */
  getRequestsToFollow(): Observable<FollowVM> {
    return this.http.get<FollowVM>(this.baseUrl+ "account/requestsToFollow", httpOptions);
  }


  /**
   * Backend request to search an user.
   * 
   * @param userName the user name of the user to be searched
   * @returns An observable that contains a list of the search results.
   */
  searchUser(userName: string): Observable<UserSearchListVM> {
    return this.http.get<UserSearchListVM>(this.baseUrl + `search/${userName}`)
  }
}
