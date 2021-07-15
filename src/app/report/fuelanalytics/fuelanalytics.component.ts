import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-fuelanalytics',
  templateUrl: './fuelanalytics.component.html',
  styleUrls: ['./fuelanalytics.component.less']
})
export class FuelanalyticsComponent implements OnInit {
  today: Date;
  fromDate: string;
  toDate: string;
  startDate: string;

  form: FormGroup;
  loading = false;
  isEdit = false;
  endDate: string;
  date = new Date();
  p: number = 1;
  searchText;
  data: any;
  fuelList: any;
  snum: any;
  pinno: any;
  // useType: any;
  // loginName: any;
  parsobj: any;
  parseObjDocs: any;
  coordinatedata: any;
  mapObject: any;
  address: any;
  length: any;
  lastLocationlat: any;
  lastLocationlng: any;
  locationInfo: any;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.getRecord();
  }

  getRecord() {
    // this.useType = JSON.parse(localStorage.getItem('user')).useType;
    // this.loginName = JSON.parse(localStorage.getItem('user')).loginName;
    // this.loginName = this.loginName.toUpperCase( );
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 30);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd') + "T00:00:00.000Z";
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z";
    this.startDate = this.fromDate.toString();
    this.endDate = this.toDate.toString();

    this.data = {
      fromDate: this.startDate,
      toDate: this.endDate,
    }

    this.accountService.getfuelAnalytics(this.data)
      .subscribe((data) => {
        this.fuelList = data,
          this.fuelList = this.fuelList


        // this.coordinatedata.forEach(element => {
        //   if(element.pinno == pinno){
        //     this.lastLocationlat=element.lat,
        //     this.lastLocationlng=element.lng
        //    // 
        // }
        // });
        console.log("Fuel List ====", this.fuelList)
      })
  }

  onSubmit2() {
    if (this.form.invalid) {
      return;
    }
    else {
      // this.useType = JSON.parse(localStorage.getItem('user')).useType;
      // this.loginName = JSON.parse(localStorage.getItem('user')).loginName;
      // this.loginName = this.loginName.toUpperCase( );
      this.data = {
        fromDate: this.form.value.startDate,
        toDate: this.form.value.endDate,
        // loginName:this.loginName,
        // useType:this.useType,
      }

      console.log('data for date feild==', this.data);

      this.accountService.getfuelAnalytics(this.data)
        .subscribe((data) => {
          this.fuelList = data,
            this.fuelList = this.fuelList,
            console.log("fuel List after Date filter====", this.fuelList);
        })
    }
  }

  vehicleLastLocation(pinno,var2) {
    debugger
    // this.today = new Date();
    // this.today.setDate(this.today.getDate() - 30);
    // this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd') + "T00:00:00.000Z";
    // this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z";
    // this.startDate = this.fromDate.toString();
    // this.endDate = this.toDate.toString();

    // this.data = {
    //   fromDate: this.startDate,
    //   toDate: this.endDate,
    // }
    // this.accountService.getfuelAnalytics(this.data)
    //   .subscribe((data) => {
    //     this.fuelList = data
    //       this.fuelList = this.fuelList
    if(var2==true)
    {
      this.fuelList.forEach(element => {
        if (element.pinno == pinno) {
          this.lastLocationlat = element.lat,
            this.lastLocationlng = element.lng
        }
      });
      this.getOpenStreetmapData();

    }
        
         
       //   });


        // this.lastLocationlat = this.coordinatedata[0].lat;
        // this.lastLocationlng = this.coordinatedata[0].lng; 
             
      
   
  }


  getOpenStreetmapData() {
    debugger
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


}
