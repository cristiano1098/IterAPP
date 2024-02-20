import { PlaceService } from "../services/place.service";
import { googlePlaceVM } from "../viewModels/responses/googlePlaceVM";
import { RoutePlaceType } from "../viewModels/Types/RoutePlaceType";
import { Place } from "./Place";

/**
 * This class is used to represent a place that has a visit start and finish time
 */
export class PlaceVisit extends Place {

    /**
     * Construct's an instance of {@link PlaceVisit}.
     * 
     * @param id place's id
     * @param name place's name
     * @param categories place's categories
     * @param coords place's coordinates
     * @param url place's image url
     * @param startTime start visit hour
     * @param finishTime finish visit hour
     */
    constructor(
        id: string,
        name: string,
        categories: string[], // Image can be obtained using google API
        coords: {
            lat: number
            lon: number
        },
        url: string,
        public startTime: string,
        public finishTime: string
    ) {
        super(id, name, categories, coords, url)
    }

    /**
     * Returns an instance of {@link PlaceVisit} that represents the {@link googlePlaceVM} param with the visiting time defined in the {@link PlaceVisit} param
     * 
     * @param googlePlaceVM the place to be transformed into a {@link PlaceVisit}
     * @param routePlace the information about the start and finish time of the visit to the [place]{@link PlaceVisit}
     * @returns an instance of {@link PlaceVisit} that represents the {@link googlePlaceVM} param with the visiting time defined in the {@link PlaceVisit} param
     */
    static instanceFromGooglePlaceVM(googlePlaceVM: googlePlaceVM, routePlace: RoutePlaceType) {
        return new PlaceVisit(
            googlePlaceVM.place_id,
            googlePlaceVM.name,
            googlePlaceVM.types,
            {
                lat: googlePlaceVM.geometry.location.lat,
                lon: googlePlaceVM.geometry.location.lng
            },
            PlaceService.getPlacePhotoURL(googlePlaceVM.place_id),
            RoutePlaceType.getStringTime(new Date(routePlace.startTime)),
            RoutePlaceType.getStringTime(new Date(routePlace.finishTime))
        )
    }

    /**
     * Sorts a {@link PlaceVisit} array. This method mutates the array and returns a reference to the same array.
     * 
     * @returns a reference to the same array after being sorted.
     */
    static sortPlaces(places: PlaceVisit[]): PlaceVisit[] {
        return places.sort((first: PlaceVisit, second: PlaceVisit) => {
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

}