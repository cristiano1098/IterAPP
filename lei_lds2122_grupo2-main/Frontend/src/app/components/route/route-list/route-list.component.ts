import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlaceView } from 'src/app/models/Place';
import { RouteView } from 'src/app/models/Route';
import { PlaceService } from 'src/app/services/place.service';
import { RouteResumeType } from 'src/app/viewModels/Types/RouteResumeType';
import { categoriesTranslations } from '../categoriesTranslations';

/**
 * This component lists routes that are given via the parent component.
 * There is no path to this component, and it should be used inside another component as a child.
 */
@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})
export class RouteListComponent implements OnInit {

  /**
   * [Routes]{@link RouteView} to be displayed in the page.
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
  constructor(private router: Router, private placeService: PlaceService) { }

  /**
   * @ignore
   */
  ngOnInit(): void {
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

  /**
   * Fills the {@link RouteListComponent#routes} variable with all routes from a specified {@link RouteResumeType} array.
   * 
   * @param routes the {@link RouteResumeType} array to be transformed to a {@link RouteView} array
   */
  setRoutes(routes: Array<RouteResumeType>) {
    this.routes = new Array()

    if (routes.length == 0) return

    routes.forEach((route, routeIndex) => {
      let newRoute = new RouteView(route.name, route.routeID, route.averageRating, route.userName, route.description, route.numberOfUses, [], [], route.profilePhoto);

      this.routes!.push(newRoute)
      let insertedIndex = this.routes!.length - 1

      route.places.forEach((place, placeIndex) => {
        let placeID = place.idPlace
        this.placeService.getPlace(placeID).subscribe(
          (placeInfo) => {
            let photo_url = PlaceService.getPlacePhotoURL(placeID)

            let newPlace = new PlaceView(placeID, placeInfo.types, photo_url)
            this.routes![insertedIndex].places.push(newPlace)
          },
          (error) => {
            console.error(error)
          },
          () => {
            if (placeIndex == (route.places.length - 1)) {
              this.addCategories(routeIndex)
            }
          }
        )
      })
    })
  }

  /**
   * Adds all {@link places} categories to the {@link RouteView} in the {@link RouteListComponent#routes}.
   * Repeated categories are not added.
   */
  private addCategories(routeIndex: number) {
    if (this.routes) {
      this.routes[routeIndex].places.forEach(
        (place) => {
          place.categories.forEach(
            (categorie) => {
              for (let index = 0; index < this.routes![routeIndex].categories.length; index++) {
                const element = this.routes![routeIndex].categories[index];

                if (element == categorie) return
              }

              this.routes![routeIndex].categories.push(categorie);
            }
          )
        }
      )
    }
  }

  redirectToRoute(routeID: number) {
    this.router.navigate(['route', routeID])
  }

  navigateUser(userName: string) {
    this.router.navigate(['user', userName])
  }

}
