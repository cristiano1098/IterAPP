import { PlaceVisit } from "src/app/models/PlaceVisit";

/**
 * Represents a place returned by the backend that has the same structure of a [palce details]{@link https://developers.google.com/maps/documentation/places/web-service/details}
 */
export class googlePlaceVM {

    /**
     * Construct's an instance of googlePlacesVM
     * 
     * @param business_status Indicates the operational status of the place.
     * @param place_id the id of the place.
     * @param geometry location of the place.
     * @param name name of the place.
     * @param rating rating of the place.
     * @param types types/categories of the place.
     * @param user_ratings_total total amount of ratings.
     * @param opening_hours hours that the place is open.
     * @param averageVisitTime average visit time of the place.
     * @param suggestionScore sugested score.
     * @param photo_reference photo reference of the place.
     * @param photo_url url for the place photo.
     */
    constructor(
        public business_status: string,
        public place_id: string,
        public geometry: {
            location: {
                lat: number,
                lng: number
            }
        },
        public name: string,
        public rating: number,
        public types: Array<string>,
        public user_ratings_total: number,
        public opening_hours: {
            open_now: boolean,
            periods: Array<{
                day: number,
                time: string
            }>
        },
        public averageVisitTime: number,
        public suggestionScore: number,
        public photo_reference: string,
        public photo_url?: string
    ) { }
}