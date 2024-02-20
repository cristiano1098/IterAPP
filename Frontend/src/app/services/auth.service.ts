import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginVM } from '../viewModels/requests/LoginVM';
import { CreateUserVM } from '../viewModels/requests/CreateUserVM';
import { UtilitiesComponent } from '../components/utilities/utilities.component';

/**
 * Http Options for all http requests.
 */
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

/**
 * Service that allows for all authentication requests.
 * 
 * This service also keeps track of the user login status.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Base Url to connect to the backedn server.
   */
  baseUrl: string = "https://localhost:7072/api/"

  /**
   * Specifies if the user is logged in or not
   */
  private isLoggedIn = new BehaviorSubject<Boolean>(UtilitiesComponent.isLoggedIn());

  /**
   * Observable to be used by the components in order to receive the information about the current login status.
   */
  currentLoginStatus = this.isLoggedIn.asObservable();

  /**
   * @ignore
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Updates the loggin status.
   * Adds a next value to the isLoggedIn property, allowing the components that subscribed this change to receive it.
   */
  updateLoggedInStatus() {
    this.isLoggedIn.next(UtilitiesComponent.isLoggedIn())
  }

  /**
   * Sends a login request to the backend
   * 
   * @param login login information
   * @returns  an observable with the provided answer.
   */
  login(login: LoginVM): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'Users/login', login.toJSONString(), httpOptions);
  }

  /**
   * Sends a register reques to the backend
   * 
   * @param register the register information
   * @returns an observable with the provided answer.
   */
  register(register: CreateUserVM): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'Users/createAccount', register.toJSONString(), httpOptions);
  }
}
