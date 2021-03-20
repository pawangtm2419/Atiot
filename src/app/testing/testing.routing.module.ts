import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestmainComponent } from './testmain/testmain.component';
import { TestComponent } from './test/test.component';


const routes: Routes = [

    { path: 'main', component: TestmainComponent },
    { path: 'test', component: TestComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestingRoutingModule { }