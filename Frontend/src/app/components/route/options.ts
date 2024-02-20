
/**
 * Latitude of Guimarães
 */
let lat = 41.4478935

/**
 * Longitude of Guimarães
 */
let lng = -8.2903191

/**
 * Auto complete options.
 * Bounds are set to Guimarães nearby region
 */
export const autocompleteOptions = {
    bounds: {
        north: lat + 0.075,
        south: lat - 0.075,
        east: lng + 0.075,
        west: lng - 0.075,
    },
    componentRestrictions: { country: 'pt' },
    fields: [
        'place_id',
        'name',
        'types',
        'geometry.location',
        'photos'
    ],
    strictBounds: true
}

/**
 * [Google Map]{@link https://developers.google.com/maps/documentation/javascript} options
 */
export const mapOptions = {
    center: {
        lat,
        lng
    },
    zoom: 15,
    styles: [
        {
            'featureType': 'road',
            'elementType': 'labels.icon',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'road.local',
            'elementType': 'labels.icon',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'road.local',
            'elementType': 'labels.text',
            'stylers': [
                {
                    'visibility': 'simplified'
                }
            ]
        },
        {
            'featureType': 'transit',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        }
    ]
}