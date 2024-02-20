import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRouteComponent } from 'src/app/components/route/create-route/create-route.component';
import { GenerateRouteComponent } from 'src/app/components/route/generate-route/generate-route.component';
import { RouteDetailsComponent } from 'src/app/components/route/route-details/route-details.component';
import { UseRouteComponent } from 'src/app/components/route/use-route/use-route.component';

/**
 * Possible child routes for the '/route' path
 */
const routes: Routes = [
  {
    path: 'create',
    component: CreateRouteComponent
  },
  {
    path: 'generate',
    component: GenerateRouteComponent
  },
  {
    path: 'use',
    component: UseRouteComponent
  },
  {
    path: 'use/:routeID',
    component: UseRouteComponent
  },
  {
    path: ':routeID',
    component: RouteDetailsComponent
  }
];

/**
 * @ignore
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
