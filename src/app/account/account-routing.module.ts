import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { HomeComponent } from '../home'
import { RegisterComponent } from './register.component';

const routes: Routes = [
    
      { path: '', component: LoginComponent},
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'dashboard', component: HomeComponent }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }