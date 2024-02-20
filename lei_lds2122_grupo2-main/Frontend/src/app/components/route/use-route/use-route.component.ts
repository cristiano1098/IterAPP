import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { categoriesTranslations } from 'src/app/components/route/categoriesTranslations';
import { Place } from 'src/app/models/Place';
import { PlaceVisit } from 'src/app/models/PlaceVisit';
import { AuthService } from 'src/app/services/auth.service';
import { PlaceService } from 'src/app/services/place.service';
import { RouteShareService } from 'src/app/services/route-share.service';
import { RouteService } from 'src/app/services/route.service';
import { UsedRouteVM } from 'src/app/viewModels/requests/UsedRouteVM';
import { RoutePlaceType } from 'src/app/viewModels/Types/RoutePlaceType';
import { UtilitiesComponent } from '../../utilities/utilities.component';
import { MapComponent } from '../map/map.component';

/**
 * This component allows to use a [route]{@link Route} that is stored in the local storage <br>
 * This [route]{@link Route} will be previously stored by the {@link CreateRouteComponent} <br>
 * When the user clicks in the use route button a backend request will be performed with the 
 * visited places and the [route ID]{@link Route#Id}
 */
@Component({
  selector: 'app-use-route',
  templateUrl: './use-route.component.html',
  styleUrls: ['./use-route.component.css']
})
export class UseRouteComponent implements OnInit, AfterViewInit {

  /**
   * {@link MapComponent} that contains all the markers of all the {@link Route} selected 
   * [places]{@link UseRouteComponent#selectedPlaces}.
   * This map component has all the features of a google maps map 
   * ([Maps JavaScript API]{@link https://developers.google.com/maps/documentation/javascript/overview})
   */
  @ViewChild(MapComponent) map?: MapComponent

  /**
   * The routeID of the route to be used.
   * If there is no routeID, the route used will be the one in the local storage.
   */
  routeID?: number

  /**
   * Determines if the user is logged in
   */
  userLoggedIn: Boolean = UtilitiesComponent.isLoggedIn();

  /**
   * This variable stores all the [places]{@link PlaceVisit} relevant information present 
   * in the route and the visiting times of every [place]{@link PlaceVisit}
   */
  places: Array<PlaceVisit> = []

  /**
   * Boolean representation of the [places]{@link PlaceVisit} marked as visited by the user
   */
  selectedPlaces: Array<boolean> = []

  /**
   * The View Model used to comunicate with the backend to send the [useRoute]{@link RouteService#useRoute} request.
   */
  usedRoute: UsedRouteVM = new UsedRouteVM(0, [])

  /**
   * The name of the {@link Route}
   */
  routeName: string = ""

  /**
   * Translations to some [categories]{@link Place#categories} of a {@link Place}. 
   * This categories are sent via google maps not in a way that is not the best and in english,
   *  so we need to translate them.
   */
  translations: any = categoriesTranslations

  /**
   * This variable reprensets the time and will be iupdated every second with the current
   *  time on the funtion [startClock()]{@link UseRouteComponent#startClock}
   */
  time: any = {
    hours: "00",
    minutes: "00",
    seconds: "00"
  }

  /**
   * One instance of the login modal that can be used to show or hide the modal
   */
  loginModal?: Modal

  /**
   * This variable is used to alert the user that the route use information was saved successfully
   */
  successfullyUsed?: boolean

  /**
   * Variables that represent the current state of the component.
   */
  stateVariables: stateVariables = {
    backendConnection: true,
    finalizingRoute: false,
    successfullyUsed: false,
  }

  /**
   * @ignore
   */
  constructor(private routeService: RouteService, private authService: AuthService, private placeService: PlaceService, private route: ActivatedRoute, private router: Router) {
  }

  /**
   * Inits the component by getting and saving all information about the 
   * [places]{@link PlaceVisit} to be used in the {@link Route}.
   */
  ngOnInit(): void {
    this.loadRoute()
    this.startClock()
    this.subscribeLoginChanges()
  }

  /**
   * After all views are iniciated including the [map child component]{@link MapComponent} all 
   * [markers]{@link https://developers.google.com/maps/documentation/javascript/markers} are added to the [map]{@link MapComponent}. <br>
   * A Modal instance of the loginModal is created so the same instance is used everywhere. 
   * If two instances of the same modal are created the second one won't be able to use the Modal methods
   */
  ngAfterViewInit(): void {
    this.addMarkers()
    this.loginModal = new Modal(document.getElementById("loginModal") as HTMLElement)
  }

  /**
   * Gets and saves the {@link Route} information from the {@link RouteShareService}.
   * This route was previously created in the {@link CreateRouteComponent}.
   */
  loadRoute() {

    this.routeID = this.route.snapshot.params['routeID']
    console.log(this.routeID)

    if (!this.routeID) {
      this.loadLocalStorageRoute()
    } else {
      this.loadBackendRoute(this.routeID)
    }
  }

  /**
   * Loads the {@link Route} that is stored in the local storage.
   */
  loadLocalStorageRoute() {
    let places = RouteShareService.getPlaces()
    let routeID = RouteShareService.getRouteID()
    let routeName = RouteShareService.getName()

    if (routeID != null) {
      this.usedRoute.routeID = Number(routeID)
    }
    if (routeName != null) {
      this.routeName = routeName
    }

    this.places = places
    this.selectedPlaces = new Array<boolean>(this.places.length)
  }

  /**
   * Permorfs a backend request to load a specific route.
   */
  loadBackendRoute(routeID: number) {
    let finishedRouteSubscribe = false;
    this.usedRoute.routeID = routeID

    this.routeService.getRoute(routeID).subscribe(
      (result) => {
        let routePlaces = result.routeResume.places
        this.routeName = result.routeResume.name

        routePlaces.forEach((place, i) => {
          let placeID = place.idPlace
          this.placeService.getPlace(placeID).subscribe(
            (result) => {
              let newPlace = new PlaceVisit(
                result.place_id,
                result.name,
                result.types,
                {
                  lat: result.geometry.location.lat,
                  lon: result.geometry.location.lng
                },
                PlaceService.getPlacePhotoURL(placeID),
                RoutePlaceType.getStringTime(new Date(place.startTime)),
                RoutePlaceType.getStringTime(new Date(place.finishTime))
              )

              this.places.push(newPlace);
            },
            (error) => {
              console.error(error)
            },
            () => {
              if (routePlaces.length - 1 == i) {
                this.selectedPlaces = new Array<boolean>(this.places.length)
              }
            }
          )
        })
      },
      (error) => {
        console.error(error);
      },
      () => {
        finishedRouteSubscribe = true
        this.sortPlaces()
      }
    )
  }

  /**
   * Sorts the places in the {@link places} array
   */
  sortPlaces() {
    this.places.sort((first: PlaceVisit, second: PlaceVisit) => {
      let pattern = /(\d{2}):(\d{2})$/
      let firstMatch = pattern.exec(first.startTime)
      let secondMatch = pattern.exec(second.startTime)

      if (!(firstMatch && secondMatch)) return 0

      let firstHours = Number(firstMatch[1])
      let firstMinutes = Number(firstMatch[2])

      let secondHours = Number(secondMatch[1])
      let secondMinutes = Number(secondMatch[2])

      if (firstHours != secondHours) {
        return firstHours - secondHours
      } else {
        return firstMinutes - secondMinutes
      }
    })
  }

  /**
   * Hides all modals backgorund if they exists
   */
  hideModalsBackground() {
    let modalBackdrops = document.getElementsByClassName("modal-backdrop")
    for (let i = 0; i < modalBackdrops.length; i++) {
      modalBackdrops[i].remove()
    }
  }

  /**
   * Adds a behavior to the page whenever the user logs in.
   */
  subscribeLoginChanges() {
    this.authService.currentLoginStatus.subscribe(
      (isLoggedIn) => {
        this.userLoggedIn = isLoggedIn
        if (isLoggedIn && this.loginModal) {
          this.loginModal.hide()
          this.hideModalsBackground()
          this.finalizeRoute()
        }
      }
    )
  }

  /**
   * Adds all the markers in the [places array]{@link UseRouteComponent#places} to the map
   */
  addMarkers() {
    for (let i = 0; i < this.places.length; i++) {
      this.map!.addMarker(this.places[i])
    }
  }

  /**
   * Starts a clock that displays the current [time]{@link UseRouteComponent#time}.
   * This clock is shown to the user.
   */
  startClock() {
    this.updateDate()

    setInterval(() => {
      this.updateDate()
    }, 1000)
  }

  /**
   * Updates the current displayed [time]{@link UseRouteComponent#time}.
   */
  updateDate() {
    let date = new Date()
    let minutes = date.getMinutes().toString()
    let hours = date.getHours().toString()
    let seconds = date.getSeconds().toString()

    if (seconds.length < 2) {
      seconds = "0" + seconds
    }
    if (minutes.length < 2) {
      minutes = "0" + minutes
    }
    if (hours.length < 2) {
      hours = "0" + hours
    }

    this.time.seconds = seconds
    this.time.minutes = minutes
    this.time.hours = hours
  }

  /**
   * Lets the user mark the route as used, sending a backend request to store this information.
   * 
   * @param allChecked Specifies if all [places]{@link Place} were set to be visited by the user.
   */
  useRoute(allChecked: boolean): void {
    this.fillVisitedPlaces(allChecked)

    this.stateVariables.finalizingRoute = true;
    console.log(this.usedRoute);
    
    this.routeService.useRoute(this.usedRoute).subscribe(
      (result) => {
        this.successfullyUsed = true
        let elements = document.getElementsByClassName("modal-backdrop")
        for (let i = 0; i < elements.length; i++) {
          elements[i].remove()
        }
        this.stateVariables.backendConnection = true
        RouteShareService.clear()

        let sucessModal = new Modal(document.getElementById("sucessModal") as HTMLElement)
        sucessModal.show()

        this.stateVariables.finalizingRoute = false;

        setTimeout(() => {
          sucessModal.hide()
          this.stateVariables.finalizingRoute = false;
          this.router.navigate([''])
        }, 1000)
      },
      (error) => {
        let unsucessModal = new Modal(document.getElementById("unsucessModal") as HTMLElement)
        unsucessModal.show()

        this.successfullyUsed = false
        this.stateVariables.backendConnection = error.status != 0
        this.stateVariables.finalizingRoute = false;
      }
    )
  }

  /**
   * Sends user to the home page if the user doesn't want to login and save the information about the route that was used.
   */
  navigateHome() {
    this.router.navigate([''])
  }

  /**
   * Fills the visited places array in the [used route]{@link UseRouteComponent#usedRoute} variable.
   * 
   * @param allChecked Specifies if all [places]{@link Place} were set to be visited by the user.
   */
  fillVisitedPlaces(allChecked: boolean) {
    this.usedRoute.visitedPlaces = []
    for (let i = 0; i < this.places.length; i++) {
      if (allChecked || this.selectedPlaces[i]) {
        let startDate = this.getFormatedDate(this.places[i].startTime)
        let finishDate = this.getFormatedDate(this.places[i].finishTime)
        if (startDate && finishDate)
          this.usedRoute.visitedPlaces!.push(new RoutePlaceType(this.places[i].id, startDate, finishDate))
      }
    }
  }

  /**
   * Formats and returns the string date into a {@link Date}.
   * The day of the date is not relevant, it will only use the hours and the minutes to construct the date.
   * 
   * @returns the date in a {@link Date} format
   */
  getFormatedDate(stringDate: string): Date | undefined {
    let pattern = /^(?<hour>\d{2}):(?<minutes>\d{2})$/
    let match = pattern.exec(stringDate)
    if (match) {
      let date = new Date()

      date.setHours(Number(match!.groups!['hour']))
      date.setMinutes(Number(match!.groups!['minutes']))
      date.setSeconds(0)

      return date
    } else {
      return undefined
    }
  }

  /**
   * Determines if all the [places]{@link UseRouteComponent#places} where marked as visited and returns the result
   * 
   * @returns true if the all places where visited or false otherwise.
   */
  allPlacesVisited(): boolean {
    if (this.selectedPlaces.length == 0) {
      this.selectedPlaces = new Array<boolean>(this.places.length)
    }

    let allVisited = true

    for (let visited of this.selectedPlaces) {
      if (!visited) {
        allVisited = false
        break
      }
    }

    return allVisited
  }

  /**
   * This function is called when the user clicks in the finalize route button.
   * If the user is not logged in displays the login modal.
   * 
   * Displays the modal that allows the user to mark all places as visited.  
   * If all places are marked as visited the modal will be skiped.
   */
  finalizeRoute(): void {
    if (this.userLoggedIn) {
      // debugger
      let allPlacesVisited = this.allPlacesVisited()

      if (!allPlacesVisited) {
        let visitAllModal = new Modal(document.getElementById("modal") as HTMLElement)
        visitAllModal.show()
        return
      } else {
        this.useRoute(allPlacesVisited) // allPlacesVisited is always true in this else statement
      }
    } else {
      this.loginModal?.show()
    }
  }
}

/**
 * backendConnection - Specifies if there is a connection to the backend. This variable starts at true,
 *                     but if the backend fails to response it will be changed to false <br>
 * finalizingRoute   - Specifies if the user has clicked in the finalize route button and its in the
 *                     process of finalizing it. If the user is not finalizing the route this variable is false. <br>
 * successfullyUsed  - This variable is used to alert the user that the route use information was saved successfully
 */
interface stateVariables {
  backendConnection: boolean,
  finalizingRoute: boolean,
  successfullyUsed?: boolean,
}