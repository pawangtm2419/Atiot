import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';

import { TestingRoutingModule } from '../testing/testing.routing.module';
import { TestmainComponent } from '../testing/testmain/testmain.component';
import { TestComponent } from '../testing/test/test.component';
import { DatePipe } from '@angular/common';
import { ExcelService, ExcelServiceXlsx } from '../_services/excel.service';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TestingRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule

    ],
    declarations: [
        TestmainComponent,
        TestComponent
      
    ],
    providers: [DatePipe,ExcelService,ExcelServiceXlsx]
})
export class TestingModule { }