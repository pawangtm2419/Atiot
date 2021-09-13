import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MustMatch } from '../../_helpers/must-match';
import { AccountService, AlertService } from '@app/_services';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('closeButton') closeButton;
  //   @ViewChild('closeButton1') closeButton;
  public resetPasswordForm: FormGroup
  public loading = false;
  public showModal: boolean;
  public showModal1: boolean;
  public openPage = false;
  public checkSession: any;
  public resetFormsubmitted = false;

  public status: any;
  public tokenData: any;

  public loading1: boolean;
  public checkPasswordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@!#$%^&+=]).{8,}$';
  public resetPasswordData: any;
  resultData: any;
  openResetModel = false;
  url: string;
  urlData: any;
  public loginnm: string;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.checkToken();
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.pattern(this.checkPasswordPattern)]],
      cnPassword: ['', Validators.required]
    },
      {
        validator: [MustMatch('newPassword', 'cnPassword')]
      },
    )
  }
  checkToken() {
    this.url = this.router.url;
    this.urlData = this.url.split('/', 4)
    this.accountService.getEmailIDToken(this.urlData[2], this.urlData[3])
      .subscribe(result => {
        this.resultData = result;
        if (this.resultData.httpCode == 200) {
          this.loginnm = this.resultData.loginName;
          this.openResetModel = true;
        }
        else {
          this.alertService.error('Link is not valid', { keepAfterRouteChange: true });
          this.clearAlert();
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'login';
          window.location.href = returnUrl
        }
      });
  }

  // convenience getter for easy access to form fields
  get f3() { return this.resetPasswordForm.controls; }




  clear() {
    this.resetPasswordForm.controls['newPassword'].setValue('');
    this.resetPasswordForm.controls['cnPassword'].setValue('');
  }
  onresetFormSubmit() {
    this.resetFormsubmitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }
    let params1 = {
      'password': this.resetPasswordForm.value.newPassword,
      'password2': this.resetPasswordForm.value.cnPassword
    }
    let resetData = {
      '_id': this.resultData._id,
      'token': this.resultData.token
    }
    this.accountService.resetPassword(params1, resetData)
      .subscribe((res: any) => {
        this.resetPasswordData = res;
        if (this.resetPasswordData.httpCode == 200) {
          this.alertService.success('Password updated successfully', { keepAfterRouteChange: true });
          this.clearAlert();
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'login';
          window.location.href = returnUrl
        }
        else {
          this.alertService.error('Failed to reset password,Please try again');
        }

      },
        err => {
          this.alertService.error(err);

        }
      );

  }

  clearAlert() {
    setTimeout(() => {
      this.alertService.clear();
    }, 5000);
  }


}
