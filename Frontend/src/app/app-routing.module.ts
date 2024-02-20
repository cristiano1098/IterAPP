import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { RouteModule } from './modules/route/route.module';
import { UserModule } from './modules/user/user.module';
import { InDevelopmentComponent } from './components/in-development/in-development.component';
import { PlaceModule } from './modules/place/place.module';
import { HomePageComponent } from './components/home-page/home-page/home-page.component';

/**
 * The possible routes for the web application
 */
const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'createAccount',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'route',
    loadChildren: () => RouteModule
  },
  {
    path: 'place',
    loadChildren: () => PlaceModule
  },
  {
    path: 'user',
    loadChildren: () => UserModule
  },
  {
    path: '**',
    component: InDevelopmentComponent
  }
];

/**
 * @ignore
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
