import { Component, OnInit, ViewChild } from '@angular/core';
import { Place } from 'src/app/models/Place';
import { CreateUseRouteVM } from 'src/app/viewModels/requests/CreateUseRouteVM';
import { autocompleteOptions } from 'src/app/components/route/options';
import { categoriesTranslations } from 'src/app/components/route/categoriesTranslations'
import { RoutePlaceType, RoutePlaceTypeHelper } from 'src/app/viewModels/Types/RoutePlaceType';
import { RouteService } from 'src/app/services/route.service';
import { RouteShareService } from 'src/app/services/route-share.service';
import { PlaceVisit } from 'src/app/models/PlaceVisit';
import { MapComponent } from '../map/map.component';
import { } from '@googlemaps/js-api-loader'
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';

/**
 * This component allows any user to create a route with chosen places and visiting hours.<br>
 * If the user is logged in, he/she will be able to save the route as theirs in the database.<br>
 * Any user, logged in or not, can use the route they just created.
 */
@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.css']
})
export class CreateRouteComponent implements OnInit {

  /**
   * {@link MapComponent} that contains all the markers of all user selected [places]{@link CreateRouteComponent#places} 
   * This map component has all the features of a google maps map ([Maps JavaScript API]{@link https://developers.google.com/maps/documentation/javascript/overview})
   */
  @ViewChild(MapComponent) map?: MapComponent

  /**
   * Google places types translations. For each relevant [type]{@link https://developers.google.com/maps/documentation/places/web-service/supported_types}
   * present in the places [type]{@link https://developers.google.com/maps/documentation/places/web-service/supported_types} array, a translation is specified.
   */
  translations: any = categoriesTranslations

  /**
   * [Places]{@link Place} added to the [route]{@link CreateRouteComponent#route} by the user using the "Add Local" button.
   */
  places: Array<Place> = []

  /**
   * All visiting times for all selected [places]{@link CreateRouteComponent#places}.
   */
  placesTimes: Array<RoutePlaceTypeHelper> = []

  /**
   * View Model that will be sent to the backend if the user wants to save the [route]{@link CreateRouteComponent#route}.
   */
  route: CreateUseRouteVM = new CreateUseRouteVM([], '')

  /**
   * Autocomplete input search box that is used to search places in the [Google Places API]{@link https://developers.google.com/maps/documentation/places/web-service/overview}.
   */
  autocomplete?: google.maps.places.Autocomplete

  /**
   * Current selected place in the auto complete box
   */
  selectedPlace?: google.maps.places.PlaceResult

  /**
   * Variables that represent the current state of the component.
   */
  stateVariables: createRouteStateVariables = {
    routeCreated: false,
    saveFailed: false,
    loadingRoute: true,
    invalidName: '',
    invalidPlaces: '',
    routeIsValid: false,
    saved: false,
    backendConnection: true,
    creatingRoute: false
  }

  /**
   * @ignore
   */
  constructor(private routeService: RouteService, private router: Router) { }

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.initAutocomplete()
  }

  /**
   * Inits the [auto complete]{@link CreateRouteComponent#autocomplete} search input with predefined options. 
   * The options can be found in the constant {@link autocompleteOptions}.
   */
  initAutocomplete(): void {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete') as HTMLInputElement, autocompleteOptions)

    // every time the user clicks on a place when searching the place is saved in the selected place variable
    this.autocomplete.addListener('place_changed', () => {
      this.selectedPlace = this.autocomplete!.getPlace()
    })

  }

  /**
   * Adds the current [selected place]{@link CreateRouteComponent#selectedPlace} to the [places array]{@link CreateRouteComponent#places} 
   * and a marker in the [map]{@link MapComponent}.
   */
  addPlace(): void {
    if (this.selectedPlace) {
      let newPlace = this.createPlaceFromResult(this.selectedPlace)

      this.map?.addMarker(newPlace)
      this.places.push(newPlace)
      this.placesTimes.push(new RoutePlaceTypeHelper(newPlace.id, "00:00", "00:00"))
      this.selectedPlace = undefined
      this.clearText()
    }
  }

  /**
   * Creates a {@link Place} from a google maps place result. This result can be obtained using an autocomplete search box.
   * 
   * @param resultPlace the resulting place from the auto complete query.
   * @returns a new {@link Place} created from the resultPlace param.
   */
  createPlaceFromResult(resultPlace: google.maps.places.PlaceResult): Place {

    let photoURL = '/assets/images/noimage.jpg'

    if (resultPlace.photos) {
      photoURL = resultPlace.photos[0].getUrl()
    }

    return new Place(
      resultPlace.place_id!,
      resultPlace.name!,
      resultPlace.types!,
      {
        lat: resultPlace.geometry!.location!.lat(),
        lon: resultPlace.geometry!.location!.lng()
      },
      photoURL
    )
  }

  /**
   * Removes a [place]{@link Place} from the [places array]{@link CreateRouteComponent#places} in a specified position.
   * 
   * @param index position in the array of the [place]{@link Place} to remove.
   */
  removePlace(index: number): void {
    this.places.splice(index, 1)
    this.placesTimes.splice(index, 1)
    this.map?.removeMarker(index)
  }

  /**
   * Clears the [auto complete]{@link CreateRouteComponent#autocomplete} text input.
   */
  clearText() {
    let autocomplete = document.getElementById("autocomplete") as HTMLInputElement
    autocomplete.value = ""
  }

  /**
   * Changes the color of the route name input to green or red depending if the user entered a route name or not.
   * 
   * @returns True - if a name was specified to the route. <br> False - if no name was specified to the route. 
   */
  changeRouteNameInput(): boolean {
    let isRouteNameValid = this.route.name != ""
    let nameInput = document.getElementById("inRouteName")
    let classes = "form-control shadow-sm"
    let newClasses: string

    if (isRouteNameValid) {
      newClasses = classes + ' is-valid'
    } else {
      newClasses = classes + ' is-invalid'
    }

    nameInput?.setAttribute("class", newClasses)

    return isRouteNameValid
  }

  /**
   * Adds all the [places]{@link CreateRouteComponent#places} to the [route]{@link CreateRouteComponent#route} and to the {@link RouteShareService}. <br>
   * The {@link RouteShareService} will provide the necessary comunication to the {@link UseRouteComponent}.
   */
  createRoute() {
    this.stateVariables.saveFailed = false;
    this.stateVariables.loadingRoute = true;
    this.stateVariables.creatingRoute = true;

    let isRouteNameValid = this.changeRouteNameInput();

    if (isRouteNameValid) {
      RouteShareService.clear()
      this.route.places = []

      for (let i = 0; i < this.places.length; i++) {
        let place = this.places[i]
        let placeTime = this.placesTimes[i]
        let placeHelper = new PlaceVisit(place.id, place.name, place.categories, place.coords, place.url, placeTime.startTime, placeTime.finishTime)
        let routePlace: RoutePlaceType = placeTime.toRoutePlaceType()

        this.route.places.push(routePlace)
        RouteShareService.addPlace(placeHelper)
      }
      this.validateRoute()

    } else {
      this.stateVariables.invalidName = "O campo necessita de estar preenchido"
      this.stateVariables.creatingRoute = false;
    }
  }

  /**
   * Shows the modal dialog that allows the user to save or use the route
   */
  showModal() {
    let modal = new Modal(document.getElementById("createRouteModal") as HTMLElement)
    modal.show()
  }

  /**
   * Sends the [created route]{@link CreateRouteComponent#route} to the backend asking for a route verification
   * 
   * If the route is invalid a message will apear
   */
  validateRoute() {
    this.routeService.verifyRoute(this.route).subscribe(
      (response) => {
        this.stateVariables.backendConnection = true
        this.stateVariables.invalidName = ''
        this.stateVariables.invalidPlaces = ''
        this.stateVariables.loadingRoute = false;
        this.stateVariables.routeIsValid = true;
        this.stateVariables.creatingRoute = false;
        this.showModal()
      },
      (error) => {
        this.stateVariables.backendConnection = error.status != 0
        this.stateVariables.invalidName = ''
        this.stateVariables.invalidPlaces = ''

        if (error.error.errors) {
          const errors = error.error.errors
          for (let index = 0; index < errors.length; index++) {
            const error = errors[index];

            if (error.name == "Name") {
              this.stateVariables.invalidName = error.description
            } else if (error.name == "Places") {
              this.stateVariables.invalidPlaces = error.description
            }
          }
        }
        this.stateVariables.loadingRoute = true;
        this.stateVariables.routeIsValid = false;
        this.stateVariables.creatingRoute = false;
      }
    )
  }

  /**
   * Sends a create route request to the backend using the [created route]{@link CreateRouteComponent#route} 
   */
  saveRoute() {
    this.routeService.createRoute(this.route).subscribe(
      (response) => {
        this.stateVariables.saveFailed = false;
        this.stateVariables.saved = true

        localStorage.setItem("routeID", response.routeID)
      },
      (error) => {
        this.stateVariables.saveFailed = true;
      }
    )
  }

  /**
   * Redirects the user to the use route page if the route is valid
   */
  useRoute() {
    if (this.stateVariables.routeIsValid) {
      RouteShareService.addName(this.route.name)
      this.router.navigate(['route', 'use'])
    }
  }
}

/**
 * Set of variables that help display important info about the current state of the route creation process
 * 
 * @param {boolean} invalidRouteMessage 
 * @param {boolean} saved 
 */
interface createRouteStateVariables {

  /**
   * Specifies if the route was created.
   */
  routeCreated: boolean,

  /**
   * Specifies if the attempt to save a route failed.
   */
  saveFailed: boolean,

  /**
   * Specifies if the route is loading.
   */
  loadingRoute: boolean,

  /**
   * Invalid name error description.
   */
  invalidName: string,

  /**
   * Invalid places error description.
   */
  invalidPlaces: string,

  /**
   * Specifies if the route is valid.
   */
  routeIsValid: boolean,

  /**
   * Specifies if the route was saved in the backend.
   */
  saved: boolean,

  /**
   * Specifies if there is a backedn connection.
   */
  backendConnection: boolean,

  /**
   * Specifies if the route is being created and validated.
   */
  creatingRoute: boolean
}
