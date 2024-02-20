import { Injectable } from '@angular/core';
import { PlaceVisit } from '../models/PlaceVisit';

/**
 * This service allows sharing of a {@link Route} between components. This route only has places and a name.
 */
@Injectable({
  providedIn: 'root'
})
export class RouteShareService {

  /**
   * @ignore
   */
  constructor() {
  }

  /**
   * Stores the route name in the local storage.
   * 
   * @param routeName route's name.
   */
  static addName(routeName: string) {
    localStorage.setItem("routeName", routeName)
  }

  /**
   * Gets the route's name.
   * 
   * @returns the route's name.
   */
  static getName() {
    return localStorage.getItem("routeName")
  }

  /**
   * Gets the route's id.
   * 
   * @returns the route's id.
   */
  static getRouteID() {
    return localStorage.getItem("routeID")
  }

  /**
   * Adds a place to the route.
   * 
   * @param place place to be added.
   */
  static addPlace(place: PlaceVisit) {
    let places = this.getPlaces()
    places.push(place)

    localStorage.setItem("places", JSON.stringify(places))
  }

  /**
   * Gets all the the route's places.
   * 
   * @returns the route's places.
   */
  static getPlaces(): Array<PlaceVisit> {
    let storedPlaces = localStorage.getItem("places")
    if (storedPlaces == null) {
      storedPlaces = "[]"
    }

    return JSON.parse(storedPlaces)
  }

  /**
   * Removes the route from the local storage
   */
  static clear() {
    localStorage.removeItem("places")
    localStorage.removeItem("routeName")
    localStorage.removeItem("routeID")
  }
}
