import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditAccountComponent } from 'src/app/components/user/edit-account/edit-account.component';
import { UserAccountComponent } from 'src/app/components/user/user-account/user-account.component';
import { UserProfileComponent } from 'src/app/components/user/user-profile/user-profile.component';
import { VisitedPlacesComponent } from 'src/app/components/user/visited-places/visited-places.component';
import { InterestedPlacesComponent } from 'src/app/components/user/interested-places/interested-places.component';
import { UserRoutesListComponent } from 'src/app/components/user/user-routes-list/user-routes-list.component';
import { UserUsedRoutesListComponent } from 'src/app/components/user/user-used-routes-list/user-used-routes-list.component';
import { UserFavoriteRoutesListComponent } from 'src/app/components/user/user-favorite-routes-list/user-favorite-routes-list.component';
import { LoggedInGuard } from '../../guards/logged-in.guard';

/**
 * Possible child routes for the '/user' path
 */
const routes: Routes = [
  {
    path: 'account',
    component: UserAccountComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: "routes",
    component: UserRoutesListComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: "routes/used",
    component: UserUsedRoutesListComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: "routes/favorite",
    component: UserFavoriteRoutesListComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'account/edit',
    component: EditAccountComponent,
    canActivate: [LoggedInGuard]
  }, {
    path: 'visitedPlaces',
    component: VisitedPlacesComponent,
    canActivate: [LoggedInGuard]
  }, {
    path: 'interestedPlaces',
    component: InterestedPlacesComponent,
    canActivate: [LoggedInGuard]
  }, {
    path: ':username',
    component: UserProfileComponent,
    canActivate: [LoggedInGuard]
  }
];

/**
 * @ignore
 */
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
