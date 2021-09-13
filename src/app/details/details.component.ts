import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';
import { environment } from '@environments/environment';

import * as moment from 'moment';
import * as _ from 'lodash';
import { stringify } from '@angular/compiler/src/util';
import { ExcelService, ExcelServiceXlsx } from '@app/_services/excel.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  p: number = 1;
  address: any;
  lat: any;
  lng: any;
  engineHours: any;
  lastOperatedOn: any;
  serviceDueNumber: any;
  serviceDueType: any;
  serviceDueDate: Date;
  averageHours: any;
  engineHoursTotal: any;
  distanceTravelled: any;
  averageDistance: any;
  alertValues=environment.alertValues;
  updatedOn: Date;
  zoom: number;
  isChecked = false;
  tempvAR: boolean;
  locationInfo: any;
  serviceType: string;
  days: number;
  engineONExcelData = [];
  showOffCANData = true;
  showOnCANData = true;
  refresh(): void {
    window.location.reload();
  }
  model = null;
  searchText;
  checkButtonClick = false;
  date = new Date();
  item1: null;
  form: FormGroup;
  dtform: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;
  math = Math
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  batchData: any;
  batchFilter: any;
  timestampFilter: any;
  dateRange: any;
  batchDatadocs: any;
  summeryReportExtras: any;
  reportData: any;
  reportDatadocs: any;
  consumptionData: any;
  consumptionDatadocs: any;
  batchDataRecent: any;
  summeryReport: any;
  engineData: any;
  engineDatadocs: any;
  pin = this.route.snapshot.params['id'];
  stdate = JSON.parse(sessionStorage.getItem('dateTimeRange')).gte;
  endate = JSON.parse(sessionStorage.getItem('dateTimeRange')).lt;
  EngineOffData: any;
  EngineOffDatadocs: any;
  EngineOnData: any;
  EngineOnDatadocs: any;
  selectedRow: Number;
  setClickedRow: Function;
  locAddress: any;
  alertEngineData: any[] = [];
  pinnum = this.route.snapshot.params['id'];
  summary: any;
  dateDiff: any;
  typeOfDevice = JSON.parse(sessionStorage.getItem('deviceData'));
  showOffColumns = false;
  showOnColumns = false;

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private http: HttpClient,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private ngZone: NgZone
  ) {
    this.setClickedRow = function (index) {

      this.selectedRow = index;

    }

  }

  selected: string = 'Report';

  //event handler for the select element's change event
  select(event: any) {
    //update the ui
    this.selected = event.target.value;
    if (this.selected == "Report") {
      this.getVehicleReport();
    }
    else if (this.selected == "Consumption") {
      this.getVehicleConsumption();
    }
    else if (this.selected == "Batch") {
      this.getVehicleBatch();
    }
    else if(this.selected = "Engine")
    {
      this.getEngineHours();
    }
  }
  selected2: string = 'on';

  //event handler for the select element's change event
  select2(event: any) {
    //update the ui
    this.isChecked = !this.isChecked;
    this.selected2 = event.target.value;
    if (this.selected2 == "on") {
      this.getEngineOn();
    }
    else if (this.selected2 == "off")
    {
      this.getEngineOff();
    }
  }


  ngOnInit() {
    this.dtform = this.formBuilder.group({
      stdate: ['', Validators.required],
      endate: ['', Validators.required],
    });

    this.form = this.formBuilder.group({
      title: ['', Validators.required],
    });
    this.typeOfDevice.forEach(element => {
      if (element.pinno == this.pin) {
        if (element.type == 'dvmapb') {
          this.showOnColumns = true;
          this.showOffColumns = true;
        }
        else if(element.type == 'bs4')
        {
          this.showOnCANData = false;
          this.showOffCANData = false;
        }
      }
    });
    //this.geocodeLatLng();
    // this.batchFilter = {
    //   gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
    //   lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt, // Pinno & chasisno both are same
    //   pinno: this.id = this.route.snapshot.params['id'],
    //   chasisno: this.id = this.route.snapshot.params['id'],
    // }

    this.getVehicleReport();
    this.getEngineOn();
    this.getSummaryData();

  }
  get f() { return this.form.controls; }

  calculateDiff(dateSent) {
    let currentDate = new Date(this.dtform.value.endate);
    dateSent = new Date(dateSent);

    this.days = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }

  // validateDate(){
  //   this.calculateDiff(this.form.value.stdate); 
  //   if(this.days<=9)
  //   {
  //     this.EngineOffData();
  //     this.EngineOnData();
  //     this.getVehicleReport();
  //     this.getSummaryData();
  //     this.getVehicleConsumption();
  //     this.getVehicleBatch();
  //     this.getEngineHours();
  //   }
  //   else
  //   {
  //     this.alertService.error("Please select valid date")
  //   }
  // }
  getEngineOff() {
    if (this.submitted) {
      this.calculateDiff(this.dtform.value.stdate); 
      if(this.days<=9)
      {
      this.batchFilter = {
        gte: this.dtform.value.stdate + "T00:00:00.000Z",
        lt: this.dtform.value.endate + "T00:00:00.000Z",
        pinno: this.id = this.route.snapshot.params['id'],
      }
      this.loading = true;
      this.EngineOffDatadocs = [];
      this.accountService.getEngineOff(this.batchFilter).subscribe((data) => {
        if (data) {
          this.loading = false;
          this.EngineOffData = data

          if (this.EngineOffData.status) {
            this.alertService.error("No engine off data found");
            this.clearAlert();
          }
          else {
            this.EngineOffData = data
            this.EngineOffDatadocs = this.EngineOffData.docs
            this.isChecked = false;
            // this.getalertEngineData();
          }
        }
        else {
          this.loading = false;
          this.alertService.error("No engine off data found");
          this.clearAlert();
        }
      },
        error => {
          this.loading = false;
          this.alertService.error(error);
          this.clearAlert();
        })
    }
    else{
      this.alertService.error("Date range should not exceed 10 days.Please select valid date for engine off data");
      this.clearAlert();
    }
    }
    else {
      this.batchFilter = {
        gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
        lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt,
        pinno: this.id = this.route.snapshot.params['id']
      }
      this.loading = true;
      this.EngineOffDatadocs = [];
      this.accountService.getEngineOff(this.batchFilter).subscribe((data) => {
        if (data) {
          this.loading = false;
          this.EngineOffData = data
          if (this.EngineOffData.status) {
            this.alertService.error("No engine off data found");
            this.clearAlert();
          }
          else {
            this.EngineOffData = data
            this.EngineOffDatadocs = this.EngineOffData.docs
            this.isChecked = false;
            // this.getalertEngineData();
          }
        }
        else {
          this.loading = false;
          this.alertService.error("No engine off data found");
          this.clearAlert();
        }
      },
        error => {
          this.loading = false;
          this.alertService.error(error);
          this.clearAlert();
        })
    }


   
    
  }


  getEngineOn() {
    if (this.submitted) {
      this.calculateDiff(this.dtform.value.stdate); 
      if(this.days<=9)
      {
      this.batchFilter = {
        gte: this.dtform.value.stdate + "T00:00:00.000Z",
        lt: this.dtform.value.endate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
        pinno: this.id = this.route.snapshot.params['id'],
      }
      this.loading = true;
      this.EngineOnDatadocs = [];
      this.accountService.getEngineOn(this.batchFilter).subscribe((data) => {
        if (data) {
          this.loading = false;
          this.EngineOnData = data
          if (this.EngineOnData.status) {
            this.alertService.error("No engine on data found");
            this.clearAlert();
          }
          else {
            this.EngineOnDatadocs = this.EngineOnData.docs
            this.EngineOnDatadocs.forEach(element => {
              element.extras.forEach(element1 => {
                this.engineONExcelData.push({
                  "Date & Time": new Date(element.devicePublishTime),
                  "Fuel Level": element1.fuelLevel,
                  "Engine": element.engineStatus,
                  "RPM": element1.rpm,
                  "Coolant Temprature": element1.coolantTemp,
                  "Battery Level(volt)": element1.batteryLevel,
                  "Travel Speed(Km/h)": element1.travelSpeed,
                  "Parking Switch": element1.parkingSwitch,
                  "Hydraulic Oil Filter Choke": element1.hydralicOilFilterChoke,
                  "Oil Pressure(Bar)": element1.oilpressure,
                  "Fuel(L)": element1.fuelInLitres,
                  "Distance(kms)": element1.distance
                });
              });
            });
            this.isChecked = false;
            // this.getalertEngineData();
          }
        }
        else {
          this.loading = false;
          this.alertService.error("No engine on data found");
          this.clearAlert();
        }
      },
        error => {
          this.loading = false;
          this.alertService.error(error);
          this.clearAlert();
        })
    }
    else
    {
      this.alertService.error("Date range should not exceed 10 days.Please select valid date for engine on data")
      this.clearAlert();
    }
    }
    else {
      this.batchFilter = {
        gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
        lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
        pinno: this.id = this.route.snapshot.params['id']
      }
      this.loading = true;
      this.EngineOnDatadocs = [];
      this.accountService.getEngineOn(this.batchFilter).subscribe((data) => {
        if (data) {
          this.loading = false;
          this.EngineOnData = data
          if (this.EngineOnData.status) {
            this.alertService.error("No engine on data found");
            this.clearAlert();
          }
          else {
            this.EngineOnDatadocs = this.EngineOnData.docs;
            this.EngineOnDatadocs.forEach(element => {
              element.extras.forEach(element1 => {
                this.engineONExcelData.push({
                  "Date & Time": new Date(element.devicePublishTime),
                  "Fuel Level": element1.fuelLevel,
                  "Engine": element.engineStatus,
                  "RPM": element1.rpm,
                  "Coolant Temprature": element1.coolantTemp,
                  "Battery Level(volt)": element1.batteryLevel,
                  "Travel Speed(Km/h)": element1.travelSpeed,
                  "Parking Switch": element1.parkingSwitch,
                  "Hydraulic Oil Filter Choke": element1.hydralicOilFilterChoke,
                  "Oil Pressure(Bar)": element1.oilpressure,
                  "Fuel(L)": element1.fuelInLitres,
                  "Distance(kms)": element1.distance
                });
              });
            });
            this.isChecked = false;
            // this.getalertEngineData();
          }
        }
        else {
          this.loading = false;
          this.alertService.error("No engine on data found");
          this.clearAlert();
        }
      },
        error => {
          this.loading = false;
          this.alertService.error(error);
          this.clearAlert();
        })
    }
   
    
  }
  // inactiveRecords(event: any){

  //   if(event){
  //     this.inActive = false;
  //   this.accountService.getAllDevice2()
  //   .pipe(first())
  //   .subscribe(devices => {this.devices = devices
  //     this.devices = this.devices.docs.filter(it => it.status == 'InActive');
  //     this.inActive = true;
  //   });

  // }

  // else {
  //   this.inActive = false;
  //  this.getDeviceData();

  // }


  // }

  exportEngineOnXLSX() {
    if(this.engineONExcelData.length > 0)
    {
    this.excelxlsxService.exportAsExcelFile(this.engineONExcelData, 'EngineON Master');
    }
    else
    {
      this.alertService.error("No excel data found");
      this.clearAlert();
    }
  }
  getalertEngineData(event) {
    this.calculateDiff(this.dtform.value.stdate); 
    if(this.days<=9)
    {
      if (event.target.checked) {
        this.alertEngineData = [];
        this.isChecked = true;
        if (this.selected2 == 'on') {
          this.EngineOnDatadocs.forEach(element => {
            if (element.extras) {
              element.extras.forEach(element1 => {
                if ((element1.fuelLevel == this.alertValues[0].fuelLevelw1 || element1.fuelLevel == this.alertValues[0].fuelLevelc) || ((element1.coolantTemp >= this.alertValues[0].coolantTempw1 && element1.coolantTemp <= this.alertValues[0].coolantTempw2) || (element1.coolantTemp >= this.alertValues[0].coolantTempc)) || ((element1.batteryLevel <= this.alertValues[0].batteryLevelw1 && element1.batteryLevel >= this.alertValues[0].batteryLevelc) || (element1.batteryLevel <= this.alertValues[0].batteryLevelc)) || (element1.hydralicOilFilterChoke == this.alertValues[0].hydralicOilFilterChokec) || (element1.oilpressure == this.alertValues[0].oilpressurec)) {
                  this.alertEngineData.push(element);
                }
              });
            }
          });
          this.EngineOnDatadocs = [];
          this.p = 1;
          this.EngineOnDatadocs = this.alertEngineData;
        } else if (this.selected2 == 'off') {
          this.EngineOffDatadocs.forEach(element => {
            if (element.extras) {
              element.extras.forEach(element1 => {
                if (((element1.batteryLevel <= this.alertValues[0].batteryLevelw1 && element1.batteryLevel >= this.alertValues[0].batteryLevelc) || (element1.batteryLevel <= this.alertValues[0].batteryLevelc))) {
                  this.alertEngineData.push(element);
                }
              });
            }
          });
          this.EngineOffDatadocs = [];
          this.p = 1;
          this.EngineOffDatadocs = this.alertEngineData;
        }
      } else {
        this.isChecked = false;
        if (this.selected2 == 'on') {
          this.getEngineOn();
        } else if (this.selected2 == 'off') {
          this.getEngineOff();
        }
      }
    }
    else {
      this.alertService.error("Date range should not exceed 10 days.Please select valid date alert engine data");
    }
  }

  getVehicleReport() {
   
    if (this.submitted) {
       this.calculateDiff(this.dtform.value.stdate); 
    if(this.days<=9)
    {
      this.batchFilter = {
        gte: this.dtform.value.stdate + "T00:00:00.000Z",
        lt: this.dtform.value.endate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
        pinno: this.id = this.route.snapshot.params['id'],
      }
      this.loading = true;
      this.reportDatadocs = [];
      this.accountService.getVehicleTrackReport(this.batchFilter).subscribe((data) => {
        this.reportData = data;
        if (this.reportData) {
          this.loading = false;
          if (this.reportData.status) {
            this.alertService.error("No report data found");
            this.clearAlert();
          }
          else {
            if (this.reportData.docs) {
              this.reportDatadocs = this.reportData.docs;
              this.summeryReport = this.reportDatadocs[0];
              this.summeryReportExtras = this.summeryReport.extras[0];
              this.lat = Number(this.summeryReport.lat.toString());
              this.lng = Number(this.summeryReport.lng.toString());
              this.getOpenStreetmapData();
            }
            else {
              return false;
            }
          }
        }
        else {
          this.loading = false;
          this.alertService.error("No report data found");
          this.clearAlert();
        }
      },
        error => {
          this.loading = false;
          this.alertService.error(error);
          this.clearAlert();
        })
    }
    else
    {
      this.alertService.error("Date range should not exceed 10 days.Please select valid date for report data")
      this.clearAlert();
    }
    }
    else {
      this.batchFilter = {
        gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
        lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt,
        pinno: this.id = this.route.snapshot.params['id'],
      }
      this.loading = true;
    this.reportDatadocs = [];
    this.accountService.getVehicleTrackReport(this.batchFilter).subscribe((data) => {
      this.reportData = data;
      if (this.reportData) {
        this.loading = false;
        if (this.reportData.status) {
          this.alertService.error("No report data found");
          this.clearAlert();
        }
        else {
          if (this.reportData.docs) {
            this.reportDatadocs = this.reportData.docs;
            this.summeryReport = this.reportDatadocs[0];
            this.summeryReportExtras = this.summeryReport.extras[0];
            this.lat = Number(this.summeryReport.lat.toString());
            this.lng = Number(this.summeryReport.lng.toString());
            this.getOpenStreetmapData();
          }
          else {
            return false;
          }
        }
      }
      else {
        this.loading = false;
        this.alertService.error("No report data found");
        this.clearAlert();
      }
    },
      error => {
        this.loading = false;
        this.alertService.error(error);
        this.clearAlert();
      })
    }

    
    
  }

  geocodeLatLng(lat, lng) {
    const latlng = {

      lat: this.lat,

      lng: this.lng

    };

    this.loading = true;

    this.ngZone.run(() => {

      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: latlng }, (results, status) => {

        if (status !== google.maps.GeocoderStatus.OK) {

          this.loading = false;

          alert(status);

        }



        else if (status == google.maps.GeocoderStatus.OK) {

          this.loading = false;

          this.address = results[0].formatted_address;



        }

        else {

          this.loading = false;

          this.alertService.error("No address found");

          this.clearAlert();

        }



      })

    });

  }

  getOpenStreetmapData() {
    const lat = this.lat;
    const lon = this.lng;
    const appURL = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + lat + "&lon=" + lon;
    //const appURL = "https://nominatim.openstreetmap.org/reverse?format=geojson&lat="+lat+"&lon="+lon;
    this.accountService.getLocationInfo(appURL).subscribe((res) => {
      this.locationInfo = res;
      this.address = this.locationInfo.display_name;
    });
  }
  getVehicleBatch() {
   
    if (this.submitted) {
      this.calculateDiff(this.dtform.value.stdate); 
      if(this.days<=9)
      {
      this.batchFilter = {
        gte: this.dtform.value.stdate + "T00:00:00.000Z",
        lt: this.dtform.value.endate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
        pinno: this.id = this.route.snapshot.params['id'],
      }
      this.loading = true;
      this.batchDatadocs = [];
  
      this.accountService.getBatchDatas(this.batchFilter).subscribe((data) => {
        if (data) {
          this.loading = false;
          this.batchData = data
          if (this.batchData.status) {
            this.alertService.error("No batch data found");
            this.clearAlert();
          }
          else {
            this.batchDatadocs = this.batchData.docs;
          }
        }
        else {
          this.loading = false;
          this.alertService.error("No batch data found");
          this.clearAlert();
        }
      },
        error => {
          this.loading = false;
          this.alertService.error(error);
          this.clearAlert();
        })
    }
    else
    {
      this.alertService.error("Date range should not exceed 10 days.Please select valid date for batch data")
      this.clearAlert();
    }
    }
    else {
      this.batchFilter = {
        gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
        lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
        pinno: this.id = this.route.snapshot.params['id']
      }
      this.loading = true;
      this.batchDatadocs = [];
  
      this.accountService.getBatchDatas(this.batchFilter).subscribe((data) => {
        if (data) {
          this.loading = false;
          this.batchData = data
          if (this.batchData.status) {
            this.alertService.error("No batch data found");
            this.clearAlert();
          }
          else {
            this.batchDatadocs = this.batchData.docs;
          }
        }
        else {
          this.loading = false;
          this.alertService.error("No batch data found");
          this.clearAlert();
        }
      },
        error => {
          this.loading = false;
          this.alertService.error(error);
          this.clearAlert();
        })
    }

  
    
  }

  getVehicleConsumption() {
    //let vm = this;
    if (this.submitted) {
      this.calculateDiff(this.dtform.value.stdate); 
      if(this.days<=9)
      {
      this.batchFilter = {
        gte: this.dtform.value.stdate + "T00:00:00.000Z",
        lt: this.dtform.value.endate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
        pinno: this.id = this.route.snapshot.params['id'],
      }
      this.loading = true;
      this.consumptionDatadocs = [];
      //this.alertService.error("No consumption data found");
      this.accountService.getsumConsumptionData(this.batchFilter).subscribe((data) => {
        if (data) {
          this.loading = false;
          this.consumptionData = data
          if (this.consumptionData.status) {
  
            this.alertService.error("No consumption data found");
            this.clearAlert();
          }
          else {
            this.consumptionDatadocs = this.consumptionData.docs
          }
  
        }
      },
        error => {
          this.loading = false;
          this.alertService.error(error);
          this.clearAlert();
        })
    }
    else
    {
      this.alertService.error("Date range should not exceed 10 days.Please select valid date for vehicle consumption data")
      this.clearAlert();
    }
    }
    else {
      this.batchFilter = {
        gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
        lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt,
        pinno: this.id = this.route.snapshot.params['id']
      }
      this.loading = true;
      this.consumptionDatadocs = [];
      //this.alertService.error("No consumption data found");
      this.accountService.getsumConsumptionData(this.batchFilter).subscribe((data) => {
        if (data) {
          this.loading = false;
          this.consumptionData = data
          if (this.consumptionData.status) {
  
            this.alertService.error("No consumption data found");
            this.clearAlert();
          }
          else {
            this.consumptionDatadocs = this.consumptionData.docs
          }
  
        }
      },
        error => {
          this.loading = false;
          this.alertService.error(error);
          this.clearAlert();
        })
    }

  
    
  }
  getEngineHours() {
    
    if (this.submitted) {
      this.calculateDiff(this.dtform.value.stdate); 
    if(this.days<=9)
    {
      this.timestampFilter = {
        onTimestamp: this.dtform.value.stdate + "T00:00:00.000Z",
        offTimestamp: this.dtform.value.endate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
        pinno: this.id = this.route.snapshot.params['id'],
      }
      this.loading = true;
      this.engineDatadocs = true;
      this.engineDatadocs = [];
      this.accountService.getEngineDatas(this.timestampFilter).subscribe((data) => {
        if (data) {
          this.loading = false;
          this.engineData = data
          if (this.engineData.status) {
            this.alertService.error("No engine hours data found");
            this.clearAlert();
          }
          else {
            this.engineDatadocs = this.engineData.docs
            this.engineDatadocs = _.sortBy(this.engineData.docs, (o) => moment["default"](o.createdAt)).reverse();
          }
        }
        else {
          this.loading = false;
          this.alertService.error("No engine hours data found");
          this.clearAlert();
        }
      },
        error => {
          this.alertService.error(error);
          this.clearAlert();
        })
      
    }
    else
    {
      this.alertService.error("Date range should not exceed 10 days.Please select valid date for engine hours data")
      this.clearAlert();
    }
    }
    else {
      this.timestampFilter = {
        onTimestamp: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
        offTimestamp: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt,
        pinno: this.id = this.route.snapshot.params['id']
      }
      this.loading = true;
      this.engineDatadocs = true;
      this.engineDatadocs = [];
      this.accountService.getEngineDatas(this.timestampFilter).subscribe((data) => {
        if (data) {
          this.loading = false;
          this.engineData = data
          if (this.engineData.status) {
            this.alertService.error("No engine hours data found");
            this.clearAlert();
          }
          else {
            this.engineDatadocs = this.engineData.docs
            this.engineDatadocs = _.sortBy(this.engineData.docs, (o) => moment["default"](o.createdAt)).reverse();
          }
        }
        else {
          this.loading = false;
          this.alertService.error("No engine hours data found");
          this.clearAlert();
        }
      },
        error => {
          this.alertService.error(error);
          this.clearAlert();
        })
      
    }

 
   
  }
  getSummaryData() {
    this.batchFilter = {
      pinno: this.id = this.route.snapshot.params['id']
    }
    this.accountService.getSummary(this.batchFilter).subscribe((data) => {
      this.summary = data
      if (this.summary) {
        if (this.summary.message) {
          this.alertService.error("No summary data found");
          this.clearAlert();
        }
        else {
          this.engineHours = this.summary.engineHours.total;
          this.lastOperatedOn = this.summary.lastOperatedOn.time;
          this.updatedOn = this.summary.updatedOn;
          if (this.summary.serviceDue) {
            this.serviceDueNumber = this.summary.serviceDue.number;
            if (this.serviceDueNumber == 1) {
              this.serviceType = "st";
            }
            else if (this.serviceDueNumber == 2) {
              this.serviceType = "nd";
            }
            else if (this.serviceDueNumber == 3) {
              this.serviceType = "rd";
            }
            else {
              this.serviceType = "th";
            }
            this.serviceDueType = this.summary.serviceDue.type;
            this.serviceDueDate = this.summary.serviceDue.dueDate;
          }

          else if (this.engineHours < 7) {
            this.engineHoursTotal = this.engineHours;
            this.averageHours = this.summary.averageHours;
            this.distanceTravelled = this.summary.distance.distanceTravelled;
            this.averageDistance = this.summary.distance.averageDistance;
          }
          else if (this.engineHours >= 7 && this.engineHours < 14) {
            this.engineHoursTotal = this.engineHours;
            this.averageHours = this.summary.averageHours;
            this.distanceTravelled = this.summary.distance.distanceTravelled;
            this.averageDistance = this.summary.distance.averageDistance;
          }
          else (this.engineHours >= 14)
          {
            this.engineHoursTotal = this.engineHours;
            this.averageHours = this.summary.averageHours;
            this.distanceTravelled = this.summary.distance.distanceTravelled;
            this.averageDistance = this.summary.distance.averageDistance;
          }
        }
      }
      else {
        this.loading = false;
        this.alertService.error("No summary data found");
        this.clearAlert();
      }
      let newdate = new Date(this.summary.lastOperatedOn.time)
      this.dateDiff = Math.abs(Math.floor((Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()) - Date.UTC(newdate.getFullYear(), newdate.getMonth(), newdate.getDate())) / (1000 * 60 * 60 * 24)));
    },
      error => {
        this.alertService.error(error);
        this.clearAlert();
      })
  }
  exportAsXLSX(): void {
    if (this.selected == 'Batch') {
      this.excelxlsxService.exportAsExcelFile(this.batchDatadocs, 'BatchMaster');
    }
    else (this.selected == 'Engine')
    {
      this.excelxlsxService.exportAsExcelFile(this.engineDatadocs, 'EngineMaster');
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.dtform.invalid) {
      return;
    }
    this.getSummaryData();
   if (this.selected == 'Report') {
      this.getVehicleReport();
    }
   if (this.selected2 == "on") {
      this.getEngineOn();
    }
    else if (this.selected2 == "off") {
      this.getEngineOff();
    }
    else if (this.selected == 'Batch') {
      this.getVehicleBatch();
    }
    else if (this.selected == 'Consumption') {
      this.getVehicleConsumption();
    }
    else if(this.selected == 'Engine')
    {
      this.getEngineHours();
    }
    //  this.getVehicleBatch();
  }

  clearAlert() {
    setTimeout(() => {
      this.alertService.clear();
    }, 2000);
  }
}