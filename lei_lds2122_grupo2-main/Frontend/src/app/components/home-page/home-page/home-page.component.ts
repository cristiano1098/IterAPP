import { Component, OnInit } from '@angular/core';
import { UtilitiesComponent } from '../../utilities/utilities.component';

/**
 * This components controls what home page is shown, if it is the {@link NotAuthenticatedHomePageComponent} or the {@link AuthenticatedHomePageComponent}
 */
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  /**
   * Specifies if the user is logged in
   */
  loggedIn: boolean = false

  /**
   * Specifies if the home page component can be shown
   */
  showComponent: boolean = false

  /**
   * @ignore
   */
  constructor() { }

  /**
   * Inits the component
   */
  ngOnInit(): void {
    this.loggedIn = UtilitiesComponent.isLoggedIn()
    this.showComponent = true
  }

}
