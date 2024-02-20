import { Component, OnInit } from '@angular/core';
import { mapOptions } from 'src/app/components/route/options'
import { Place } from 'src/app/models/Place';

/**
 * This component represents a [google map]{@link https://developers.google.com/maps/documentation/javascript/overview}.
 * It is possible to add markers to this map via the component.
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  /**
   * An array of all markers displayed 
   */
  markers: Array<google.maps.Marker> = []

  /**
   * The map
   */
  map?: google.maps.Map

  /**
   * @ignore
   */
  constructor() { }

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.initMap()
  }

  /**
   * Instanciates the {@link map}
   */
  initMap(): void {
    this.map = new google.maps.Map(
      document.getElementById('map')!,
      mapOptions
    )
  }

  /**
   * Adds a marker to the map
   * 
   * @param place the place where the marker will be added
   */
  addMarker(place: Place) {
    let marker: google.maps.Marker = new google.maps.Marker({
      map: this.map!,
      animation: google.maps.Animation.DROP,
      title: place.name,
      clickable: true,
      position: {
        lat: place.coords.lat,
        lng: place.coords.lon
      }
    })

    let re = RegExp(/[^A-Z]/g)
    let label = place.name.replace(re, "")

    marker.setLabel(label)
    this.markers.push(marker)
  }

  /**
   * Removes a marker from the map given an index.
   * 
   * @param index the index of the marker to be removed.
   */
  removeMarker(index: number) {
    this.markers[index].setMap(null)
    this.markers.splice(index, 1)
  }


}
