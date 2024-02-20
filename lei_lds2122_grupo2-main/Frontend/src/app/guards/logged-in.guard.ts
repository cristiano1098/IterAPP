import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

/**
 * This guard is used to prevent non-logged-in users to access a route they shouldn't
 */
@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  /**
   * @ignore
   */
  constructor(private router: Router) { }

  /**
   * Returns whether the user is logged in or not
   * 
   * @returns true if the user is logged in, otherwise returns false
   */
  canActivate(): boolean {
    if (localStorage.getItem("token") !== null) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

}
