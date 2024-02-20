import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from 'src/app/models/Place';
import { AuthService } from 'src/app/services/auth.service';
import { PlaceService } from 'src/app/services/place.service';
import { googlePlaceVM } from 'src/app/viewModels/responses/googlePlaceVM';
import { PlacesVM } from 'src/app/viewModels/responses/PlacesVM';
import { categoriesTranslations } from '../route/categoriesTranslations';
import { MapComponent } from '../route/map/map.component';
import { UtilitiesComponent } from '../utilities/utilities.component';

@Component({
  selector: 'app-view-place',
  templateUrl: './view-place.component.html',
  styleUrls: ['./view-place.component.css']
})
export class ViewPlaceComponent implements OnInit {

  service: google.maps.places.PlacesService = new google.maps.places.PlacesService(document.createElement("div"))

  placeVM?: googlePlaceVM

  place?: Place

  placeID?: string

  @ViewChild(MapComponent) map?: MapComponent

  translations: any = categoriesTranslations

  visited: boolean = false

  interested: boolean = false

  changingInterested: boolean = false

  changingVisited: boolean = false

  placeNotFound?: boolean

  isLoggedIn: boolean = UtilitiesComponent.isLoggedIn()

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private placeService: PlaceService) { }

  /**
   * Init the getDetails service where we will get all the details about the place
   */
  ngOnInit(): void {

    this.authService.currentLoginStatus.subscribe(
      (isLogged) => {
        this.isLoggedIn = isLogged.valueOf()
      }
    )

    this.getPlace()
    UtilitiesComponent.autoResizeIfSmaller("mainDiv")

    this.checkIfInterested()
    this.checkIfVisited()
  }

  getPlace() {
    this.placeID = this.route.snapshot.params["id"];

    if (this.placeID) {


      this.placeService.getPlace(this.placeID).subscribe(
        (result) => {
          this.placeNotFound = false
          this.placeVM = result
          this.place = new Place(
            this.placeVM.place_id!,
            this.placeVM.name!,
            this.placeVM.types!,
            {
              lat: this.placeVM.geometry!.location!.lat,
              lon: this.placeVM.geometry!.location!.lng
            },
            PlaceService.getPlacePhotoURL(this.placeID!)
          )

          this.map?.addMarker(this.place)



        }
      )
    }
  }

  checkIfInterested() {
    this.placeService.getInterestedPlaces().subscribe(
      (result) => {
        if (result.places) {
          for (let i = 0; i < result.places.length; i++) {
            if (this.placeID == result.places[i]) {
              this.interested = true
            }
          }
        }

      }
    )
  }

  checkIfVisited() {
    this.placeService.getVisitedPlaces().subscribe(
      (result) => {
        if(result.places)
        for (let i = 0; i < result.places.length; i++) {
          if (this.placeID == result.places[i]) {
            this.visited = true
          }
        }
      }
    )
  }

  addInterested() {
    this.changingInterested = true

    if (this.placeVM) {
      this.placeService.addInterestedPlace(this.placeVM.place_id).subscribe(
        (result) => {
          this.interested = true

        },
        (error) => {
          console.error(error)

        },
        () => {
          this.changingInterested = false

        }
      )
    }
  }

  addVisited() {
    this.changingVisited = true

    if (this.placeVM) {
      this.placeService.addVisitedPlace(this.placeVM.place_id).subscribe(
        (result) => {
          this.visited = true
        },
        (error) => {
          console.error(error)
        },
        () => {
          this.changingVisited = false
        }
      )
    }
  }

  removeInterested() {
    this.changingInterested = true;
    if (this.placeVM) {
      this.placeService.removeInterestedPlace(this.placeVM.place_id).subscribe(
        (result) => {
          this.interested = false
        },
        (error) => {
          console.error(error)
        },
        () => {
          this.changingInterested = false
        }
      )
    }
  }

  removeVisited() {
    this.changingVisited = true;
    if (this.placeVM) {
      this.placeService.removeVisitedPlace(this.placeVM.place_id).subscribe(
        (result) => {
          this.visited = false
        },
        (error) => {
          console.error(error)
        },
        () => {
          this.changingVisited = false
        }
      )
    }
  }

  setMouseOverInterestedBtn(hover: boolean) {
    // let span: HTMLElement
    // let button: HTMLElement

    // if (this.interested) {
    //   span = document.getElementById("spanRemoveInterested")!
    //   button = document.getElementById("btnRemoveInterested")!
    // } else {
    //   span = document.getElementById("spanAddInterested")!
    //   button = document.getElementById("btnAddInterested")!
    // }

    // this.mouseOverInterestedBtn = hover

    // if (hover && !this.changingInterested) {
    //   if (this.interested) {

    //     button.style.backgroundColor = "#bb2d3b"
    //     button.style.borderColor = "#bb2d3b"

    //   } else {

    //     button.style.backgroundColor = "var(--greenMain)"
    //     button.style.borderColor = "var(--greenMain)"

    //   }
    // } else {
    //   if (this.interested) {

    //     button.style.backgroundColor = "var(--greenMain)"
    //     button.style.borderColor = "var(--greenMain)"

    //   } else {

    //     button.style.backgroundColor = "#bb2d3b"
    //     button.style.borderColor = "#bb2d3b"

    //   }
    // }
  }
}


