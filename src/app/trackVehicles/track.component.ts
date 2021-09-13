import { Component, Directive, Input, OnInit } from '@angular/core';
import { first, retry } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { AccountService, AlertService } from '@app/_services';
import { stringify } from '@angular/compiler/src/util';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { environment } from '@environments/environment';

import { GoogleMapsAPIWrapper } from '@agm/core';

declare const google: any

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {



  today = new Date();
  track = null;
  p: number = 1;
  searchText;
  timeBetween: any;
  isChecked;
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
  pinNo=environment.labelpinno;
  devicedata=[];
  isNClick = true;
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
  public pinnumber:any;
  viewType: any = 'hybrid';
  selectedRow: Number;
  setClickedRow: Function;
  endMark = "./../../assets/img/images-removebg-preview.svg";
  mappathIcon = "./../../assets/img/map-marker-hi.svg";
  startMarker = "./../../assets/img/startMarker.svg";
  markerPath;
  start_end_mark = []; 
  start_marker: any
  end_marker: any;
  enhr: any;
  tdist: any;
  batchFilter: any;
  engineData: any;
  engineDatadocs: any;
  EngineOnData: any;
  EngineOnDatadocs: any;
 public EngineData:any;
  oilpressure:any;
  fuelLevel:any;
  fuelLiters:any;
  coolantTemp:any;
  batteryLevel:any;
  clusterData: any;
  rpm:any;
  hydralicOilFilterChoke:any;
  parkingSwitch:any;
  devicePublishTime:any;
  checkModel = false
  dateDiff: any;
  status: any;
  address: any;
  locationInfo: any;
  lat: any;
  lng: any;
  lastlocationlength: number;
  // pathmapClick: any;
  // meterClick: any;
  clickType: any;
  parseObjDocs: any;
  params: { loginName: any; module: string; function: string; type: string; };
  days: number;
  alertData: { gte: string; lt: string; pinno: any; };
 


  constructor(private accountService: AccountService, private formBuilder: FormBuilder, private datePipe: DatePipe, private alertService: AlertService, private router: Router) 
  {this.setClickedRow = function(index){
    this.selectedRow = index;

} }

ngOnInit() {
  this.checkAgreement();
 }

 checkAgreement(){
   if(JSON.parse(localStorage.getItem('user')).role =='customer' || JSON.parse(localStorage.getItem('user')).role == 'dealer')
   {
     if(JSON.parse(localStorage.getItem('user')).agreementSignedOn == null)
     {
       this.accountService.logout();
     } else {
 this.helperFunction();
     }
   }
   else
   {
     this.helperFunction();
   }
 }

 helperFunction(){
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
    this.today.setDate(this.today.getDate() -2);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd') + "T00:00:00.000Z";
   // this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z";
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')  + "T00:00:00.000Z";
    this.startDate = this.fromDate.toString();
    this.endDate = this.toDate.toString();
    this.timeBetween = {
      gte: this.startDate,
      lt: this.endDate,
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getTrack(this.timeBetween).subscribe((track) => {
      this.track = track
      this.trackdocs = this.track.docs
      this.trackdocs = this.trackdocs.sort((b,a) => a.createdAt - b.createdAt)
     // this.trackdocs.lastDataReceivedAt = this.trackdocs.lastDataReceivedAt.slice(0, 2) + "/" + this.trackdocs.lastDataReceivedAt.slice(2,4) + "/" + this.trackdocs.lastDataReceivedAt.slice(4,6);
     this.trackdocs.forEach(element => {
       if(element.vehicleNumber=="")
       {
        element.vehicleNumber==element.pinno;
       }
     });
     this.trackdocs.forEach(element1 => {
      if( element1.type == "dvmapb")
      {
      this.devicedata.push(
        {
         pinno:element1.pinno,
         type:element1.type
        }
      );
      }
    if(element1.type == "bs4")
      {
        this.devicedata.push(
          {
           pinno:element1.pinno,
           type:element1.type
          }
        );
        console.log("devicedata====", this.devicedata);
      }
     });
      console.log(this.timeBetween)
      console.log(this.trackdocs)
      if (this.trackdocs == undefined) {
        this.alertService.error("No Record Found Between " + this.datePipe.transform(this.today, 'yyyy-MM-dd') + " To " + this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
      }
    })
  }

  calculateDiff(dateSent){
    let currentDate =new Date(this.form.value.endDate);
    dateSent = new Date(dateSent);

    this.days=Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
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
      this.trackdocs = this.trackdocs.sort((b,a) => a.createdAt - b.createdAt);
      console.log(this.trackdocs);

      if (this.trackdocs == undefined) {
        this.alertService.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
      }
    })
  }

  mapDate(pinno,f1) {
    this.calculateDiff(this.form.value.startDate); 
    if(this.days<=2)
    {
    this.clickType=f1;
    this.mapObject = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      pinno: pinno
    }
    this.createUserLogs();
    this.accountService.getAllTrackByCompanyID(this.mapObject).subscribe((data) => {
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
        for (var i = 0; i < this.length; i += 1) {
          latlangValue.push({
            lat: parseFloat(this.coordinatedata[i].lat),
            lng: parseFloat(this.coordinatedata[i].lng),
            time: this.coordinatedata[i].devicePublishTime,
            pinno: this.coordinatedata[i].pinno,
            deviceModel: this.coordinatedata[i].deviceModel,
            engineStatus: this.coordinatedata[i].engineStatus,
            rangedistance: this.coordinatedata[i].rangedistance,
            travelspeed:this.coordinatedata[i].extras[0].travelSpeed,
          })
        }

        // var result = _.uniqWith(latlangValue, (a, b) => _.isEqual(a.lat, b.lng));
        this.maplat = latlangValue[0].lat;
        this.maplng = latlangValue[0].lng;
        console.log(latlangValue)
        this.coordinatedata = _.uniqWith(latlangValue, _.isEqual);;
        this.start_marker = [
          this.coordinatedata[0]
        ];
        this.end_marker = [latlangValue[latlangValue.length - 1]];

        console.log(this.start_marker)
        console.log(this.end_marker)

      }
    })
  }
  else
  {
    this.alertService.error("Date range should not exceed 3 days.Please select valid date");
    this.clearAlert();
  }
  }

 alldevicesRecords(event: any) {
        if (event) {
          this.mapObject = {
            gte: this.form.value.startDate + "T00:00:00.000Z",
            lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
            pinno: this.pinnumber
          }
          this.accountService.getAllTrackByCompanyID(this.mapObject).subscribe((data) => {
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
              for (var i = 0; i < this.length; i += 1) {
                latlangValue.push({
                  lat: parseFloat(this.coordinatedata[i].lat),
                  lng: parseFloat(this.coordinatedata[i].lng),
                  time: this.coordinatedata[i].devicePublishTime,
                  pinno: this.coordinatedata[i].pinno,
                  deviceModel : this.coordinatedata[i].deviceModel,
                  engineStatus : this.coordinatedata[i].engineStatus,
		  rangedistance : this.coordinatedata[i].rangedistance,
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
        else {
          // this.inActive = false;
          // this.getMachineData();
        }
      }
      trackVehicleLastLocation(pinno,var2) {
        this.parsobj = [];
        this.parseObjDocs=[];
        this.coordinatedata=[];
        this.mapObject = {
          gte: this.form.value.startDate + "T00:00:00.000Z",
          lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
          useType: JSON.parse(localStorage.getItem('user')).useType,
          loginName: JSON.parse(localStorage.getItem('user')).loginName
        }
        this.accountService.getTrack(this.mapObject).subscribe((data) => {
          this.parsobj = data
          this.parseObjDocs=this.parsobj.docs;
          if (this.parsobj.status == 'Device has empty data') {
            this.alertService.error(this.parsobj.status);
            this.address = '';
          }
          else {
            this.length = this.parseObjDocs.length
            this.parseObjDocs = _.sortBy(this.parseObjDocs, (o) => moment["default"](o.createdDate)).reverse();
    
            if (var2) {
              const buttonModal = document.getElementById("vehicleLastLocationModalopen")
              buttonModal.click()
            }
    
    
            var latlangValue = [];
            for (var i = 0; i < this.length; i++) {
             
              latlangValue.push({
                pinno: this.parseObjDocs[i].pinno,
                deviceModel: this.parseObjDocs[i].deviceModel,
                time: this.parseObjDocs[i].lastDataReceivedAt,
                lat: parseFloat(this.parseObjDocs[i].lat),
                lng: parseFloat(this.parseObjDocs[i].lng),
              })
            
            }
    
    
            this.coordinatedata = latlangValue
            this.coordinatedata.forEach(element => {
              if(element.pinno == pinno){
                this.lastLocationlat=element.lat,
                this.lastLocationlng=element.lng
               // 
            }
            });
            this.getOpenStreetmapData();
            // this.lastLocationlat = this.coordinatedata[0].lat;
            // this.lastLocationlng = this.coordinatedata[0].lng;        
          }
        })
      }
      getOpenStreetmapData() {   
       // this.mapData
        this.locationInfo = [];
        const lat = this.lastLocationlat;
        const lon = this.lastLocationlng;
        const appURL = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + lat + "&lon=" + lon;
        //const appURL = "https://nominatim.openstreetmap.org/reverse?format=geojson&lat="+lat+"&lon="+lon;
        this.accountService.getLocationInfo(appURL).subscribe((res) => {
          this.locationInfo = res;
          this.address = this.locationInfo.display_name;
        });
      }
      
      onNavigate(pinno,f3) {
        this.calculateDiff(this.form.value.startDate); 
        if(this.days<=9)
        {
        this.clickType=f3;
        this.timeBetween = {
          gte: this.form.value.startDate + "T00:00:00.000Z",
          lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z"
          //lt: this.form.value.endDate  + "T00:00:00.000Z"
        }
        this.createUserLogs();
        sessionStorage.setItem('dateTimeRange', JSON.stringify(this.timeBetween));
        this.router.navigateByUrl(`/details/${pinno}`);
        sessionStorage.setItem('deviceData', JSON.stringify(this.devicedata));
      }
      else
      {
        this.alertService.error("Date range should not exceed 10 days.Please select valid date");
        this.clearAlert();
      }
      }
      createUserLogs() {
    if(this.clickType == 'isPinNo')
    {
      this.params = {
        "loginName": JSON.parse(localStorage.getItem('user')).loginName,
        "module": "TRACK VEHICLES",
        "function": "MACHINE No. CLICK",
        "type": "web"
      }
    }
    else if(this.clickType == 'isMapPath'){
      this.params = {
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"TRACK VEHICLES",
        "function":"MAP PATH CLICK",
        "type":"web"
      }
    }
    else if(this.clickType == 'isMeter'){
      this.params = {
      "loginName":JSON.parse(localStorage.getItem('user')).loginName,
      "module":"TRACK VEHICLES",
      "function":"GAUGE METER CLICK",
      "type":"web"
      }
    }
       
        this.accountService.createUserlogs(this.params).subscribe((data) => {
          this.status = data['status'];
          console.log("status", this.status);
        },
          error => {
            this.alertService.error(error);
          })
      }



  onSummary(pinno) {
    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z"
    }
    sessionStorage.setItem('dateTimeRange', JSON.stringify(this.timeBetween));
    this.router.navigateByUrl(`/track-details/${pinno}`);
  }

  onAlert(pinno) {
    this.alertData = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      pinno: pinno,
    }

    sessionStorage.setItem('alertData', JSON.stringify(this.alertData));
    this.router.navigateByUrl(`/analytics/alert`);
    console.log("alert data ===", this.alertData);
  }

  ConvertToInt(val){
    return parseInt(val);
  }
  meter(enhr, tdist, vnum, pinno, model,f2) {
    this.clickType=f2;
    this.enhr = enhr
    this.tdist = tdist
    this.pinnumber = pinno;
    this.batchFilter = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      pinno: this.pinnumber
    }
    this.createUserLogs();
    if (model === "ARGO4000" || model === "ARGO2000") {
      this.checkModel = true
    }
    else if (model === "ARGO4500" || model === "ARGO2500") {
      this.checkModel = false

    }
    this.accountService.getEngineOn(this.batchFilter).subscribe((data) => {
      this.EngineOnData = data;
      this.EngineOnDatadocs = this.EngineOnData.docs;
      if (this.EngineOnDatadocs) {
        this.EngineData = this.EngineOnDatadocs[0].extras[0];
        this.oilpressure = this.EngineData.oilpressure;
        this.fuelLevel = this.EngineData.fuelLevel;
        this.coolantTemp = this.EngineData.coolantTemp;
        this.fuelLiters = this.EngineData.fuelInLitres;
        this.batteryLevel = parseFloat(this.EngineData.batteryLevel);
        this.rpm = parseInt(this.EngineData.rpm);
        this.hydralicOilFilterChoke = this.EngineData.hydralicOilFilterChoke;
        this.parkingSwitch = this.EngineData.parkingSwitch;
        this.devicePublishTime = this.EngineOnDatadocs[0].devicePublishTime;


      }
      else {
        this.enhr = enhr
        this.tdist = tdist
      }
    })
  }


gaugeLeft(value) {
  let percentage = 100 - value;
  percentage = (percentage > 90) ? 90 : (percentage < 0) ? 0 : percentage;
  return 'rotate(' + ((0.85 * percentage) + 50) + 'deg)';
}

gaugeMiddle(value) {
  let percentage = (value) * 10;
  percentage = (percentage > 50) ? (percentage - 1) : percentage;
  return 'rotate(' + (percentage - 49) + 'deg)';
}

gaugeRight(value) {
  let percentage = value;
  percentage = (percentage > 120) ? 120 : (percentage < 40) ? 40 : percentage;
  return 'rotate(' + (percentage - 170) + 'deg)';
}

clearAlert() {
  setTimeout(() => {
    this.alertService.clear();
  }, 2000);
}
}
