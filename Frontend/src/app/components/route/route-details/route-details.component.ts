import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PlaceVisit } from 'src/app/models/PlaceVisit';
import { PlaceService } from 'src/app/services/place.service';
import { RouteService } from 'src/app/services/route.service';
import { CommentRouteVM } from 'src/app/viewModels/requests/CommentRouteVM';
import { RouteVM } from 'src/app/viewModels/responses/RouteVM';
import { CommentType } from 'src/app/viewModels/Types/CommentType';
import { categoriesTranslations } from '../categoriesTranslations';
import { MapComponent } from '../map/map.component';

/**
 * This component allows a user to see all details about a route.
 */
@Component({
  selector: 'app-route-details',
  templateUrl: './route-details.component.html',
  styleUrls: ['./route-details.component.css']
})
export class RouteDetailsComponent implements OnInit, AfterViewInit {

  /**
   * The routeID form the URL 
   */
  routeID?: number

  /**
   * The {@link RouteVM} received by the backend
   */
  routeVM?: RouteVM

  /**
   * {@link MapComponent} that contains all the markers of all user selected [places]{@link CreateRouteComponent#places} 
   * This map component has all the features of a google maps map ([Maps JavaScript API]{@link https://developers.google.com/maps/documentation/javascript/overview})
   */
  @ViewChild(MapComponent) map?: MapComponent

  /**
   * Specifies if all places are loaded.
   */
  placesReady = new BehaviorSubject<Boolean>(false);

  /**
   * Observable for the {@link placesReady} variable
   */
  placesReadyObservable = this.placesReady.asObservable()

  /**
   * Indicates if the view is initiated
   */
  viewInited = false;

  /**
   * The date of the {@link RouteVM} received by the backend
   */
  routeDate: Date = new Date()

  /**
   * The places preent in the route.
   */
  places: Array<PlaceVisit> = new Array<PlaceVisit>()

  /**
   * All categories of this route
   */
  categories = new Array<string>()

  /**
   * Translations to some [categories]{@link PlaceVisit#categories} of a {@link PlaceVisit}. 
   * This categories are sent via google maps in english and not in a readable format,
   *  so we need to translate them.
   */
  translations: any = categoriesTranslations

  /**
   * Determines if the mouse is hovering the favorite button
   */
  mouseOverFavoriteBtn: boolean = false

  /**
   * Determines if the route wasn't found in the backedn
   */
  routeNotFound?: boolean

  /**
   * Determines if a favorite request was sent and the program is waiting for the response.
   */
  changingFavorite: boolean = false

  /**
   * User name of the logged in user
   */
  userName = localStorage.getItem("username")

  /**
   * Helper for commenting a route
   */
  commentHelper: commentHelper = {
    commentRouteVM: new CommentRouteVM(""),
    errorCommenting: false,
    userPhoto: "/assets/images/avatarmasculine2.png"
  }

  userEvaluation: number = -1;
  /**
   * @ignore
   */
  constructor(private activatedRoute: ActivatedRoute, private routeService: RouteService, private placeService: PlaceService) { }

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.getRoute()
  }

  /**
   * @ignore
   */
  ngAfterViewInit(): void {
    this.viewInited = true;
  }

  /**
   * Adds a marker to the map for all places
   */
  addMarkers() {
    this.placesReady.subscribe(
      (value) => {
        if (value) {
          while (!this.viewInited) {
            setInterval(() => { }, 100)
          }

          this.places.forEach(
            (place) => {
              this.map!.addMarker(place)
            }
          )
        }
      })
  }

  /**
   * Gets the route from the backend using the url param routeID.
   */
  getRoute() {
    this.routeID = this.activatedRoute.snapshot.params.routeID;

    /* Backend Request */
    this.routeService.getRoute(this.routeID!).subscribe(
      (result) => {
        this.routeNotFound = false
        this.routeVM = result
        this.routeDate = new Date(result.createDate)
        this.requestPlacesInfo()
        this.userEvaluation = result.routeResume.userEvaluation
      },
      (error) => {
        console.error(error)
        this.routeNotFound = true
      }
    )

    /* Static data for testing */
    // this.routeVM = route1
    // this.routeNotFound = false
    // this.requestPlacesInfo()
    // this.places = placeVisitArray1

  }

  /**
   * Adds all {@link places} categories to the {@link categoriesArray}, excluding repeated ones.
   */
  addCategories() {
    this.places.forEach(
      (place) => {
        place.categories.forEach(
          (categorie) => {
            for (let index = 0; index < this.categories.length; index++) {
              if (this.categories[index] == categorie)
                return
            }

            this.categories.push(categorie)
          }
        )
      }
    )
  }

  /**
   * Requests the info of the places present in the {@link routeVM}.
   */
  requestPlacesInfo() {
    this.routeVM?.routeResume.places.forEach(
      (routePlace, index) => {
        this.placeService.getPlace(routePlace.idPlace).subscribe(
          (result) => {
            let newPlaceVisit = PlaceVisit.instanceFromGooglePlaceVM(result, routePlace)
            this.places.push(newPlaceVisit)
          },
          (error) => {
            console.error(error)
          },
          () => {
            if (index + 1 == this.routeVM?.routeResume.places.length) {
              PlaceVisit.sortPlaces(this.places)
              this.placesReady.next(true)
              this.addCategories()
              this.addMarkers()
            }
          }
        )
      }
    )
  }

  /**
   * Sends a request to add the displayed route to the favorite routes
   */
  addFavorite() {
    this.changingFavorite = true;
    if (this.routeVM) {
      this.routeService.addFavoriteRoute(this.routeVM.routeResume.routeID).subscribe(
        (result) => {
          if (this.routeVM)
            this.routeVM.routeResume.isFavourite = true
        },
        (error) => {
          console.error(error)
          this.changingFavorite = false
        },
        () => {
          this.changingFavorite = false
        }
      )
    }
  }

  /**
   * Sends a request to add the displayed route to the favorite routes
   */
  removeFavorite() {
    this.changingFavorite = true;
    if (this.routeVM) {
      this.routeService.removeFavoriteRoute(this.routeVM.routeResume.routeID).subscribe(
        (result) => {
          if (this.routeVM)
            this.routeVM.routeResume.isFavourite = false
        },
        (error) => {
          console.error(error)
          this.changingFavorite = false
        },
        () => {
          this.changingFavorite = false
        }
      )
    }
  }

  /**
   * Changes the appearence of the add and remove favorite button.
   * Uses (mouseover) and (mouseleave) from angular to call this method.
   * 
   * @param hover specifies if the mouse is overing the button.
   */
  setMouseOverFavoriteBtn(hover: boolean) {
    let span: HTMLElement
    let button: HTMLElement

    if (this.routeVM?.routeResume.isFavourite) {
      span = document.getElementById("spanRemoveFavorite")!
      button = document.getElementById("btnRemoveFavorite")!
    } else {
      span = document.getElementById("spanAddFavorite")!
      button = document.getElementById("btnAddFavorite")!
    }

    this.mouseOverFavoriteBtn = hover

    if (hover && !this.changingFavorite) {
      if (this.routeVM?.routeResume.isFavourite) {

        span.innerHTML = "Remover"
        button.style.backgroundColor = "#bb2d3b"
        button.style.borderColor = "#bb2d3b"

      } else {

        span.innerHTML = "Adicionar"
        button.style.backgroundColor = "var(--greenMain)"
        button.style.borderColor = "var(--greenMain)"

      }
    } else {
      if (this.routeVM?.routeResume.isFavourite) {

        span.innerHTML = "Favorita"
        button.style.backgroundColor = "var(--greenMain)"
        button.style.borderColor = "var(--greenMain)"

      } else {

        span.innerHTML = "Não favorita"
        button.style.backgroundColor = "#bb2d3b"
        button.style.borderColor = "#bb2d3b"

      }
    }
  }

  /**
   * Sends the comment to the backend.
   */
  sendComment() {
    if (this.routeID)
      this.routeService.commentRoute(this.routeID, this.commentHelper.commentRouteVM).subscribe(
        () => {
          this.routeVM?.comments?.push(new CommentType(this.userName!, this.commentHelper.commentRouteVM.comment))
        },
        (error) => {
          console.error(error)
          this.commentHelper.errorCommenting = true
        }
      )
  }

  /**
   *  Select rate
   * @param rate 
   */
  selectRate(rate: number) {

    switch (rate) {
      case 0:

        document.getElementById("rate1")?.style.setProperty("display", "block")
        document.getElementById("rate1Fill")?.style.setProperty("display", "none")
        document.getElementById("rate2")?.style.setProperty("display", "block")
        document.getElementById("rate2Fill")?.style.setProperty("display", "none")
        document.getElementById("rate3")?.style.setProperty("display", "block")
        document.getElementById("rate3Fill")?.style.setProperty("display", "none")
        document.getElementById("rate4")?.style.setProperty("display", "block")
        document.getElementById("rate4Fill")?.style.setProperty("display", "none")
        document.getElementById("rate5")?.style.setProperty("display", "block")
        document.getElementById("rate5Fill")?.style.setProperty("display", "none")

        break;

      case 1:

        document.getElementById("rate1")?.style.setProperty("display", "none")
        document.getElementById("rate1Fill")?.style.setProperty("display", "block")
        document.getElementById("rate2")?.style.setProperty("display", "block")
        document.getElementById("rate2Fill")?.style.setProperty("display", "none")
        document.getElementById("rate3")?.style.setProperty("display", "block")
        document.getElementById("rate3Fill")?.style.setProperty("display", "none")
        document.getElementById("rate4")?.style.setProperty("display", "block")
        document.getElementById("rate4Fill")?.style.setProperty("display", "none")
        document.getElementById("rate5")?.style.setProperty("display", "block")
        document.getElementById("rate5Fill")?.style.setProperty("display", "none")
        break;

      case 2:
        document.getElementById("rate1")?.style.setProperty("display", "none")
        document.getElementById("rate1Fill")?.style.setProperty("display", "block")
        document.getElementById("rate2")?.style.setProperty("display", "none")
        document.getElementById("rate2Fill")?.style.setProperty("display", "block")
        document.getElementById("rate3")?.style.setProperty("display", "block")
        document.getElementById("rate3Fill")?.style.setProperty("display", "none")
        document.getElementById("rate4")?.style.setProperty("display", "block")
        document.getElementById("rate4Fill")?.style.setProperty("display", "none")
        document.getElementById("rate5")?.style.setProperty("display", "block")
        document.getElementById("rate5Fill")?.style.setProperty("display", "none")
        break;

      case 3:
        document.getElementById("rate1")?.style.setProperty("display", "none")
        document.getElementById("rate1Fill")?.style.setProperty("display", "block")
        document.getElementById("rate2")?.style.setProperty("display", "none")
        document.getElementById("rate2Fill")?.style.setProperty("display", "block")
        document.getElementById("rate3")?.style.setProperty("display", "none")
        document.getElementById("rate3Fill")?.style.setProperty("display", "block")
        document.getElementById("rate4")?.style.setProperty("display", "block")
        document.getElementById("rate4Fill")?.style.setProperty("display", "none")
        document.getElementById("rate5")?.style.setProperty("display", "block")
        document.getElementById("rate5Fill")?.style.setProperty("display", "none")
        break;

      case 4:
        document.getElementById("rate1")?.style.setProperty("display", "none")
        document.getElementById("rate1Fill")?.style.setProperty("display", "block")
        document.getElementById("rate2")?.style.setProperty("display", "none")
        document.getElementById("rate2Fill")?.style.setProperty("display", "block")
        document.getElementById("rate3")?.style.setProperty("display", "none")
        document.getElementById("rate3Fill")?.style.setProperty("display", "block")
        document.getElementById("rate4")?.style.setProperty("display", "none")
        document.getElementById("rate4Fill")?.style.setProperty("display", "block")
        document.getElementById("rate5")?.style.setProperty("display", "block")
        document.getElementById("rate5Fill")?.style.setProperty("display", "none")
        break;

      case 5:
        document.getElementById("rate1")?.style.setProperty("display", "none")
        document.getElementById("rate1Fill")?.style.setProperty("display", "block")
        document.getElementById("rate2")?.style.setProperty("display", "none")
        document.getElementById("rate2Fill")?.style.setProperty("display", "block")
        document.getElementById("rate3")?.style.setProperty("display", "none")
        document.getElementById("rate3Fill")?.style.setProperty("display", "block")
        document.getElementById("rate4")?.style.setProperty("display", "none")
        document.getElementById("rate4Fill")?.style.setProperty("display", "block")
        document.getElementById("rate5")?.style.setProperty("display", "none")
        document.getElementById("rate5Fill")?.style.setProperty("display", "block")
        break;

      default:
        break;
    }

  }

  /**
   *  Evaluate route
   * @param rate 
   */
  evaluate(rate: number) {
    this.userEvaluation = rate;
    if (this.routeID)
      this.routeService.evaluateRoute(this.routeID, rate).subscribe(
      )


  }

}

/**
 * Helps with the a comment that can be posted by the user. 
 */
interface commentHelper {
  errorCommenting: boolean,
  commentRouteVM: CommentRouteVM,
  userPhoto: string
}



