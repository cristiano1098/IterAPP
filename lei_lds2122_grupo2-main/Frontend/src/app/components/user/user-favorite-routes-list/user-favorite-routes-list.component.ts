import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaceView } from 'src/app/models/Place';
import { RouteView } from 'src/app/models/Route';
import { PlaceService } from 'src/app/services/place.service';
import { RouteService } from 'src/app/services/route.service';
import { UtilitiesComponent } from '../../utilities/utilities.component';
import { RouteListComponent } from '../../route/route-list/route-list.component';

/**
 * This component lists all favorite routes from the logged in user.
 */
@Component({
  selector: 'app-user-favorite-routes-list',
  templateUrl: './user-favorite-routes-list.component.html',
  styleUrls: ['./user-favorite-routes-list.component.css']
})
export class UserFavoriteRoutesListComponent implements OnInit {

  /**
   * Favorite Routes List
   */
  @ViewChild(RouteListComponent) routeList?: RouteListComponent

  /**
   * @ignore
   */
  constructor(private routeService: RouteService, private placeService: PlaceService) { }


  /**
   * @ignore
   */
  ngOnInit(): void {
    UtilitiesComponent.autoResizeDiv("divMain")
    this.loadRoutes();
  }

  /**
   * Loads the used Routes
   */
  loadRoutes() {
    this.routeService.getFavoriteRoutes().subscribe(
      (result) => {
        let routes = result.routes;

        if (routes.length == 0) return

        this.routeList?.setRoutes(routes)
      }
    )
  }

}
