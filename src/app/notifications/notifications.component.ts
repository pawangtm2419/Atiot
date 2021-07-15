import { Component, OnInit } from '@angular/core';
import { first, retry } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { stringify } from '@angular/compiler/src/util';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit {
  today: Date;
  fromDate: string;
  toDate: string;
  startDate: string;
  
  endDate: string;
  timeBetween: { gte: string; lt: string; useType:string, loginName:string; };
  notificationList: any;
  form: FormGroup;
  submitted = false
  notification: any;
  date = new Date();
  p: number = 1;
  searchText;
  useType;
  loginName;
  data:any;
  constructor(private accountService: AccountService, private formBuilder: FormBuilder, 
    private datePipe: DatePipe, private alertService: AlertService, private router: Router, 
    private auth: AuthService) { 
      this.auth.authFunction(window.location.pathname);
    }


  ngOnInit() {

    this.getRecord();
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

  }
  get f() { return this.form.controls; }

  getRecord() {
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 30);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd') + "T00:00:00.000Z";
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z";
    this.startDate = this.fromDate.toString();
    this.endDate = this.toDate.toString();
      this.useType = JSON.parse(localStorage.getItem('user')).useType;
      this.loginName = JSON.parse(localStorage.getItem('user')).loginName;
      this.loginName = this.loginName.toUpperCase( );
    this.data = {
      useType: this.useType,
      loginName:this.loginName,
    }

    this.accountService.getNotificationListAll(this.data).subscribe((notification) => {
      this.notificationList = notification
      this.notification = this.notificationList.docs

      console.log("Notification List2 ====", this.notificationList);


      // this.trackdocs = _.sortBy(this.trackdocs, (o) => moment["default"](o.createdAt)).reverse();
      // if (this.trackdocs == undefined) {
      //   this.alertService.error("No Record Found Between " + this.datePipe.transform(this.today, 'yyyy-MM-dd') + " To " + this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
      // }


    })
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      useType : JSON.parse(localStorage.getItem('user')).useType,
      loginName : JSON.parse(localStorage.getItem('user')).loginName,
    }
    this.accountService.getNotificationList(this.timeBetween).subscribe((notification) => {
      this.notificationList = notification
      this.notification = this.notificationList.docs

      console.log('Notification List ===', this.notificationList);
      // this.track = track
      // this.trackdocs = this.track.docs
      // // console.log(this.trackdocs.createdAt);
      // this.trackdocs = _.sortBy(this.trackdocs, (o) => moment["default"](o.createdAt)).reverse();
      // console.log(this.trackdocs);

      // if (this.trackdocs == undefined) {
      //   this.alertService.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
      // }
    })
  }

}