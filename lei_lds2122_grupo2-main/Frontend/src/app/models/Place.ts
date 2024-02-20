/**
 * This Model represents a place
 */
export class Place {

    /**
     * Construct's an instance of {@link Place}
     * 
     * @param id place's id
     * @param name place's name
     * @param categories place's categories
     * @param coords place's coordinates
     * @param url place's image url
     * @param description place's description
     */
    constructor(
        public id: string,
        public name: string,
        public categories: string[], // Image can be obtained using google API
        public coords: {
            lat: number
            lon: number
        },
        public url: string,
        public description?: string
    ) { }
}

/**
 * This Model represents the information need to display a {@link Place} in a {@link Route} card, such as the ones that are present in the {@link AuthenticatedHomePageComponent}
 */
export class PlaceView {

    /**
     * Construct's an instance of {@link PlaceView}
     * 
     * @param placeID place's id
     * @param categories place's categories
     * @param photoURL place's image url
     */
    constructor(
        public placeID: string,
        public categories: Array<string>,
        public photoURL: string
    ) { }
}



 export class PlaceCardView {

    /**
     * Construct's an instance of {@link PlaceView}
     * 
     * @param placeID place's id
     * @param categories place's categories
     * @param photoURL place's image url
     */
    constructor(
        public placeID: string,
        public name: string,
        public categories: Array<string>,
        public photoURL: string,
        public rating: number
        
    ) { }
}