import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { googlePlaceVM } from '../viewModels/responses/googlePlaceVM';
import { PlacesVM } from '../viewModels/responses/PlacesVM';



/**
 * Http Options for all http requests.
 */
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

/**
 * Service used to request [place's]{@link Place} information to the backend.
 */
@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  /**
   * Base Url to connect to the backedn server.
   */
  private static baseUrl = "https://localhost:7072/api/Places/"

  /**
   * @ignore
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets all details about one place.
   * 
   * @param placeID the place to get the details.
   */
  getPlace(placeID: string): Observable<googlePlaceVM> {
    return this.http.get<googlePlaceVM>(PlaceService.baseUrl + placeID)
  }

  /**
   * Returns the request that has to be performed to get the place photo.
   * 
   * @param placeID place id
   * @returns the url of the place photo.
   */
  static getPlacePhotoURL(placeID: string): string {
    return PlaceService.baseUrl + `photo/${placeID}`
  }

  addVisitedPlace(placeID: string): Observable<any> {
    return this.http.post(PlaceService.baseUrl + `${placeID}/visited`, "")
  }

  addInterestedPlace(placeID: string): Observable<any> {
    return this.http.post(PlaceService.baseUrl + `${placeID}/interested`, "")
  }

  removeVisitedPlace(placeID: string): Observable<any> {
    return this.http.delete(PlaceService.baseUrl + `${placeID}/removeVisitedPlace`)
  }

  removeInterestedPlace(placeID: string): Observable<any> {
    return this.http.delete(PlaceService.baseUrl + `${placeID}/removeInterestedPlace`)
  }





  /**
   * Backend request to get a list of Visited Places
   */
  getVisitedPlaces(): Observable<PlacesVM> {
    return this.http.get<PlacesVM>(PlaceService.baseUrl + "visited", httpOptions);
  }

  /**
  * Backend request to get a list of Interested Places
  */
  getInterestedPlaces(): Observable<PlacesVM> {
    return this.http.get<PlacesVM>(PlaceService.baseUrl + "interested", httpOptions);
  }

}
