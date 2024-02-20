import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlaceCardView } from 'src/app/models/Place';
import { PlaceService } from 'src/app/services/place.service';
import { PlacesVM } from 'src/app/viewModels/responses/PlacesVM';
import { UtilitiesComponent } from '../../utilities/utilities.component';

/**
 * This component allows an authenticated user to see own list of interested places
 */
@Component({
  selector: 'app-interested-places',
  templateUrl: './interested-places.component.html',
  styleUrls: ['./interested-places.component.css']
})
export class InterestedPlacesComponent implements OnInit {

  /**
   * List of Interested Places to display
   */
  places: Array<PlaceCardView> = new Array

  /**
   * @ignore
   */
  constructor(private placeService: PlaceService, private router: Router,) { }

  /**
   * 
   * Displays the list of interested places that is requested from the backend using the [place service]{@link PlaceService#getInterestedPlaces}
   */
  ngOnInit(): void {
    UtilitiesComponent.autoResizeIfSmaller("divMain")
    this.placeService.getInterestedPlaces().subscribe((data: PlacesVM) => {
      /*
      //teste
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
            console.log(newPlace);

          }
        )

      })
    })
  }



}
