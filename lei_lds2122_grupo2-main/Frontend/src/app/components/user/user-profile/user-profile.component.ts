import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { PlaceView } from 'src/app/models/Place';
import { RouteView } from 'src/app/models/Route';
import { PlaceService } from 'src/app/services/place.service';
import { UserService } from 'src/app/services/user.service';
import { FollowVM } from 'src/app/viewModels/responses/FollowVM';
import { RouteResumeType } from 'src/app/viewModels/Types/RouteResumeType';
import { UserProfileVM } from '../../../viewModels/responses/UserProfileVM';
import { RouteListComponent } from '../../route/route-list/route-list.component';

/**
 * This component allows an authenticated user to view a user profile.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, AfterViewInit {

  /**
   * Path to default image file
   */
  registerImage: string = "assets/images/avatarmasculine.png"

  /**
   *  View Model that represent a profile
   */
  profile: UserProfileVM = new UserProfileVM("", "", false, "", "", undefined, 0, 0)

  /**
   * @ignore
   */
  ownProfile = false;

  @ViewChild(RouteListComponent) routeList?: RouteListComponent

  /**
   * Number of public routes
   */
  totalRoutes = 0;

  /**
  * [Routes]{@link RouteView} to be displayed in the page.
  */
  routes: Array<RouteView> = []

  followingModal?: Modal
  followersModal?: Modal
  requestsToFollowModal?: Modal

  followers?: FollowVM
  following?: FollowVM
  requestsToFollow?: FollowVM



  /**
   * @ignore
   */
  constructor(private userService: UserService, private placeService: PlaceService, private route: ActivatedRoute, private router: Router,) { }

  /**
   * Displays the profile data that is requested from the backend using the [user service]{@link UserService#getProfile}
   */
  ngOnInit(): void {
    var userNameTemp = this.route.snapshot.params['username']
    this.userService.getProfile(userNameTemp).subscribe((data: UserProfileVM) => {
      this.profile = data

      if (localStorage.getItem("username") === this.profile.userName) {
        this.ownProfile = true;
      }

      if (data.publicRoutes != undefined) {
        this.loadRoutes(data.publicRoutes)
        this.totalRoutes = data.publicRoutes.length
      }

      if (this.ownProfile) {

      }

    },
      (error) => {
        this.router.navigate(['']);
      })
  }

  ngAfterViewInit(): void {
    this.followersModal = new Modal(document.getElementById("followersModal") as HTMLElement)
    this.followingModal = new Modal(document.getElementById("followingModal") as HTMLElement)
    this.requestsToFollowModal = new Modal(document.getElementById("requestsToFollowModal") as HTMLElement)
  }

  /**
   * Request to follow an user
   * @param username User to follow
   */
  follow(username: string): void {
    if (this.profile.privateProfile) this.profile.followState = 0
    else {
      this.profile.followState = 1
      if (this.profile.numberFollowers != undefined) this.profile.numberFollowers++
    }
    this.userService.follow(username).subscribe()
  }

  /**
   * Request to unfollow an user
   * @param username User to unfollow
   */
  unfollow(username: string): void {

    this.profile.followState = -1;
    if (this.profile.numberFollowers != undefined) this.profile.numberFollowers--
    this.userService.unfollow(username).subscribe()
  }



  showFollowers(username: string): void {
    this.userService.getFollowers(username).subscribe(
      (data: FollowVM) => {
        this.followers = data
        this.followersModal?.show()
        console.log(data)
      }
    )

  }


  showFollowing(username: string): void {
    this.userService.getFollowing(username).subscribe(
      (data: FollowVM) => {
        this.following = data
        this.followingModal?.show()
        console.log(data)
      }
    )
  }

  showRequestToFollow(): void {
    this.userService.getRequestsToFollow().subscribe(
      (data: FollowVM) => {
        this.requestsToFollow = data
        this.requestsToFollowModal?.show()
        console.log(data)
      }
    )
  }


  closeFollowing(): void {
    this.followingModal?.hide()

  }


  closeFollowers(): void {
    this.followersModal?.hide()

  }

  closeRequestsToFollow(): void {
    this.requestsToFollowModal?.hide()

  }

  followIndexF(index: number): void {

    if (this.followers != undefined) {
      this.userService.follow(this.followers?.follow[index].userName).subscribe()
      this.followers.follow[index].follow = true
    }
  }

  followIndex(index: number): void {

    if (this.following != undefined) {
      this.userService.follow(this.following?.follow[index].userName).subscribe()
      this.following.follow[index].follow = true
    }
  }

  unfollowIndex(index: number): void {
    if (this.following != undefined) {
      this.userService.unfollow(this.following?.follow[index].userName).subscribe()
      this.following.follow[index].follow = false
      if (this.profile.numberFollowing != undefined) this.profile.numberFollowing--
    }
  }

  rejectIndex(index: number): void {
    if (this.followers != undefined) {
      this.userService.rejectRequest(this.followers?.follow[index].userName).subscribe()
      delete this.followers.follow[index]
      if (this.profile.numberFollowers != undefined) this.profile.numberFollowers--
    }
  }


  acceptRequest(index: number): void {
    if (this.requestsToFollow != undefined) {
      this.userService.acceptRequest(this.requestsToFollow?.follow[index].userName).subscribe()
      delete this.requestsToFollow.follow[index]
      if (this.profile.numberFollowers != undefined) this.profile.numberFollowers++
    }
  }

  rejectRequest(index: number): void {
    if (this.requestsToFollow != undefined) {
      this.userService.rejectRequest(this.requestsToFollow?.follow[index].userName).subscribe()
      delete this.requestsToFollow.follow[index]
    }
  }

  readLocalStorageValue(key: string) {
    return localStorage.getItem(key);
  }
  
  /**
   * Loads the Routes
   */
  loadRoutes(routes: Array<RouteResumeType>): void {

    this.routeList?.setRoutes(routes);
    
  }

}
