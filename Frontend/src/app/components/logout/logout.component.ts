import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

/**
 * This component allows the user to log out, clearing all the information stored in the local storage.
 */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  /**
   * @ignore
   */
  constructor(private router: Router, private authService: AuthService) { }

  /**
   * To logout it is necessary to delete everything in the local storage,
   * because only login information its stored there 
   */
  ngOnInit(): void {
    localStorage.clear()
    this.authService.updateLoggedInStatus()
    this.router.navigate([''])
  }

}
