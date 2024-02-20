import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilitiesComponent } from '../utilities/utilities.component';
import { LoginVM } from '../../viewModels/requests/LoginVM'

/**
 * This components allows the user to log in into the web application.
 * <br>
 * A form is displayed containing an email and password input. Completing this form allows the user to login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * Specifies if after the login the user must be redirected to the home page.
   * This variable is usefull when other components want to use the {@link LoginComponent}.
   */
  @Input()
  noRedirect: boolean = false

  /**
   * Input variable that is used to determine if the component as a with equal to 100%.
   * If the value is false the width can be managed by the parent component more easily
   */
  @Input()
  maxWidth: boolean = false

  /**
   * User email.
   */
  email: string = "";

  /**
   * User password.
   */
  password: string = "";

  /**
   * This property indicates if there was any error while loggind in.
   */
  errorLogin: boolean = false;
  
  /**
   * The image to display in the login page.
   */
  loginImage: string = "assets/images/avatarmasculine.png"

  /**
   * Constructs an instance of {@link LoginComponent}
   * 
   * @param router Router used to navigate to other pages.
   * @param authService Service that allows the login to happen.
   */
  constructor(private router: Router, private authService: AuthService) { }

  /**
   * Resizes the main div of the component
   */
  ngOnInit(): void {
    if (!this.noRedirect)
      UtilitiesComponent.autoResizeDiv("mainDiv")
  }

  /**
   * Sends a login request to the backend.
   * The login information will be stored in the localStorage
   */
  login(): void {
    if (this.email != "" && this.password != "") {
      let login = new LoginVM(this.email, this.password)

      this.authService.login(login).subscribe(
        (response) => {
          if (response && response.token) {
            let token = response.token
            let username = response.username

            if (token) {
              localStorage.setItem("token", token);
            }
            if (username) {
              localStorage.setItem("username", username)
            }
            this.router.navigate(['']);
          }
        },
        (err) => {
          this.errorLogin = true;
        },
        () => {
          this.authService.updateLoggedInStatus()
        }
      )
    } else {
      this.errorLogin = true;
    }
  }
}
