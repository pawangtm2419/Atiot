import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { DealerComponent } from './dealer/dealer.component';


const routes: Routes = [
   
            { path: 'userlist', component: UsersComponent },
            { path: 'dealer', component: DealerComponent },
            
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }