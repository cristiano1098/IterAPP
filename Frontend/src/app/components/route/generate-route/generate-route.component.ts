import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { PlaceVisit } from 'src/app/models/PlaceVisit';
import { PlaceService } from 'src/app/services/place.service';
import { RouteShareService } from 'src/app/services/route-share.service';
import { RouteService } from 'src/app/services/route.service';
import { GenerateRouteVM } from 'src/app/viewModels/requests/GenerateRouteVM';
import { GeneratedRouteVM } from 'src/app/viewModels/responses/GeneratedRouteVM';
import { RoutePlaceType } from 'src/app/viewModels/Types/RoutePlaceType';
import { UtilitiesComponent } from '../../utilities/utilities.component';
import { categoriesTranslations, translationsNumber } from '../categoriesTranslations';
import { autocompleteOptions } from '../options';

/**
 * This components allows any user to generate a route based on some place's categories.
 */
@Component({
  selector: 'app-generate-route',
  templateUrl: './generate-route.component.html',
  styleUrls: ['./generate-route.component.css']
})
export class GenerateRouteComponent implements OnInit {

  /**
   * Sizing property is used in the html to help produce a response behavior from this component.
   * Default screenWidth is 1000px but is changed in the ngOnInit funtion
   */
  sizing: sizingHelper = {
    screenWidth: 1000 //px
  }

  /**
   * Alerts that are displayed to the user
   */
  alerts: alerts = {
    missingName: undefined,
    maxCategories: false
  }

  /**
   * This variable is used to determin if the generate button is disabled.
   * If the places are being loaded, the generate button is disabled.
   * When all places are added to the route and all sugested places are added to the suggested places array, the button will be clickable again.
   */
  generateHelper: generateHelper = {
    placesAdded: false,
    suggestedPlacesAdded: false,
    generatingRoute: false
  }

  /**
   * Translations to the most relevant places categories 
   */
  translations: any = categoriesTranslations

  /**
   * Specifications to generate a route.
   */
  generateRouteVM: GenerateRouteVM = new GenerateRouteVM('', new Date(), new Date(), true, [])

  /**
   * Start and finish time selected by the user to generate a route.
   */
  dates: dates = {
    startTime: "08:00",
    finishTime: "18:00"
  }

  /**
   * Represents all selected categories
   */
  selectedCategories = new Array<boolean>(translationsNumber)

  /**
   * The [generated route]{@link GeneratedRouteVM} created in the backend.
   */
  generatedRoute?: GeneratedRouteVM

  /**
   * Places displayed in the page, this are the places that belong to the route the user is generating.
   */
  places: Array<PlaceVisit> = [];

  /**
   * Places suggested by the backend that can be used to replace the current places in the route.
   */
  suggestedPlaces: Array<string> = []

  /**
   * Info about all places that are in the {@link places} array or in the {@link suggestedPlaces}
   */
  placesInfo: Array<PlaceVisit> = []

  /**
   * Autocomplete input search box that is used to search places in the [Google Places API]{@link https://developers.google.com/maps/documentation/places/web-service/overview}.
   */
  autocomplete?: google.maps.places.Autocomplete

  /**
   * Current selected place in the auto complete box
   */
  selectedPlace?: google.maps.places.PlaceResult

  /**
   * Autocomplete input search box that is used to search places in the [Google Places API]{@link https://developers.google.com/maps/documentation/places/web-service/overview}.
   * <br>
   * This autocomplete is used whenever the user wants to replace a place with another specific place.
   */
  replaceAutocomplete?: google.maps.places.Autocomplete

  /**
   * Info about the replacing place process.
   */
  replaceInfo: replaceInfo = {
    replacingIndex: undefined,
    replacingPlace: undefined,
    newPlace: undefined,
    loading: false,
    replacing: false
  }

  /**
   * The modal that allows a place to be replaced 
   */
  replaceModal?: Modal

  /**
   * @ignore
   */
  constructor(private routeService: RouteService, private placeService: PlaceService, private router: Router) {
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.resizeDiv()

    this.sizing.screenWidth = window.innerWidth
    window.onresize = () => {
      this.sizing.screenWidth = window.innerWidth
    }
  }

  /**
   * Resizes the main div if it's size is less than the view window. 
   * This is needed so the visible background is filled with the same color.
   */
  resizeDiv() {
    let visibleHeight = UtilitiesComponent.getComponentMaxVisibleHeight()

    const mainDiv = document.getElementById("divMain")!!;

    if (mainDiv.offsetHeight < visibleHeight) {
      mainDiv.style.height = visibleHeight + "px";
    }
  }

  /**
   * Set's a predefinied height to the div that is displaying the route.
   * With a fixed height we can use the [overflow bootstrap class]{@link https://getbootstrap.com/docs/5.0/utilities/overflow/} 
   * to have a scrollable div for the places info and a fixed div for the generate route form.
   */
  resizeRouteDiv() {
    let visibleHeight = UtilitiesComponent.getComponentMaxVisibleHeight()
    const divRoute = document.getElementById("divRoute")!!;
    divRoute.style.height = visibleHeight - 20 + "px";
  }

  /**
   * Inserts or remove the category from the {@link generateRouteVM}.
   * If the categoty is not in the array it is added.
   * If the category is in the array it is removed
   * 
   * @param category 
   * @param elementIndex 
   */
  toogleCategory(category: any, elementIndex: Number) {
    let categoryIndex = this.generateRouteVM.categories.indexOf(category)

    if (this.translations[category] != null) {
      if (categoryIndex == -1) {
        if (this.generateRouteVM.categories.length >= 5) {
          this.alerts.maxCategories = true;
        } else {
          this.alerts.maxCategories = false;
          this.insertCategory(category, elementIndex);
        }
      } else {
        this.alerts.maxCategories = false;
        this.removeCategory(category, elementIndex)
      }
    }
  }

  /**
   * Inserts a category into the generate route array and changes the div color and the checkbox current state
   *  to display to the user that the category is selected
   * 
   * @param category category to be added to the route generation
   * @param elementIndex the index of the category in the HTML
   */
  insertCategory(category: any, elementIndex: Number) {
    this.generateRouteVM.categories.push(category)

    let checkbox = document.getElementById("checkbox" + elementIndex) as HTMLInputElement || null
    let div = document.getElementById("option" + elementIndex)

    if (checkbox) {
      checkbox.checked = true
    }
    if (div) {
      div.style.backgroundColor = "rgba(144, 238, 144, 0.30)"
    }
  }

  /**
   * Removes a category from the generate route array .
   * Unchecks the checkbox and changes the background color for that category div.
   * 
   * @param category category to be added to the route generation
   * @param elementIndex the index of the category in the HTML
   */
  removeCategory(category: any, elementIndex: Number) {
    let indexToRemove = this.generateRouteVM.categories.indexOf(category)
    this.generateRouteVM.categories.splice(indexToRemove, 1)

    let checkbox = document.getElementById("checkbox" + elementIndex) as HTMLInputElement || null
    let div = document.getElementById("option" + elementIndex)

    if (checkbox) {
      checkbox.checked = false
    }

    if (div) {
      div.style.backgroundColor = "white"
    }
  }

  /**
   * Removes all categories from the [generate route]{@link generateRouteVM} category array 
   */
  removeAllCategories() {
    let id = 0;
    for (let key in this.translations) {
      this.removeCategory(key, id);
      id++;
    }
  }

  /**
   * Creates a {@link Place} from a google maps place result. This result can be obtained using an autocomplete search box.
   * 
   * @param resultPlace the resulting place from the auto complete query.
   * @returns a new {@link Place} created from the resultPlace param.
   */
  createPlaceFromResult(resultPlace: google.maps.places.PlaceResult): PlaceVisit | null {

    if (!resultPlace) return null

    let photoURL = '/assets/images/noimage.jpg'

    if (resultPlace.photos) {
      photoURL = resultPlace.photos[0].getUrl()
    }

    return new PlaceVisit(
      resultPlace.place_id!,
      resultPlace.name!,
      resultPlace.types!,
      {
        lat: resultPlace.geometry!.location!.lat(),
        lon: resultPlace.geometry!.location!.lng()
      },
      photoURL,
      "00:00",
      "00:00"
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
   * Inits the [auto complete]{@link GenerateRouteComponent#autocomplete} search input with predefined options. 
   * The options can be found in the constant {@link autocompleteOptions}.
   */
  initAutocomplete(elementID: string, eventName: string, handler: Function): google.maps.places.Autocomplete {
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(elementID) as HTMLInputElement, autocompleteOptions)

    // every time the user clicks on a place when searching the place is saved in the selected place variable
    autocomplete.addListener(eventName, handler)

    return autocomplete
  }

  /**
   * Initis the autocomplete that is responsible for adding new places into the generated route
   */
  initAddPlaceAutoComplete() {
    this.autocomplete = this.initAutocomplete('autocomplete', 'place_changed', () => {
      this.selectedPlace = this.autocomplete!.getPlace()
    })
  }

  /**
   * Clears the [auto complete]{@link GenerateRouteComponent#autocomplete} text input.
   */
  clearAddPlaceAutoCompleteText() {
    let autocomplete = document.getElementById("autocomplete") as HTMLInputElement
    autocomplete.value = ""
  }

  /**
   * Adds the current [selected place]{@link CreateRouteComponent#selectedPlace} to the [places array]{@link CreateRouteComponent#places} 
   * and a marker in the [map]{@link MapComponent}.
   */
  addPlace(): void {
    if (this.selectedPlace) {
      let newPlace = this.createPlaceFromResult(this.selectedPlace)

      if (newPlace) {
        this.places.push(newPlace)

        this.sortPlaces()
      }

      this.selectedPlace = undefined
      this.clearAddPlaceAutoCompleteText()
    }
  }

  /**
   * Performs all operations necessary to correctly store a {@link RoutePlaceType} when it's received by the backend.
   * 
   * @param routePlace the {@link RoutePlaceType} to be stored.
   */
  handlePlace(routePlace: RoutePlaceType, arraylength: number) {
    let index = 0
    this.placeService.getPlace(routePlace.idPlace).subscribe(
      (place) => {
        let placeVisit = PlaceVisit.instanceFromGooglePlaceVM(place, routePlace)

        index = this.places.push(placeVisit)

        this.placesInfo.push(placeVisit)
      },
      (error) => {
        console.error(error)
      },
      () => {
        if (index == arraylength - 1) {
          this.generateHelper.placesAdded = true;
          if (this.generateHelper.suggestedPlacesAdded) {
            this, this.generateHelper.generatingRoute = false
          }
        }
        this.sortPlaces()
      }
    )
  }

  /**
   * Performs all operations necessary to correctly store a suggested place when it's received by the backend.
   * 
   * @param suggestedPlace the [suggestedPlace]{@link RoutePlaceType} to be stored
   */
  handleSuggestedPlace(suggestedPlaceID: string, arraylength: number) {
    let index = 0
    this.placeService.getPlace(suggestedPlaceID).subscribe(
      (place) => {
        let newPlaceInfo = PlaceVisit.instanceFromGooglePlaceVM(place, new RoutePlaceType(suggestedPlaceID, new Date(), new Date()))

        index = this.suggestedPlaces.push(suggestedPlaceID)
        this.placesInfo.push(newPlaceInfo)
      },
      (error) => {
        console.error(error)
      },
      () => {
        if (index == arraylength - 1) {
          this.generateHelper.suggestedPlacesAdded = true
          if (this.generateHelper.placesAdded) {
            this, this.generateHelper.generatingRoute = false
          }
        }
      }
    )
  }

  /**
   * Clears the information about the generated route.
   */
  clearGeneratedRoute() {
    this.generatedRoute = undefined
    this.places = new Array<PlaceVisit>()
    this.suggestedPlaces = new Array<string>()
    this.placesInfo = new Array<PlaceVisit>()
  }
  /**
   * Sends a generate route request using the user inputs.
   * 
   * THIS METHOD IS NOT FINAL AND MUST BE CHANGED IN THE NEXT SPRINT WHEN THE BACKEND IS FUNCTIONING WITH THE NEW CHANGES IN THE DATABASE.
   */
  generateRoute() {
    this.generateHelper.generatingRoute = true
    this.clearGeneratedRoute()
    if (this.generateRouteVM.categories.length != 5) {
      this.generateHelper.generatingRoute = false
      return
    }

    this.generateRouteVM.startTime.setHours(Number(this.dates.startTime.substring(0, 2)))
    this.generateRouteVM.startTime.setMinutes(Number(this.dates.startTime.substring(3, 5)))
    this.generateRouteVM.startTime.setSeconds(0)

    this.generateRouteVM.finishTime.setTime(this.generateRouteVM.startTime.getTime());
    this.generateRouteVM.finishTime.setHours(Number(this.dates.finishTime.substring(0, 2)))
    this.generateRouteVM.finishTime.setMinutes(Number(this.dates.finishTime.substring(3, 5)))
    this.generateRouteVM.finishTime.setSeconds(0)

    this.routeService.generateRoute(this.generateRouteVM).subscribe(
      (result) => {
        this.generatedRoute = result

        result.route.forEach(
          (routePlace) => {
            this.handlePlace(routePlace, result.route.length);
          }
        )

        if (result.possiblePlaces) {
          result.possiblePlaces.forEach(
            (placeID) => {
              this.handleSuggestedPlace(placeID, result.possiblePlaces.length)
            }
          )
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }



  /**
   * Determines if a place with a given name exists in the [place info array]{@link placesInfo}
   * @param placeName the name of the place
   * 
   * @return whether the place exists or not
   */
  getPlaceInfo(placeName: string): PlaceVisit | null {
    for (let i = 0; i < this.placesInfo.length; i++) {
      if (this.placesInfo[i].name == placeName) { // If the palce information is already stored there is no need to ask for that information to the google api
        this.replaceInfo.newPlace = this.placesInfo[i]
        return this.placesInfo[i]
      }
    }
    return null
  }

  /**
   * Inits the replace autocopmplete that allows the user to search places.
   * 
   * If the place info is not stored in the [place info array]{@link placeInfo} a request will be performed to retrieve the place information from the google API.
   * If the place is already stored the request to the google API won´t be performed.
   */
  initReplaceAutoComplete() {
    this.replaceAutocomplete = this.initAutocomplete('replaceAutocomplete', 'place_changed', () => {
      this.replaceInfo.loading = true
      let input = document.getElementById("replaceAutocomplete") as HTMLInputElement
      let inputValue = input.value
      let placeName = inputValue.substring(0, inputValue.indexOf(","))
      let newPlace = this.getPlaceInfo(placeName)

      // If the palce information is already stored there is no need to ask for that information to the google api
      if (!newPlace) {
        let placeResult = this.replaceAutocomplete!.getPlace()
        if (placeResult) {
          newPlace = this.createPlaceFromResult(placeResult)
          if (newPlace)
            this.placesInfo.push(newPlace)
        }
      }

      if (newPlace)
        this.replaceInfo.newPlace = newPlace

      this.replaceInfo.loading = false
    })
  }

  /**
   * Clears the [auto complete]{@link replaceAutocomplete} text input.
   */
  clearReplaceAutoCompleteText() {
    let autocomplete = document.getElementById("replaceAutocomplete") as HTMLInputElement
    autocomplete.value = ""
  }

  /**
   * Displays the replace Modal, allowing the user to replace from one place that is currently in the route to another place of it's choice.
   * 
   * @param index the index of the place to be replaceped.
   */
  displayReplaceModal(index: number) {
    this.replaceInfo.replacingIndex = index
    this.replaceInfo.replacingPlace = this.places[index]
    this.showReplaceModal()
    this.initReplaceAutoComplete()
  }

  /**
   * Shows the modal that is responsible for the place replacing
   */
  showReplaceModal() {
    if (!this.replaceModal)
      this.replaceModal = new Modal(document.getElementById("modalReplacePlace") as HTMLElement)

    this.replaceModal.show()
  }

  /**
   * Hides the modal that is responsible for the place replacing
   */
  hideReplaceModal() {
    if (!this.replaceModal)
      this.replaceModal = new Modal(document.getElementById("modalReplacePlace") as HTMLElement)
    this.replaceModal.hide()
  }

  /**
   * Replaces a place in the [places array]{@link places} with a place in the [placeInfo array]{@link placeInfo}
   * 
   * @param placeIndex The place to be replaced
   * @param placeInfoIndex The place that will be used to replace the place in the [places array]{@link places}
   */
  quickReplace(placeIndex: number, suggestedIndex: number) {
    if (this.suggestedPlaces.length <= 0 || this.generatedRoute == null) return

    let oldPlace = this.places[placeIndex]
    let newPlace: PlaceVisit | undefined

    for (let placeInfo of this.placesInfo) {
      if (placeInfo.id == this.suggestedPlaces[suggestedIndex]) {
        newPlace = placeInfo
        break
      }
    }

    if (!newPlace) return

    newPlace.startTime = oldPlace.startTime
    newPlace.finishTime = oldPlace.finishTime

    this.places[placeIndex] = newPlace
    this.suggestedPlaces[suggestedIndex] = oldPlace.id

  }

  /**
   * Replaces a place in the [places array]{@link places} given it's index with a random place from the [suggested places array]{@link suggestedPlaces}
   * 
   * @param index the place to be replaceped
   */
  replaceRandom(index: number) {
    if (this.suggestedPlaces.length <= 0 || this.generatedRoute == null)
      return

    let replacingIndex = Math.floor(Math.random() * (this.suggestedPlaces.length))

    this.quickReplace(index, replacingIndex)
  }

  /**
   * Replaces the target place in the [places array]{@link places} with the [newPlace]{@link replace.newPlace}
   * 
   * {@link newPlace} is modified when the user selects a place from the autocomplete inside the replace modal
   */
  replace() {
    if (this.replaceInfo.replacingIndex == undefined || !this.replaceInfo.newPlace) return

    let oldPlace = this.places[this.replaceInfo.replacingIndex]

    this.replaceInfo.newPlace.startTime = oldPlace.startTime
    this.replaceInfo.newPlace.finishTime = oldPlace.finishTime

    if (!this.suggestedPlaceExist(oldPlace.id)) {
      this.suggestedPlaces.push(oldPlace.id)
    }

    this.places[this.replaceInfo.replacingIndex] = this.replaceInfo.newPlace
    this.hideReplaceModal()
    this.clearReplaceAutoCompleteText()
    this.replaceInfo.newPlace = undefined
  }

  /**
   * Checks if a determined place exists in the {@link suggestedPlaces} array
   * 
   * @param targetPlaceID the place to check if it exists
   * @returns true if the place exists in the {@link suggestedPlaces} array, otherwise returns false.
   */
  suggestedPlaceExist(targetPlaceID: string): boolean {
    for (const placeID of this.suggestedPlaces) {
      if (placeID == targetPlaceID) {
        return true
      }
    }

    return false
  }

  /**
   * Deletes a place from the route
   * @param index the place to be removed
   */
  delete(index: number) {
    this.places.splice(index, 1)
  }

  /**
   * Let's the user use the route that was created.
   * Saves the route in the local storage and allows it's usage.
   */
  acceptRoute() {
    if (!this.generatedRoute) return

    if (this.generateRouteVM.name == "") {
      this.alerts.missingName = true
      return
    }

    this.generatedRoute.name = this.generateRouteVM.name

    RouteShareService.clear()
    RouteShareService.addName(this.generatedRoute.name)
    this.places.forEach((place) => {
      RouteShareService.addPlace(place)
    })

    this.router.navigate(['route', 'use'])
  }

  /**
   * Rejects a generated route, removing it from the component.
   */
  rejectRoute() {
    this.generatedRoute = undefined
  }

}

/**
 * Helper class to display the route start and end date
 */
interface dates {
  /**
   * [Generate route]{@link GenerateRouteVM} start time
   */
  startTime: string,

  /**
   * [Generate route]{@link GenerateRouteVM} finish time
   */
  finishTime: string
}

/**
 * Interface used to replace a palce with other.
 */
interface replaceInfo {

  /**
   * Index of the [place]{@link PlaceVisit} that is being replaced in the [places array]{@link GenerateRouteComponent#places}.
   */
  replacingIndex?: number,

  /**
   * The [place]{@link PlaceVisit} that will be replaced
   */
  replacingPlace?: PlaceVisit,

  /**
   * The [place]{@link PlaceVisit} that will replace the {@link replaceInfo#replacingPlace}
   */
  newPlace?: PlaceVisit,

  /**
   * Specifies if the {@link replaceInfo#newPlace} image is loading.
   */
  loading: boolean,

  /**
   * Specifies if the {@link replaceInfo#replacingPlace} is being replaced.
   */
  replacing: boolean
}

/**
 * Provides information that helps the page render a small screen or a big screen display
 */
interface sizingHelper {

  /**
   * The screen total width.
   */
  screenWidth: number
}

/**
 * Represents the alerts that are displayed to the user.
 */
interface alerts {
  /**
   * Specfies if the route name is missing.
   */
  missingName?: boolean,

  /**
   * Sets the max number of categories to be used in the route generation.
   */
  maxCategories: boolean,
}

interface generateHelper {
  placesAdded: boolean,
  suggestedPlacesAdded: boolean,
  generatingRoute: boolean
}