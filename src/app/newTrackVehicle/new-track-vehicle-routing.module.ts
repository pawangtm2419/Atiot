import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewTrackVehicleComponent } from './new-track-vehicle.component';

const routes: Routes = [
  { path: '', component: NewTrackVehicleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewTrackVehicleRoutingModule { }
