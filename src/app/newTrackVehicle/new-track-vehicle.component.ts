import { Component, Directive, Input, OnInit } from '@angular/core';
import { first, retry } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { AccountService, AlertService } from '@app/_services';
import { stringify } from '@angular/compiler/src/util';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';

import { GoogleMapsAPIWrapper } from '@agm/core';

declare const google: any

@Component({
  selector: 'app-track',
  templateUrl: './new-track-vehicle.component.html',
  styleUrls: ['./new-track-vehicle.component.less']
})
export class  NewTrackVehicleComponent implements OnInit {



  today = new Date();
  track = null;
  p: number = 1;
  searchText;
  timeBetween: any;

  v1: any;
  v2: any;
  startDate: any;
  endDate: any;
  trackdocs: any;
  form: FormGroup;
  isAddMode: boolean;
  submitted: boolean;
  sliderValue: any = 0;
  fromDate: string;
  toDate: string;
  zoom: number = 4;
  date = new Date();

  mapObject: any;
  parsobj: any;
  coordinatedata: any;
  opacity: number = 1;
  lastLocation: any;
  lastLocationlat: { lat: any; lng: any; };
  lastLocationlng: any;
  filterpath: any;
  path: any;
  messages: any;
  length: any;
  maplat: any;
  maplng: any;
  selectedRow : Number;
  setClickedRow : Function;
  imageStartMark = "./../../assets/img/images-removebg-preview.png";
  mappathIcon = "./../../assets/img/map-marker-hi.png";
  startMarker = "./../../assets/img/startMarker.png";
  markerPath = "./../../assets/img/markerPath.png";
  start_end_mark = []; 
  start_marker: any
  end_marker: any;


  constructor(private accountService: AccountService, private formBuilder: FormBuilder, private datePipe: DatePipe, private alertService: AlertService, private router: Router) 
  {this.setClickedRow = function(index){
    this.selectedRow = index;

} }

  ngOnInit() {
    this.testGetAddress();
    this.getRecord();
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

  }
  get f() { return this.form.controls; }


  testGetAddress(){
    console.log("Address")
    this.accountService.getLocationFromlatlang().subscribe((data)=>{
      console.log("Address")
      console.log(data)
    })
  }



  getRecord() {
    this.today = new Date();
    this.today.setDate(this.today.getDate() -1);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd') + "T00:00:00.000Z";
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z";
    this.startDate = this.fromDate.toString(),
      this.endDate = this.toDate.toString()

    this.timeBetween = {
      gte: this.startDate,
      lt: this.endDate,
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getTrack(this.timeBetween).subscribe((track) => {
      this.track = track
      this.trackdocs = this.track.docs
      this.trackdocs = _.sortBy(this.trackdocs, (o) => moment["default"](o.createdAt)).reverse();
      console.log(this.timeBetween)
      if (this.trackdocs == undefined) {
        this.alertService.error("No Record Found Between " + this.datePipe.transform(this.today, 'yyyy-MM-dd') + " To " + this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
      }
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
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getTrack(this.timeBetween).subscribe((track) => {
      this.track = track
      this.trackdocs = this.track.docs
      console.log(this.timeBetween)
      // console.log(this.trackdocs.createdAt);
      this.trackdocs = _.sortBy(this.trackdocs, (o) => moment["default"](o.createdAt)).reverse();
      console.log(this.trackdocs);

      if (this.trackdocs == undefined) {
        this.alertService.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
      }
    })
  }

  mapDate(pinno) {
    this.mapObject = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      pinno: pinno
    }
    this.accountService.getTrackByCompanyID(this.mapObject).subscribe((data) => {
      this.parsobj = data
      if (this.parsobj.status == 'Device has empty data') {
        this.alertService.error(this.parsobj.status);
      } else {
        this.length = this.parsobj.docs.length
        this.coordinatedata = this.parsobj.docs
        this.coordinatedata = _.sortBy(this.parsobj.docs, (o) => moment["default"](o.createdAt)).reverse();
        // console.log(this.coordinatedata);

        const buttonModal = document.getElementById("vehicleLocationModalopen");
        buttonModal.click();
        var latlangValue = [];
        for (var i = 0; i < this.length; i += 4) {
          latlangValue.push({
            lat: parseFloat(this.coordinatedata[i].lat),
            lng: parseFloat(this.coordinatedata[i].lng),
            time: this.coordinatedata[i].devicePublishTime,
          })
        }
        // var result = _.uniqWith(latlangValue, (a, b) => _.isEqual(a.lat, b.lng));
        this.maplat = latlangValue[0].lat;
        this.maplng = latlangValue[0].lng;
        console.log(latlangValue)
        this.coordinatedata = _.uniqWith(latlangValue, _.isEqual);;
        // var a = _.uniqWith(latlangValue, _.isEqual);
        // console.log(this.coordinatedata);

        // var result = _.uniqWith(latlangValue, (a, b) => _.isEqual(a.lat, b.lng));
        // console.log(JSON.parse(JSON.stringify({...result}).replace(/},/g, '},\n ')))


        this.start_marker = [
          this.coordinatedata[0]
        ];
        this.end_marker = [latlangValue[latlangValue.length - 1]];

        console.log(this.start_marker)
        console.log(this.end_marker)

      }
    })
  }


  trackVehicleLastLocation(pinno) {
    this.mapObject = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      pinno: pinno
    }
    this.accountService.getTrackByCompanyID(this.mapObject).subscribe((data) => {
      this.parsobj = data

      if (this.parsobj.status == 'Device has empty data') {
        this.alertService.error(this.parsobj.status);
      } else {
        this.length = this.parsobj.docs.length
        this.parsobj = _.sortBy(this.parsobj.docs, (o) => moment["default"](o.createdAt)).reverse();
        const buttonModal = document.getElementById("vehicleLastLocationModalopen")
        buttonModal.click()
        var latlangValue = [];
        for (var i = 0; i < this.length - 1; i++) {
          latlangValue.push({
            lat: parseFloat(this.parsobj[i].lat),
            lng: parseFloat(this.parsobj[i].lng)
          })
        }
        this.coordinatedata = latlangValue
        this.lastLocationlat = this.coordinatedata[0].lat;
        this.lastLocationlng = this.coordinatedata[0].lng
      }
    })
  }
  onNavigate(pinno) {
    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z"
    }
    sessionStorage.setItem('dateTimeRange', JSON.stringify(this.timeBetween));
    this.router.navigateByUrl(`/details/${pinno}`);
  }
}