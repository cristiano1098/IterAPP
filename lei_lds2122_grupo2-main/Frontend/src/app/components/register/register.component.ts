import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilitiesComponent } from 'src/app/components/utilities/utilities.component';
import { CreateUserVM } from 'src/app/viewModels/requests/CreateUserVM';

/**
 * This component allows to create a [user]{@link User} that is stored in the local storage <br>
 * This [user]{@link User} will be previously stored by the {@link RegisterComponent} <br>
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  /**
   * An user that is booted empty using the {@link CreateUserVM}
   */
  userRegisterInfo: CreateUserVM = new CreateUserVM("", "", "", new Date(), "");

  /**
   * Used to help us find if the password used in both password fields is the same.
   */
  passwordConfirmation: string = "";

  /**
   * A boolean used to tell us if the password are different, this will be used to make the verifications necessary. It is booted as false.
   */
  differentPasswords: boolean = false;

  /**
   * A verification stat that will be usefull to verify if there is an error about the register. Booted as false.
   */
  errorRegister: boolean = false;

  /**
   * Register image.
   */
  registerImage: string = "assets/images/avatarmasculine.png"

  /**
   * Construct's an instance of {@link RegisterComponent}.
   * 
   * @param router Router used to navigate to other pages.
   * @param authService Service that allows the register to happen.
   */
  constructor(private router: Router, private authService: AuthService) { }

  /**
   * Resizes the main div of the component
   */
  ngOnInit(): void {
    UtilitiesComponent.autoResizeDiv("maindiv")
  }

  /**
   * Checks if the password fields are filled in by the same and if all the fields are filled.
   * Sends a createUser request to the backend.
   */
  register(): void {

    if (this.passwordConfirmation != this.userRegisterInfo.password) {
      this.differentPasswords = true;
    }
    else
      if (this.userRegisterInfo.password == this.passwordConfirmation && this.userRegisterInfo.email != "" && this.userRegisterInfo.name != "" && this.userRegisterInfo.userName != "" && this.userRegisterInfo.password != "") {
        let register = new CreateUserVM(this.userRegisterInfo.userName, this.userRegisterInfo.email, this.userRegisterInfo.name, new Date(this.userRegisterInfo.birthDate), this.userRegisterInfo.password)

        this.authService.register(register).subscribe(
          (response) => {
            this.router.navigate(['']);
          },
          (error) => {
            this.errorRegister = true;
          }
        )
      }
  }
}

