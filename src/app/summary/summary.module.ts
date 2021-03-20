import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';


import { SummaryRoutingModule } from './summary-routing.module';
import { LayoutComponent } from './layout.component';
import { SummaryComponent } from './summary.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SummaryRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,

    ],
    declarations: [
        LayoutComponent,
        SummaryComponent
    ]
})
export class SummaryModule { }