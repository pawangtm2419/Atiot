import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AccountService,AlertService  } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '.././_helpers/must-match';
import { MustNotMatch } from '.././_helpers/must-not-match';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  returnData: any;
  form: FormGroup;
  showModal: boolean;
  loading = true;
  submitted = false;
  showManual=true;
  loginName = JSON.parse(localStorage.getItem('user')).loginName;
checkPasswordPattern='^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@!#$%^&+=]).{8,}$';

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    ) { 
    ;
  }




  ngOnInit(): void {
    if(JSON.parse(localStorage.getItem('user')).useType == 'ADMIN')
    {
      this.showManual=false;
    }
    this.form = this.formBuilder.group({
      loginName: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(this.checkPasswordPattern)]],
      cnPassword: ['', Validators.required]
    },
     { 
      validator: [MustMatch('newPassword', 'cnPassword'),MustNotMatch('oldPassword','newPassword')]
    },
    )
  }

  logout() {
    this.accountService.logout();
}

get f() { return this.form.controls; }
clear(){
  //this.form.reset();
 // this.form.controls['loginName'].setValue(this.loginName);
 this.form.controls['newPassword'].setValue('');
  this.form.controls['cnPassword'].setValue('');
 
}
onSubmit(){
  this.submitted = true;
 
  if(this.form.invalid)
  {
    return;
    
  }
  this.loading=false;
  this.accountService.changePassword(this.form.value).subscribe(data => {
    this.returnData = data
    this.closeButton.nativeElement.click();


    if(this.returnData.message == "Password updated successfully"){
      this.alertService.success(this.returnData.message);
      // var closeAlert = document.getElementsByClassName("close").close()
      

    }else{
      this.alertService.error(this.returnData.message)
      
    }

  })

}

}

