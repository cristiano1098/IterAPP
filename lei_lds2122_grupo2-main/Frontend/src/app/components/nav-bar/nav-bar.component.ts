import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Dropdown, Modal } from 'bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { PlaceService } from 'src/app/services/place.service';
import { RouteService } from 'src/app/services/route.service';
import { UserService } from 'src/app/services/user.service';
import { UserSearchListVM } from 'src/app/viewModels/responses/UserSearchListVM';
import { autocompleteOptions } from '../route/options';
import { RouteListComponent } from '../route/route-list/route-list.component';
import { UtilitiesComponent } from '../utilities/utilities.component';

/**
 * This component is used to display a nav bar that dynamically presents the user the options
 * that he is allowed to use
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, AfterViewInit {

  /**
   * Determines if the user is logged in
   */
  userLoggedIn: Boolean = UtilitiesComponent.isLoggedIn();

  /**
   * Determines if the main menu is visible in the mobile version
   */
  mobileMenuVisibility: boolean = false;

  /**
   * Determines if the user menu is visible in the mobile version 
   */
  mobileUserMenuVisibility: boolean = false;

  /**
   * Modal of the user list
   */
  userModal?: Modal

  /**
   * Modal for mobile user list
   */
  mobileUserModal?: Modal

  /**
   * Modal for route searching.
   */
  searchRouteModal?: Modal

  /**
   * List with the results of the searched user. 
   */
  searchedUsers: UserSearchListVM = new UserSearchListVM([])

  /**
   * User search variables
   */
  userSearch: SearchHelper = {
    input: "",
    searching: false,
    requestError: false
  }

  /**
   * Components that displays {@link RouteView} searched by the user
   */
  @ViewChild(RouteListComponent) routesListComponent?: RouteListComponent

  /**
   * Route search variables
   */
  routeSearch: SearchHelper = {
    input: "",
    searching: false,
    requestError: false
  }

  /**
   * Specifies if the route search didn't found any route.
   */
  noRoutesFound = false

  /**
   * Modal for place searching.
   */
  searchPlaceModal?: Modal

  /**
   * Autocomplete input search box that is used to search places in the [Google Places API]{@link https://developers.google.com/maps/documentation/places/web-service/autocomplete}.
   */
  autocomplete?: google.maps.places.Autocomplete

  /**
   * @ignore
   */
  constructor(private authService: AuthService, private userService: UserService, private routeService: RouteService, private router: Router) { }

  /**
   * Changes the logo element to a specific width in a way that the main navbar buttons are centered.
   * 
   * This has to be done due to justify-content-between class which doens´t align in center the navbar buttons (<ul> line 5)
   *  if the element to the right and to the left don't have the same width.
   */
  ngOnInit(): void {

    this.authService.currentLoginStatus.subscribe(
      (isLoggedIn) => {
        this.userLoggedIn = isLoggedIn
        if (this.userLoggedIn) {
          let logoDiv = document.getElementById("logoBigScreen")
          let searchUsersDiv = document.getElementById("divSearchUser")
          let userMenuIcon = document.getElementById("divUserDropWeb")

          logoDiv?.setAttribute("style", "width: max-content")
          userMenuIcon?.setAttribute("style", "width: " + logoDiv?.offsetWidth + searchUsersDiv?.offsetWidth + "px")

        }
        if (!this.userLoggedIn) {
          document.getElementById("logoBigScreen")?.setAttribute("style", "width:171.5px")
        }
      }
    )

    this.initAutocomplete()

  }

  /**
   * @ignore
   */
  ngAfterViewInit(): void {
    let searchFriends = document.getElementById("searchFriends")
    searchFriends?.addEventListener("keyup", (event) => {
      if (event.key == "Enter") {
        this.userSearch.searching = true
        this.displayUserSearchModal()
        this.searchUsersWeb()
      }
    })

    let searchRoutes = document.getElementById("searchRoutes")
    searchRoutes?.addEventListener("keyup", (event) => {
      if (event.key == "Enter") {
        this.searchRoutes()
      }
    })
  }

  /**
   * Inits the [auto complete]{@link CreateRouteComponent#autocomplete} search input with predefined options. 
   * The options can be found in the constant {@link autocompleteOptions}.
   */
  initAutocomplete(): void {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('placeAutocomplete') as HTMLInputElement, autocompleteOptions)

    // every time the user clicks on a place when searching the place is saved in the selected place variable
    this.autocomplete.addListener('place_changed', () => {
      this.clearAutocomplete()
      this.searchPlaceModal!.hide()
      this.router.navigate(['place', this.autocomplete!.getPlace().place_id]).then(() => {
        window.location.reload();
      })

    })

  }

  clearAutocomplete() {
    (document.getElementById('placeAutocomplete') as HTMLInputElement).value = ''
  }

  showSearchPlaceModal() {
    if (!this.searchPlaceModal) {
      this.searchPlaceModal = new Modal(document.getElementById("placeModal")!)
    }
    this.mobileMenuVisibility = false

    this.searchPlaceModal.show()
  }

  /**
   * Shows the route search modal.
   */
  showSearchRouteModal(): void {
    if (!this.searchRouteModal) {
      this.searchRouteModal = new Modal(document.getElementById("routeModal")!)
    }
    this.mobileMenuVisibility = false

    this.searchRouteModal.show()
  }

  /**
   * Searches routes given a specific input. After receiving the routes from the backend the {@link routesListComponent} displays them.
   */
  searchRoutes() {
    if (this.routeSearch.input == "") return

    this.routeSearch.searching = true
    this.noRoutesFound = false
    this.routeService.searchRoute(this.routeSearch.input).subscribe(
      (routes) => {
        if (routes.length == 0) {
          this.noRoutesFound = true
          return
        }

        this.routesListComponent?.setRoutes(routes)

      },
      (error) => {
        console.error(error);
      },
      () => {
        this.routeSearch.searching = false
      }
    )
  }

  /**
   * Web user searching method
   * Displays the web modal and displays the found user list.
   */
  searchUsersWeb() {
    this.displayUserSearchModal()
    this.searchUsers()
  }

  /**
   * Mobile user searching method
   * Displays the mobile modal that allows user searching.
   */
  searchUsersMobile() {
    this.displayMobileUserSearchModal()
    this.searchUsers()
  }

  /**
   * Searches users given an input and adds then to the {@link searchedUsers} array
   */
  searchUsers() {
    if (this.userSearch.input == "") return

    this.userService.searchUser(this.userSearch.input).subscribe(
      (result) => {
        this.searchedUsers = result
        this.userSearch.searching = false
        this.userSearch.requestError = false
      },
      (error) => {
        console.error(error)
        this.userSearch.requestError = true
        this.userSearch.searching = false
      }
    )

  }

  /**
   * Displays the user search modal for web.
   */
  displayUserSearchModal() {
    if (!this.userModal) {
      this.userModal = new Modal(document.getElementById("userModal")!)
    }
    this.userModal.show()
  }


  /**
   * Displays the user search modal for the mobile version.
   */
  displayMobileUserSearchModal() {
    if (!this.mobileUserModal) {
      this.mobileUserModal = new Modal(document.getElementById("mobileUserModal")!)
    }

    this.mobileUserModal.show()
  }

  /**
   * Display's or hides the mobile nav bar menu 
   */
  displayMobileMenu() {
    this.mobileUserMenuVisibility = false;
    this.mobileMenuVisibility = !this.mobileMenuVisibility
  }

  /**
   * Display's or hides the mobile nav bar user menu 
   */
  displayMobileUserMenu() {
    this.mobileMenuVisibility = false;
    this.mobileUserMenuVisibility = !this.mobileUserMenuVisibility
  }

  /**
   * Shows a dropdown list based on the buton that shows that list.
   * 
   * @param btnID the button that shows the dropdown list.
   */
  showDropdown(btnID: string) {
    let button = document.getElementById(btnID) as HTMLElement
    let dropdown = new Dropdown(button)
    dropdown.toggle()
  }

}

/**
 * State variables that help to display information to the user on the process of search users.
 */
interface SearchHelper {

  /**
   * Specifies if a searching request is waiting for a response
   */
  searching: boolean,

  /**
   * Specifies if there was an error while requesting the users.
   */
  requestError: boolean,


  /**
   * Value of the search input.
   */
  input: string,
}
