import { Component, OnInit } from '@angular/core';

/**
 * Component with some utilities functions.
 * Methods that are usefull and can be used in all components can be declared in this component
 */
@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.css']
})
export class UtilitiesComponent implements OnInit {

  /**
   * @ignore
   */
  constructor() { }

  /**
   * @ignore
   */
  ngOnInit(): void {
  }

  /**
   * Given a HTML element id, that element's height will be changed to cover 100% of the visible window.
   * The element's new height will be calculated using the total view window height and the [navbar]{@link NavBarComponent} height
   * 
   * @param targetDivID the element to be resized
   */
   static autoResizeDiv(targetDivID: string) {
    const targetDiv = document.getElementById(targetDivID);

    if (targetDiv) {
      targetDiv.style.height = this.getComponentMaxVisibleHeight() + "px";
    }
  }

  /**
   * Resizes the targetDiv if the div dimension is less than the window visible height for that component.
   * 
   * @param targetDivID the target div to be resized
   */
  static autoResizeIfSmaller(targetDivID: string) {
    const targetDiv = document.getElementById(targetDivID);

    if (targetDiv && targetDiv.offsetHeight < this.getComponentMaxVisibleHeight()) {
      this.autoResizeDiv(targetDivID)
    }
  }

  /**
   * Returns if the user is logged in or not
   * 
   * @returns true if the user is logged in, otherwise returns false
   */
  static isLoggedIn(): boolean {
    return localStorage.getItem("token") != null
  }

  /**
   * Returns the max visible height for the component.
   * 
   * @returns the max visible height for the component.
   */
  static getComponentMaxVisibleHeight(): number {
    let result = window.innerHeight - this.getNavBarHeight()

    return result
  }

  /**
   * Returns the height in px of the nav bar.
   * 
   * @returns the height in px of the nav bar.
   */
  static getNavBarHeight(): number {
    let navHeight = 0;
    let nav = document.getElementById("navBar");

    if (nav && nav.offsetHeight == 0) {
      nav = document.getElementById("navBarMobile")
    }

    if (nav) {
      navHeight = nav.offsetHeight
    }

    return navHeight
  }

  /**
   * Returns the user name of the logged in user
   * 
   * @returns the user name of the logged in user
   */
  static getLoggedInUserName(): string | null {
    return localStorage.getItem("username")
  }
}
