import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, AlertService } from '@app/_services';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-machine-utilization',
  templateUrl: './machine-utilization.component.html',
  styleUrls: ['./machine-utilization.component.less']
})
export class MachineUtilizationComponent implements OnInit {
  p: number = 1;
  searchText;
  startDate: any;
  endDate: any;
  form: FormGroup;
  submitted: boolean;
  timeBetween: any;
  date = new Date();
  today = new Date();
  fromDate: string;
  toDate: string;
  mutilizationdata:any;
  mutilizationdatadocs:any;
  status: any;
  useType: any;
  loginName: any;
  constructor(private accountService: AccountService,private datePipe: DatePipe, private formBuilder: FormBuilder, private alertService: AlertService) { }

  ngOnInit() {
    this.createUserLOgs();
    this.getRecord();
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    this.onSubmit();
  }

  createUserLOgs(){
let params={
    "loginName":JSON.parse(localStorage.getItem('user')).loginName,
    "module":"REPORT",
    "function":"MACHINE_UTILIZATION",
    "type":"web"
}
this.accountService.createUserlogs(params).subscribe((data) => {    
     this.status=data['status'];
  },
    error => {
      this.alertService.error(error);
    })
}
  getRecord() {
    this.today = new Date();
    this.today.setDate(this.today.getDate() -15);
    // this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd') + "T00:00:00.000Z";
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
   // this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z";
  //  this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')  + "T00:00:00.000Z";
   this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
   this.startDate = this.fromDate.toString(),
    this.endDate = this.toDate.toString(),
    this.useType = JSON.parse(localStorage.getItem('user')).useType;
    this.loginName = JSON.parse(localStorage.getItem('user')).loginName;
    this.loginName = this.loginName.toUpperCase( );
   // this.onSubmit();
   this.timeBetween = {
    fromDate: this.startDate,
    toDate: this.endDate,
    loginName:this.loginName,
    useType:this.useType,
  }
  this.accountService.getMachineUtilizationData(this.timeBetween).subscribe((result) => {
    this.mutilizationdata = result
    this.mutilizationdatadocs = this.mutilizationdata.deviceData;
    // this.mutilizationdatadocs = _.sortBy(this.mutilizationdatadocs, (o) => moment["default"](o.createdAt)).reverse();

    if (this.mutilizationdatadocs == undefined) {
      this.alertService.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
    }
  })
   
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.useType = JSON.parse(localStorage.getItem('user')).useType;
    this.loginName = JSON.parse(localStorage.getItem('user')).loginName;
    this.loginName = this.loginName.toUpperCase( );

    this.timeBetween = {
      fromDate: this.form.value.startDate,
      toDate: this.form.value.endDate,
      loginName:this.loginName,
      useType:this.useType,
    }
    this.accountService.getMachineUtilizationData(this.timeBetween).subscribe((result) => {
      this.mutilizationdata = result;
      this.mutilizationdatadocs = this.mutilizationdata.deviceData;

      if (this.mutilizationdatadocs == undefined) {
        this.alertService.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
      }
    })
  }
}
