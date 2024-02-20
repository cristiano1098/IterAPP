import { Component, OnInit } from '@angular/core';

/**
 * This component shows a home page that is visible to not authenticated users
 */
@Component({
  selector: 'app-not-authenticated-home-page',
  templateUrl: './not-authenticated-home-page.component.html',
  styleUrls: ['./not-authenticated-home-page.component.css']
})
export class NotAuthenticatedHomePageComponent implements OnInit {

  /**
   * @ignore
   */
   constructor() { }

   /**
    * @ignore
    */
   ngOnInit(): void {
     this.resizeHomePage()
     window.onresize = this.resizeHomePage
   }
 
   /**
    * Resizes the main div element based on the screen width and height.
    */
   resizeHomePage() {
     let minHeight766 = 650, minHeight320 = 450
 
     let nav = document.getElementById("navBar");
     let navHeight = 0;
     if (nav && nav.offsetHeight == 0) {
       nav = document.getElementById("navBarMobile")
     }
 
     if (nav) {
       navHeight = nav.offsetHeight
     }
 
     const mainDiv = document.getElementById("mainDiv");
     let mainDivHeight = 0
 
     if (mainDiv) {
       if (window.innerWidth <= 320 && (window.innerHeight - navHeight < minHeight320)) {
         mainDivHeight = minHeight320
       } else if (320 <= window.innerWidth && window.innerWidth <= 766 && (window.innerHeight - navHeight < minHeight766)) {
         mainDivHeight = minHeight766
       } else {
         mainDivHeight = window.innerHeight - navHeight;
       }
 
       mainDiv.style.height = mainDivHeight + "px";
     }
   }
 
}
