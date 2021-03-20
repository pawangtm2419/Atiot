import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

import { NewTrackVehicleRoutingModule } from './new-track-vehicle-routing.module';
import { dateFilter } from './dateFilter/dateFilter.pipe';
import { DatePipe } from '@angular/common';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NewTrackVehicleRoutingModule,
    ReactiveFormsModule,
    // FormsModule,
    // Ng2SearchPipeModule,
    // NgxPaginationModule,
    // AgmCoreModule,
    // dateFilter,

  ],
  providers: [DatePipe]
})
export class NewTrackVehicleModule { }
