import { Component, OnInit } from '@angular/core'
import { PlaceView } from 'src/app/models/Place'
import { RouteView } from 'src/app/models/Route'
import { PlaceService } from 'src/app/services/place.service'
import { UserService } from 'src/app/services/user.service'
import { UserVM } from 'src/app/viewModels/responses/UserVM'
import { RouteResumeType } from 'src/app/viewModels/Types/RouteResumeType'
import { UtilitiesComponent } from '../../utilities/utilities.component'

/**
 * This component allows any user to see his routes
 */
@Component({
  selector: 'app-user-routes-list',
  templateUrl: './user-routes-list.component.html',
  styleUrls: ['./user-routes-list.component.css', './../../route/route-list/route-list.component.css']
})
export class UserRoutesListComponent implements OnInit {

  /**
   * @ignore
   */
  constructor(private userService: UserService, private placeService: PlaceService) { }

  /**
   * User public Routes
   */
  publicRoutes: Array<RouteView> = new Array<RouteView>()

  /**
   * User private Routes
   */
  privateRoutes: Array<RouteView> = new Array<RouteView>()

  /**
   * User who is seeing his routes
   */
  user?: UserVM

  /**
   * Specifies if the public or private routes are being displayed.
   * True means the public routes are dispalyed, false means the private routes are displayed.
   */
  displayPublicRoutes: boolean = true

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.getUser()
    this.getUserRoutes()

    UtilitiesComponent.autoResizeIfSmaller("divMain")
  }

  /**
   * Makes a backedn request to get the user info and saves it.
   */
  getUser() {
    this.userService.getAccount().subscribe(
      (result) => {
        this.user = result
      }
    )
  }

  /**
   * Saves a route into the {@link privateRoutes} or {@link publicRoutes} depending on the isPrivate param.
   * The route will be saved based on the [route]{@link RouteResumeType} param, from this route all place information will 
   * be requested to the backend, in order to display the place photo
   * 
   * @param route the route to be saved
   * @param isPrivate if the route is private or not
   */
  saveRote(route: RouteResumeType, isPrivate: boolean) {
    let routeView = new RouteView(route.name, route.routeID, route.averageRating, route.userName, route.description, route.numberOfUses, [], [], route.profilePhoto)

    route.places.forEach(
      (routePlace, palceIndex) => {
        this.placeService.getPlace(routePlace.idPlace).subscribe(
          (place) => {
            let placeView = new PlaceView(place.place_id, place.types, PlaceService.getPlacePhotoURL(place.place_id))
            routeView.places.push(placeView)
          },
          (error) => {
            console.error(error)
          },
          () => {
            if (palceIndex == route.places.length - 1) {
              let newRoute = this.addCategories(routeView);
              console.log(newRoute);

              if (newRoute) {
                if (isPrivate) {
                  this.privateRoutes.push(newRoute)
                } else {
                  this.publicRoutes.push(newRoute)
                }
              }
            }
          }
        )
      }
    )
  }

  addCategories(route: RouteView): RouteView | undefined {
    if (!route) return undefined

    route.places.forEach(
      (place) => {
        place.categories.forEach(
          (categorie) => {
            for (let index = 0; index < route.categories.length; index++) {
              const element = route.categories[index];

              if (element == categorie) return

            }

            route.categories.push(categorie);
          }
        )
      }
    )
    return route;
  }

  /**
   * Gets the all the routes that belong to a user, private and public.
   * Saves the routes in the [publicRoutes array]{@link publicRoutes} and in the [privateRoutes array]{@link privateRoutes}.
   */
  getUserRoutes() {
    this.userService.getRoutes(false).subscribe(
      (result) => {
        result.routes.forEach(
          (route) => {
            this.saveRote(route, false)
          }
        )
      },
      (error) => {
        console.log(error)
      }
    )

    this.userService.getRoutes(true).subscribe(
      (result) => {
        result.routes.forEach(
          (route) => {
            this.saveRote(route, true)
          }
        )
      },
      (error) => {
        console.error(error)
      }
    )

    // this.publicRoutes = [
    //   {
    //     name: "Dia Em Guimarães",
    //     routeID: 0,
    //     averageRating: 4.5,
    //     userName: "joao",
    //     profilePhoto: undefined,
    //     description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque eius magnam iusto? Eligendi quae inventore accusantium assumenda nisi beatae quas delectus excepturi, nostrum voluptatibus, nobis ipsum voluptate! Iusto, expedita dolorem.",
    //     numberOfUses: 404,
    //     categories: [
    //       "tourist_attraction",
    //       "point_of_interest",
    //       "town_square",
    //       "establishment"
    //     ],
    //     places: [
    //       {
    //         placeID: "ChIJIzwXZuzvJA0ROaxWynCX6fw",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8p3D2h1_AgNowZYjkq7QoM8vxuMUmmXeLz_iIsaWKNCB5ZoUooHPkDkSp-9mJ84DswO1FkfT20HGQxfvxpGeKMSScfesx1lZ0Y=s1600-w4608",
    //         categories: [
    //           "tourist_attraction",
    //           "point_of_interest",
    //           "establishment"
    //         ]
    //       },
    //       {
    //         placeID: "ChIJq52uv5jlJA0RbHxYi2q2xlw",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8quQYBc3xjaqRlsTjh8DKdXgLTBh_rWmI2A3uexzDEJ8ir0ntIKLm46byD9sYDFDegCR9c0TewcJo_zIVsxST1yuyUw6BVWt1o=s1600-w405",
    //         categories: [
    //           "museum",
    //           "tourist_attraction",
    //           "point_of_interest",
    //           "establishment"
    //         ]
    //       },
    //       {
    //         placeID: "ChIJZRat3sHvJA0RrNrkwi1QifA",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8pOB7cxZ2h9JsQyiw-SVt0a91osjgbC4DeEVxPS9sYvemxMl8N1oTOn2_UDV5DOxLYxOmyosNPQU8iBHPPJtZuRWbica_Ajh7k=s1600-w2448",
    //         categories: [
    //           "town_square"
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     name: "Dia Em Guimarães 2",
    //     routeID: 1,
    //     averageRating: 4,
    //     userName: "joao",
    //     profilePhoto: undefined,
    //     description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque eius magnam iusto? Eligendi quae inventore accusantium assumenda nisi beatae quas delectus excepturi, nostrum voluptatibus, nobis ipsum voluptate! Iusto, expedita dolorem.",
    //     numberOfUses: 30,
    //     categories: [
    //       "tourist_attraction",
    //       "point_of_interest",
    //       "town_square",
    //       "establishment"
    //     ],
    //     places: [
    //       {
    //         placeID: "ChIJIzwXZuzvJA0ROaxWynCX6fw",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8p3D2h1_AgNowZYjkq7QoM8vxuMUmmXeLz_iIsaWKNCB5ZoUooHPkDkSp-9mJ84DswO1FkfT20HGQxfvxpGeKMSScfesx1lZ0Y=s1600-w4608",
    //         categories: [
    //           "tourist_attraction",
    //           "point_of_interest",
    //           "establishment"
    //         ]
    //       },
    //       {
    //         placeID: "ChIJq52uv5jlJA0RbHxYi2q2xlw",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8quQYBc3xjaqRlsTjh8DKdXgLTBh_rWmI2A3uexzDEJ8ir0ntIKLm46byD9sYDFDegCR9c0TewcJo_zIVsxST1yuyUw6BVWt1o=s1600-w405",
    //         categories: [
    //           "museum",
    //           "tourist_attraction",
    //           "point_of_interest",
    //           "establishment"
    //         ]
    //       },
    //       {
    //         placeID: "ChIJZRat3sHvJA0RrNrkwi1QifA",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8pOB7cxZ2h9JsQyiw-SVt0a91osjgbC4DeEVxPS9sYvemxMl8N1oTOn2_UDV5DOxLYxOmyosNPQU8iBHPPJtZuRWbica_Ajh7k=s1600-w2448",
    //         categories: [
    //           "town_square"
    //         ]
    //       }
    //     ]
    //   }
    // ]

    // this.privateRoutes = [
    //   {
    //     name: "Dia Em Guimarães 3 ",
    //     routeID: 2,
    //     averageRating: 4.5,
    //     userName: "joao",
    //     profilePhoto: undefined,
    //     description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque eius magnam iusto? Eligendi quae inventore accusantium assumenda nisi beatae quas delectus excepturi, nostrum voluptatibus, nobis ipsum voluptate! Iusto, expedita dolorem.",
    //     numberOfUses: 404,
    //     categories: [
    //       "tourist_attraction",
    //       "point_of_interest",
    //       "town_square",
    //       "establishment"
    //     ],
    //     places: [
    //       {
    //         placeID: "ChIJIzwXZuzvJA0ROaxWynCX6fw",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8p3D2h1_AgNowZYjkq7QoM8vxuMUmmXeLz_iIsaWKNCB5ZoUooHPkDkSp-9mJ84DswO1FkfT20HGQxfvxpGeKMSScfesx1lZ0Y=s1600-w4608",
    //         categories: [
    //           "tourist_attraction",
    //           "point_of_interest",
    //           "establishment"
    //         ]
    //       },
    //       {
    //         placeID: "ChIJq52uv5jlJA0RbHxYi2q2xlw",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8quQYBc3xjaqRlsTjh8DKdXgLTBh_rWmI2A3uexzDEJ8ir0ntIKLm46byD9sYDFDegCR9c0TewcJo_zIVsxST1yuyUw6BVWt1o=s1600-w405",
    //         categories: [
    //           "museum",
    //           "tourist_attraction",
    //           "point_of_interest",
    //           "establishment"
    //         ]
    //       },
    //       {
    //         placeID: "ChIJZRat3sHvJA0RrNrkwi1QifA",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8pOB7cxZ2h9JsQyiw-SVt0a91osjgbC4DeEVxPS9sYvemxMl8N1oTOn2_UDV5DOxLYxOmyosNPQU8iBHPPJtZuRWbica_Ajh7k=s1600-w2448",
    //         categories: [
    //           "town_square"
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     name: "Dia Em Guimarães 4",
    //     routeID: 3,
    //     averageRating: 4,
    //     userName: "joao",
    //     profilePhoto: undefined,
    //     description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque eius magnam iusto? Eligendi quae inventore accusantium assumenda nisi beatae quas delectus excepturi, nostrum voluptatibus, nobis ipsum voluptate! Iusto, expedita dolorem.",
    //     numberOfUses: 30,
    //     categories: [
    //       "tourist_attraction",
    //       "point_of_interest",
    //       "town_square",
    //       "establishment"
    //     ],
    //     places: [
    //       {
    //         placeID: "ChIJIzwXZuzvJA0ROaxWynCX6fw",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8p3D2h1_AgNowZYjkq7QoM8vxuMUmmXeLz_iIsaWKNCB5ZoUooHPkDkSp-9mJ84DswO1FkfT20HGQxfvxpGeKMSScfesx1lZ0Y=s1600-w4608",
    //         categories: [
    //           "tourist_attraction",
    //           "point_of_interest",
    //           "establishment"
    //         ]
    //       },
    //       {
    //         placeID: "ChIJq52uv5jlJA0RbHxYi2q2xlw",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8quQYBc3xjaqRlsTjh8DKdXgLTBh_rWmI2A3uexzDEJ8ir0ntIKLm46byD9sYDFDegCR9c0TewcJo_zIVsxST1yuyUw6BVWt1o=s1600-w405",
    //         categories: [
    //           "museum",
    //           "tourist_attraction",
    //           "point_of_interest",
    //           "establishment"
    //         ]
    //       },
    //       {
    //         placeID: "ChIJZRat3sHvJA0RrNrkwi1QifA",
    //         photoURL: "https://lh3.googleusercontent.com/places/AAcXr8pOB7cxZ2h9JsQyiw-SVt0a91osjgbC4DeEVxPS9sYvemxMl8N1oTOn2_UDV5DOxLYxOmyosNPQU8iBHPPJtZuRWbica_Ajh7k=s1600-w2448",
    //         categories: [
    //           "town_square"
    //         ]
    //       }
    //     ]
    //   }
    // ]
  }

}
