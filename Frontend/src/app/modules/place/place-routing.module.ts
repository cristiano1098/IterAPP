import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPlaceComponent } from 'src/app/components/view-place/view-place.component';

const routes: Routes = [
  {
    path: ":id",
    component: ViewPlaceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaceRoutingModule { }
