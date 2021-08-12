import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
    @ViewChild('closeButton') closeButton;
    form: FormGroup;
    form1: FormGroup;
    loading = false;
    showModal: boolean;
    showModal1: boolean;
    submitted = false;
    emailsubmitted = false;
    credentials: { loginName: any; password: any; };
    status: any;
    tokenData: any;
    emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    loading1: boolean;
    emailTokenData: any;
    url: any;

    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService, private alertService: AlertService) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            loginName: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.form1 = this.formBuilder.group({
            emailID: ['', [Validators.required, Validators.pattern(this.emailRegEx)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    get f1() { return this.form1.controls; }

    mouseover(): void {
        document.getElementById('loginButton').style.backgroundColor = '#454397';
        document.getElementById('loginButton').style.padding = '7px 60px';
    }
    mouseout(): void {
        document.getElementById('loginButton').style.backgroundColor = '#3C84F0';
        document.getElementById('loginButton').style.padding = '4px 45px';
    }
    onSubmit(): void {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        this.credentials = {
            loginName: this.f.loginName.value,
            password: this.f.password.value
        };
        this.accountService.login(this.credentials).pipe(first()).subscribe({
            next: () => {
                const type = JSON.parse(localStorage.getItem('user')).role;
                if (type === 'customer') {
                    const returnUrl = this.route.snapshot.queryParams.returnUrl || 'dashboard/CustomerDashboard';
                    window.location.href = returnUrl;
                }
                else {
                    const returnUrl = this.route.snapshot.queryParams.returnUrl || 'dashboard';
                    window.location.href = returnUrl;
                }
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
    }
    clear(): void {
        this.form1.controls.emailID.setValue('');
    }
    onFormSubmit(): void {
        this.emailsubmitted = true;
        this.alertService.clear();
        if (this.form1.invalid) {
            return;
        }
        const params = {
            referanceData: this.f1.emailID.value,
            secretCode: 'AJAX@123Secret'
        };
        this.accountService.forgotPassword(params).subscribe(res => {
            this.tokenData = res;
            if (this.tokenData.httpCode === 200) {
                this.closeButton.nativeElement.click();
                this.alertService.success('If your email id is found in our system,then reset link will be sent on this mail id.');
                this.clearAlert();
            } else {
                this.closeButton.nativeElement.click();
                this.alertService.error('Email Id/UserId not found');
            }
        },
            error => {
                this.alertService.error(error);
            }
        );
    }

    createUserLOgs(): void {
        const params = {
            loginName: this.f.loginName.value,
            module: 'LOGIN',
            function: 'LOGIN',
            type: 'web'
        };
        this.accountService.createUserlogs(params).subscribe((data) => {
            this.status = data;
        },
        error => {
            this.alertService.error(error);
        });
    }
    clearAlert(): void {
        setTimeout(() => {
          this.alertService.clear();
        }, 5000);
    }
}


