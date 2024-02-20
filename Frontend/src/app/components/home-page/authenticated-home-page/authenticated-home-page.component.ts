import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaceView } from 'src/app/models/Place';
import { Route, RouteView } from 'src/app/models/Route';
import { PlaceService } from 'src/app/services/place.service';
import { RouteService } from 'src/app/services/route.service';
import { categoriesTranslations } from '../../route/categoriesTranslations';
import { RouteListComponent } from '../../route/route-list/route-list.component';
import { UtilitiesComponent } from '../../utilities/utilities.component';

/**
 * This component shows a home page that is visible to authenticated users.
 * 
 * The home page displays several routes from the people that the user follows.
 */
@Component({
  selector: 'app-authenticated-home-page',
  templateUrl: './authenticated-home-page.component.html',
  styleUrls: ['./authenticated-home-page.component.css']
})
export class AuthenticatedHomePageComponent implements OnInit {

  /**
   * Specifies if the show more button is or not activated.
   * 
   * If this is true then extra options will apear in the left menu.
   */
  showingMore: boolean = false

  userName: string = ""

  /**
   * [Place's]{@link Place} categories translations
   */
  translations: any = categoriesTranslations

  @ViewChild(RouteListComponent) routeList?: RouteListComponent

  /**
   * @ignore
   */
  constructor(private routeService: RouteService, private placeService: PlaceService) { }

  /**
   * @ignore
   */
  ngOnInit(): void {
    let tmp = UtilitiesComponent.getLoggedInUserName()
    if (tmp != null) {
      this.userName = tmp
    }
    this.loadRoutes()
    UtilitiesComponent.autoResizeIfSmaller("divMain")
  }

  /**
   * Shows more menu options in the left menu of the page.
   */
  showMore() {
    this.showingMore = !this.showingMore
  }

  /**
   * Loads the routes for the main page. <br>
   * All routes displayed are requested to the backend and belong to [users]{@link User} that are followed by the logged in [user]{@link User}. <br>
   * All needed places information is requested to the backend.
   */
  loadRoutes() {
    this.routeService.getFollowingRoutes().subscribe(
      (result) => {
        let routes = result.routes;

        if (routes.length == 0) return

        this.routeList?.setRoutes(routes)

      }
    )
  }

}