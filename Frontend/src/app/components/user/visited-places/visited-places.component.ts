import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlaceCardView } from 'src/app/models/Place';
import { PlaceService } from 'src/app/services/place.service';
import { PlacesVM } from 'src/app/viewModels/responses/PlacesVM';
import { UtilitiesComponent } from '../../utilities/utilities.component';

/**
 * This component allows an authenticated user to see own list of visited places
 */
@Component({
  selector: 'app-visited-places',
  templateUrl: './visited-places.component.html',
  styleUrls: ['./visited-places.component.css']
})
export class VisitedPlacesComponent implements OnInit {

  /**
   * List of Visited Places to display
   */
  places: Array<PlaceCardView> = new Array

  /**
   * @ignore
   */
  constructor(private placeService: PlaceService, private router: Router,) { }

  /**
   * 
   * Displays the list of visitedPlaces that is requested from the backend using the [place service]{@link PlaceService#getVisitedPlaces}
   */
  ngOnInit(): void {
    UtilitiesComponent.autoResizeIfSmaller("divMain")
    this.placeService.getVisitedPlaces().subscribe((data: PlacesVM) => {
      /*//teste
      let a = "ChIJIzwXZuzvJA0ROaxWynCX6fw";
      this.placeService.getPlace(a).subscribe(
        (placeInfo) => {
          let photo_url = PlaceService.getPlacePhotoURL(a)

          let newPlace = new PlaceCardView(a, placeInfo.name, placeInfo.types, photo_url, placeInfo.rating)
          this.places.push(newPlace)
          console.log(newPlace);

        })
      //fim de teste
      */

      data.places?.forEach((placeID) => {
        this.placeService.getPlace(placeID).subscribe(
          (placeInfo) => {
            let photo_url = PlaceService.getPlacePhotoURL(placeID)
            let newPlace = new PlaceCardView(placeID, placeInfo.name, placeInfo.types, photo_url, placeInfo.rating)

            this.places.push(newPlace)

          }
        )

      })
    })
  }



}
