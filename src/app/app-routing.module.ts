import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
//import { LocationComponent } from './location/location.component';
import { AuthGuard } from './_helpers';
import { NewTrackVehicleComponent } from './newTrackVehicle/new-track-vehicle.component';
import { TrackComponent } from './trackVehicles/track.component';
// import { TrackComponent } from './track/track/track.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const machineModule = () => import('./masters/machine/machine.module').then(x => x.MachineModule);
const deviceModule = () => import('./masters/device/device.module').then(x => x.DeviceModule);
const modelModule = () => import('./masters/model/model.module').then(x => x.ModelModule);
const variantModule = () => import('./masters/variant/variant.module').then(x => x.VariantModule);
const customerModule = () => import('./masters/customer/customer.module').then(x => x.CustomerModule);
const locationModule = () => import('./masters/location/location.module').then(x => x.LocationModule);
// const trackModule = () => import('./trackVehicles/track.module').then(x => x.TrackModule);
const geofencingModule = () => import('./masters/geofencing/geofencing.module').then(x => x.GeofencingModule);
const detailsModule = () => import('./details/details.module').then(x => x.DetailsModule);
const summaryModule = () => import('./summary/summary.module').then(x => x.SummaryModule);
const serviceModule = () => import('./service/service.module').then(x => x.ServiceModule);
const userModule = () => import('./user-management/user.module').then(x => x.UserModule);
const shipmentModule = () => import('./masters/shipment/shipment.module').then(x => x.ShipmentModule);
const reportModule = () => import('./report/report.module').then(x => x.ReportModule);
const notificationModule = () => import('./notifications/notifications.module').then(x => x.NotificationsModule);
const testingModule = () => import('./testing/testing.module').then(x => x.TestingModule);
const newtrackVehicle = () => import('./newTrackVehicle/new-track-vehicle.module').then(x => x.NewTrackVehicleModule);

const routes: Routes = [
    { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
  //  { path: 'location', component: LocationComponent, canActivate: [AuthGuard] },
    { path: 'masters/model', loadChildren: modelModule, canActivate: [AuthGuard] },
    { path: 'masters/machine', loadChildren: machineModule, canActivate: [AuthGuard] },
    { path: 'masters/device', loadChildren: deviceModule, canActivate: [AuthGuard] },
   
    { path: 'masters/variant', loadChildren: variantModule, canActivate: [AuthGuard] },
    { path: 'masters/customer', loadChildren: customerModule, canActivate: [AuthGuard] },
    { path: 'masters/location', loadChildren: locationModule, canActivate: [AuthGuard] },
    { path: 'track', component: TrackComponent, canActivate: [AuthGuard]},
    { path: 'newtrack', component: NewTrackVehicleComponent, canActivate: [AuthGuard]},
    
    { path: 'details/:id', loadChildren: detailsModule, canActivate: [AuthGuard] },
    { path: 'summary', loadChildren: summaryModule, canActivate: [AuthGuard] },
    { path: 'service', loadChildren: serviceModule, canActivate: [AuthGuard] },
    { path: 'user', loadChildren: userModule, canActivate: [AuthGuard] },
    { path: 'masters/shipment', loadChildren: shipmentModule, canActivate: [AuthGuard] },
    { path : 'masters/geofencing',loadChildren : geofencingModule, canActivate: [AuthGuard]},

    { path: 'report', loadChildren: reportModule, canActivate: [AuthGuard] },
    { path: 'notifications', loadChildren: notificationModule, canActivate: [AuthGuard] },
    { path: 'testing', loadChildren: testingModule, canActivate: [AuthGuard] },
    // { path: 't', component: TrackComponent },
    
    { path: '', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
