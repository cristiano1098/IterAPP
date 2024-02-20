import { Component, OnInit } from '@angular/core';
import { PlaceView } from 'src/app/models/Place';
import { RouteView } from 'src/app/models/Route';
import { PlaceService } from 'src/app/services/place.service';
import { RouteService } from 'src/app/services/route.service';
import { UtilitiesComponent } from '../../utilities/utilities.component';

/**
 * This component lists all used routes from the logged in user.
 */
@Component({
  selector: 'app-user-used-routes-list',
  templateUrl: './user-used-routes-list.component.html',
  styleUrls: ['./user-used-routes-list.component.css']
})
export class UserUsedRoutesListComponent implements OnInit {

  /**
   * [Used Routes]{@link RouteView} to be displayed in the page.
   */
  usedRoutes: Array<RouteView> = []

  /**
   * @ignore
   */
  constructor(private routeService: RouteService, private placeService: PlaceService) { }

  /**
   * @ignore
   */
  ngOnInit(): void {
    UtilitiesComponent.autoResizeDiv("divMain")
    this.loadRoutes()
  }

  /**
   * Loads the used Routes
   */
  loadRoutes() {
    this.routeService.getUsedRoutes().subscribe(
      (result) => {
        let routes = result.routes;

        if (routes.length > 0) {
          routes.forEach(route => {
            let places = new Array<PlaceView>()
            let categories = new Array<string>()

            route.places.forEach((place, index) => {
              let placeID = place.idPlace
              this.placeService.getPlace(placeID).subscribe(
                (placeInfo) => {
                  let photo_url = PlaceService.getPlacePhotoURL(placeID)

                  let newPlace = new PlaceView(placeID, placeInfo.types, photo_url)
                  places.push(newPlace)
                  console.log(newPlace);

                },
                (error) => {
                  console.error(error);
                },
                () => {
                  places.forEach((place) => {
                    place.categories.forEach((categorie) => {
                      let categorieExists = false
                      for (const addedCategorie of categories) {
                        if (addedCategorie == categorie) {
                          categorieExists = true
                          break;
                        }
                      }

                      if (!categorieExists) {
                        categories.push(categorie)
                      }
                    })
                  })

                  let newRoute = new RouteView(route.name, route.routeID, route.averageRating, route.userName, route.description, route.numberOfUses, places, categories, route.profilePhoto);
                  console.log(newRoute);

                  this.usedRoutes.push(newRoute)
                }
              )
            })
          });
        }
      }
    )
  }

}
