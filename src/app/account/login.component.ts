import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'login.component.html' ,
styleUrls: ['./login.component.css']})
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    credentials: { loginName: any; password: any; };
    status: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            loginName: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    mouseover(){
        document.getElementById('loginButton').style.backgroundColor = "#454397" ;
        document.getElementById('loginButton').style.padding = "7px 60px";


    }
    mouseout(){
        document.getElementById('loginButton').style.backgroundColor = "#3C84F0" ;
        document.getElementById('loginButton').style.padding = "4px 45px";
    }


    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.credentials = {
            loginName : this.f.loginName.value,
            password : this.f.password.value
        }
        this.accountService.login(this.credentials)
            .pipe(first())
            .subscribe({
                next: () => {
                   // this.createUserLOgs();
                   let type = JSON.parse(localStorage.getItem('user')).role;

                      if(type=='customer')
                      {
                      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard/CustomerDashboard';
                      window.location.href = returnUrl
                     }
                     else
                     {
                        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
                        window.location.href = returnUrl
                    }                
                },
                error: error => {
					//console.log(error);
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
    createUserLOgs(){
        debugger
    let params={
        "loginName":this.f.loginName.value,
        "module":"LOGIN",
        "function":"LOGIN",
        "type":"web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {    
         this.status=data['status'];
         console.log("status",this.status);
      },
        error => {
          this.alertService.error(error);
        })
    }
}
