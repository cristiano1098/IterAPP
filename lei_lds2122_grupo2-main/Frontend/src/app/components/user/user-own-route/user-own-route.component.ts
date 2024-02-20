import { Component, Input, OnInit } from '@angular/core';
import { Dropdown } from 'bootstrap';
import { RouteView } from 'src/app/models/Route';
import { categoriesTranslations } from '../../route/categoriesTranslations';

/**
 * Represents an list of routes that belong to the user that is authenticated
 */
@Component({
  selector: 'app-user-own-route',
  templateUrl: './user-own-route.component.html',
  styleUrls: ['./user-own-route.component.css', './../../route/route-list/route-list.component.css']
})
export class UserOwnRouteComponent implements OnInit {

  /**
   * User's routes.
   */
  @Input()
  routes?: Array<RouteView>


  /**
   * Google places types translations. For each relevant [type]{@link https://developers.google.com/maps/documentation/places/web-service/supported_types}
   * present in the places [type]{@link https://developers.google.com/maps/documentation/places/web-service/supported_types} array, a translation is specified.
   */
   translations: any = categoriesTranslations

  /**
   * @ignore
   */
  constructor() { }

  /**
   * @ignore
   */
  ngOnInit(): void {
  }
  
  toggleDropDown(dropdownID: string) {
    let button = document.getElementById(dropdownID) as HTMLElement
    let dropdown = new Dropdown(button)
    dropdown.toggle()
  }

  
  /**
   * Returns an array wich length is equal to the amount of full stars to be displayed in a {@link Route} card given the rating of the route.
   * There is a need to return an array because *ngFor directive only works on iterable objects. There is no way to make a traditional for.
   * 
   * @param averageRating the rating of the {@link Route}.
   * @returns An array with the amount of full stars that will be displayed in the {@link Route} card.
   */
   amountOfFullStars(averageRating: number): Array<any> {
    let integer = Number.parseInt(averageRating.toString())
    let decimals = averageRating - integer
    decimals = Number.parseFloat(decimals.toFixed(2))

    if (decimals > 0.75) {
      integer++
    }

    return new Array(integer)
  }

  /**
   * Returns an array wich length is equal to the amount of half stars to be displayed in a {@link Route} card given the rating of the route.
   * There is a need to return an array because *ngFor directive only works on iterable objects. There is no way to make a traditional for.
   * 
   * @param averageRating the rating of the {@link Route}.
   * @returns An array with the amount of half filled stars that will be displayed in the {@link Route} card.
   */
  displayHalfStar(averageRating: number): boolean {
    let integer = Number.parseInt(averageRating.toString())
    let decimals = averageRating - integer
    decimals = Number.parseFloat(decimals.toFixed(2))

    return 0.25 <= decimals && decimals <= 0.75
  }

  /**
   * Returns an array wich length is equal to the amount of empty stars to be displayed in a {@link Route} card given the rating of the route.
   * There is a need to return an array because *ngFor directive only works on iterable objects. There is no way to make a traditional for.
   * 
   * @param averageRating the rating of the {@link Route}.
   * @returns An array with the amount of empty filled stars that will be displayed in the {@link Route} card.
   */
  amountOfEmptyStars(averageRating: number): Array<any> {
    let amount = 0

    if (averageRating < 5) {
      let integer = Number.parseInt(averageRating.toString())
      let decimals = averageRating - integer
      decimals = Number.parseFloat(decimals.toFixed(2))

      amount = 5 - integer

      if (decimals >= 0.25) {
        amount--
      }

    }

    return new Array(amount)
  }


}
