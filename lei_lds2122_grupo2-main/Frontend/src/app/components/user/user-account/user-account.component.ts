import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserVM } from '../../../viewModels/responses/UserVM'

/**
 * This component allows an authenticated user to edit his own account.
 */
@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  
  /**
   * Path to default image file
   */
  registerImage: string = "assets/images/avatarmasculine.png"

  /**
   *  View Model that represent the account data.
   */
  user: UserVM = new UserVM("", "", "", "", false, "", "");

  /**
   * @ignore
   */
  constructor(private userService: UserService, private router: Router,) { }

  /**
   * Displays the current account data that is requested from the backend using the [user service]{@link UserService#getAccount}
   */
  ngOnInit(): void {
    this.userService.getAccount().subscribe((data: UserVM) => {
      this.user = data;
      this.user.birthDate = this.user.birthDate.split("T")[0];
    })
  }

}
