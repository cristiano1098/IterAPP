import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RegisterComponent } from './components/register/register.component';
import { UtilitiesComponent } from './components/utilities/utilities.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MapComponent } from './components/route/map/map.component';
import { CreateRouteComponent } from './components/route/create-route/create-route.component';
import { AuthService } from './services/auth.service';
import { UseRouteComponent } from './components/route/use-route/use-route.component';
import { InDevelopmentComponent } from './components/in-development/in-development.component';
import { AuthenticatedHomePageComponent } from './components/home-page/authenticated-home-page/authenticated-home-page.component';
import { HomePageComponent } from './components/home-page/home-page/home-page.component';
import { NotAuthenticatedHomePageComponent } from './components/home-page/not-authenticated-home-page/not-authenticated-home-page.component';
import { BearerInterceptor } from './interceptors/bearer.interceptor';
import { ViewPlaceComponent } from './components/view-place/view-place.component';
import { GenerateRouteComponent } from './components/route/generate-route/generate-route.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserAccountComponent } from './components/user/user-account/user-account.component';
import { UserRoutingModule } from './modules/user/user-routing.module';
import { EditAccountComponent } from './components/user/edit-account/edit-account.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { RouteListComponent } from './components/route/route-list/route-list.component';
import { UserRoutesListComponent } from './components/user/user-routes-list/user-routes-list.component';
import { UserOwnRouteComponent } from './components/user/user-own-route/user-own-route.component';
import { VisitedPlacesComponent } from './components/user/visited-places/visited-places.component';
import { RouteDetailsComponent } from './components/route/route-details/route-details.component';
import { RatingComponent } from './components/route/rating/rating.component';
import { CategoriesComponent } from './components/route/categories/categories.component';
import { CommentListComponent } from './components/route/comment-list/comment-list.component';
import { UserUsedRoutesListComponent } from './components/user/user-used-routes-list/user-used-routes-list.component';
import { InterestedPlacesComponent } from './components/user/interested-places/interested-places.component';
import { UserFavoriteRoutesListComponent } from './components/user/user-favorite-routes-list/user-favorite-routes-list.component';


/**
 * @ignore
 */
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    RegisterComponent,
    UtilitiesComponent,
    LoginComponent,
    LogoutComponent,
    MapComponent,
    CreateRouteComponent,
    UseRouteComponent,
    InDevelopmentComponent,
    ViewPlaceComponent,
    UserAccountComponent,
    AuthenticatedHomePageComponent,
    HomePageComponent,
    NotAuthenticatedHomePageComponent,
    UserAccountComponent,
    RouteListComponent,
    EditAccountComponent,
    UserProfileComponent,
    GenerateRouteComponent,
    UserRoutesListComponent,
    UserOwnRouteComponent,
    VisitedPlacesComponent,
    RouteDetailsComponent,
    RatingComponent,
    CategoriesComponent,
    CommentListComponent,
    UserUsedRoutesListComponent,
    InterestedPlacesComponent,
    UserFavoriteRoutesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule,
    UserRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
