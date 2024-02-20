import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserVM } from '../../../viewModels/responses/UserVM'


/**
 * This component allows an authenticated user to edit his own account.
 */
@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {

  /**
   * Path to default image file
   */
  registerImage: string = "assets/images/avatarmasculine.png"

  /**
   *  View Model that will be sent to the backend if the user wants edit the account.
   */
  user: UserVM = new UserVM("", "", "", "", false, "", "");

  /**
   * @ignore
   */
  constructor(private userService: UserService, private router: Router,) { }

  /**
   * Displays the current account data that is requested from the backend using the [user service]{@link UserService#editAccount}
   */
  ngOnInit(): void {
    this.userService.getAccount().subscribe((data: UserVM) => {
      this.user = data;
      this.user.birthDate = this.user.birthDate.split("T")[0];
    })
  }

  /**
   * Sends a edit account request to the backend using the [user service]{@link UserService#getAccount}  with the [updated data]{@link EditAccountComponent#user}
   */
  edit(): void {

    let test = new UserVM(this.user.userName, this.user.email,
      this.user.name, this.user.birthDate, this.user.privateProfile,
      this.user.description, this.user.profilePhoto);
    this.userService.editAccount(test).subscribe(
      (response) => {
        this.router.navigate(['user/account']);
      },
      (error) => {
        this.router.navigate(['user/account']);
      }
    )
  }

}
