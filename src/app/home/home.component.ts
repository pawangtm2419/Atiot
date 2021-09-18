import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { environment } from '@environments/environment';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('openModal') openModal: ElementRef;
  showModal = true;
  iotNonIOTValue: any;
  iotDirections: any;
  today: Date = new Date();
  pipe = new DatePipe('en-US');
  todayWithPipe = null;
  users: any;
  machines: any;
  currentmonthcount: any;
  lastmonthcount: any;
  currentyearcount: any;
  vehicleparkCount: any;
  pinNo = environment.labelpinno;
  dashboardVehicleCount: any;
  showPolygon: any;
  location: any;
  allModel: any;
  devices: any;
  totalLength: any;
  activeDevices: any;
  parkvehicleCount: any;
  checkSignedon: any;
  east: number;
  west: number;
  north: number;
  south: number;
  central: number;
  allzone: any;
  eastzone: { name: string; value: number; }[];
  westzone: { name: string; value: number; }[];
  norhtzone: { name: string; value: number; }[];
  southzone: any;
  centralzone: { name: string; value: number; }[];
  totalvpark: number;
  coordinatedata: any;
  maplat: any;
  maplng: any;
  allModelDocs: any;
  date = new Date();
  iotNonIotValueNew: any;
  count: object;
  Active: any;
  InActive: any;
  monit: string;
  viewType: any = 'hybrid';
  active = [];
  inactive = [];
  monitoring = [];
  hideVehPark = false;
  IndividualCount: number;
  InstitutionalCount: number;
  OthersCount: number;
  ContractorCount: number;

  vehicleParkData: any;
  vehicleParkDataByModel: any;
  totalLegends: any;
  deviceCount: any;
  monitordata: any;
  monitordatacount: any;
  deviceModel: string;
  selectedDeviceModel: string;
  agmmarker = './../../assets/img/vehicle_icon.svg';
  servicedata: any;
  Vmon: { name: string; value: any; }[];
  credentials: { loginName: any; agreementSignedOn: string; };
  performer: any;
  performercount: any;
  IOTValue: any;
  NonIOTValue: any;
  selectMonth = 'currentMonth';
  selectedMonth: string;
  // vehiclePark:any;
  vehiclePark2: { name: string, value: number }[];
  vehiclePark = [];
  monthwise: Object;
  monthwisedata: any;
  modelList: any;
  modelListData: any[] = [];
  vehicleMonitoring: any;
  breakdownStat: any;
  serviceSchedule: any;
  scheduleService: { name: string, value: number }[];
  serviceScheduledStatus: any;
  top5Performers: {
    name: string,
    series: [
      { name: string, value: number },
      { name: string, value: number }
    ]
  }[];
  runHour: { name: string, value: number }[];
  runHour2: { name: string, value: number }[];
  runHour3: { name: string, value: number }[];
  customerSegmentation: { name: string, value: number }[];
  customerSegmentationCount: any;
  upcomingServiceCount: number;
  overdueServiceCount: number;
  overdueServiceCountPre: any;
  upcomingServiceCountPre: any;
  pastSevenDaysCount: number;
  pastSevenDaysCountPre: any;
  pastThirtyDaysCountPre: any;
  pastThirtyDaysCount: number;
  showvehiclePark = true;
  showvehiclePark2 = true;
  IOTCount: number;
  NonIOTCount: number;
  TotalCount: number;
  customArray: any[];
  VehicleParkCustomArray: any[];
  vehicleParkDeviceCountData: any;
  directionArray: any[] = [
    { name: 'PLANT', value: 'PLANT' },
    { name: 'east', value: 'EAST' },
    { name: 'west', value: 'WEST' },
    { name: 'north', value: 'NORTH' },
    { name: 'south1', value: 'SOUTH1' },
    { name: 'south2', value: 'SOUTH2' }];
  engineAssembly: number;
  engineAssemblyPre: any;
  gearInputShaft: number;
  gearInputShaftPre: any;
  brakePedalAssembly: number;
  brakePedalAssemblyPre: any;
  paintDefescts: number;
  paintDefesctsPre: any;
  eleSensor: number;
  eleSensorPre: any;
  isBrackDownData = false;
  breakDownDataKeys: string[];
  breakDownDataValues: number[];
  breakDownProgressBar1: any;
  breakDownProgressBar2: any;
  breakDownProgressBar3: any;
  breakDownProgressBar4: any;
  breakDownProgressBar5: any;
  secConvert: any;
  EngineHours2: number;
  vehicleParkDataCountByModel: any;
  tempIOTArray = [];
  tempNONIotArray = [];
  utilizationData: { name: string; value: string; }[];
  type: any;

  constructor(private accountService: AccountService, private router: Router, private route: ActivatedRoute) {
    this.users = this.accountService.userValue;
  }


  ngOnInit(): void {
    this.getAll();
  }
  colorScheme = { domain: ['#454397', '#e83e8c'] };
  colorSchemeVM = { domain: ['#28a745', '#dc3545'] };
  colorSchemeUT = { domain: ['#28a745', '#dc3545', '#4e35dc'] };
  colorSchemeBS = { domain: ['#007bff', '#ffc107', '#dc3545', '#28a745'] };
  colorSchemeSS = { domain: ['#007bff', '#ffc107', '#dc3545', '#28a745'] };
  colorSchemeSS2 = { domain: ['#007bff', '#28a745'] };
  colorSchemeTP = { domain: ['#ffc107', '#343a40'] };
  colorSchemeRHS = { domain: ['#007bff', '#dc3545', '#28a745']};
  colorSchemeCS = { domain: ['#28a745', '#007bff', '#ffc107', '#dc3545']};

  view: any[] = [520, 225];
  view2: any[] = [250, 225];
  viewVM: any[] = [200, 230];
  viewVMd: any[] = [260, 230];
  viewUT: any[] = [145, 230];
  viewBS: any[] = [250, 200];
  viewSS: any[] = [250, 300];
  viewSS2: any[] = [340, 150];
  viewTP: any[] = [500, 220];
  viewRHS: any[] = [140, 140];
  viewCS: any[] = [200, 200];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  yAxisLabelVM = 'No. of Vehicles';
  timeline = true;
  lastMonthPerformerData: any;
  currentMonthPerformerData: any;
  EngineHours: number;
  Distance: number;
  breakdownStatisticsdata: any;
  showDealerDiv = false;
  showDiv = false;

  checkAgreement(): void {
    this.type = JSON.parse(localStorage.getItem('user')).role;
    this.checkSignedon = JSON.parse(localStorage.getItem('user')).agreementSignedOn;

    if (this.checkSignedon == null) {
      let popupLoaded = JSON.parse(localStorage.getItem('popupLoaded'));

      if (this.type === 'dealer' || this.type === 'customer') {
        this.showModal = false;
        this.openModal.nativeElement.click();
        //this.agree();
      }
      localStorage.setItem('popupLoaded', '1');
    }
    else {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
      this.router.navigateByUrl(returnUrl);
    }
  }
  agree(): void {
    this.credentials = {
      loginName: JSON.parse(localStorage.getItem('user')).loginName,
      agreementSignedOn: this.checkSignedon
    };
    this.accountService.login(this.credentials).pipe(first()).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
        this.router.navigateByUrl(returnUrl);
        this.showModal = true;
      }
    });
  }
  logout(): void {
    this.accountService.logout();
  }

  getAll(): void {
    if (JSON.parse(localStorage.getItem('user')).role == 'dealer') {
      this.showDealerDiv = true;
      this.showDiv = false;
    }
    else {
      this.showDiv = true;
      this.showDealerDiv = false;
    }
    this.checkAgreement();
    this.getVehiclePark();
    this.getDeviceModelData();
    this.getVehicleMonitoring();
    this.getBreakdownStat();
    this.getServiceScheduleData();
    this.getScheduleServiceStatus();
    this.getTop5Performers();
    this.getCustomerSegmentation();
    //this.getRunHour();
    this.getCurrentMonth();
    this.getLastMonth();
    this.getAllModel();
    this.getCurrentYear();
    this.getUtilization();
  }

  // ************** New Dashboard code start Here *********************

  // ***********VEHICLE PARK Start Here****************

  selectedModel(): void {
    this.selectedDeviceModel = this.deviceModel;
    this.vehiclePark = [];
    this.getVehiclePark();
  }
  getDeviceModelData(): void {
    this.accountService.getAllModels().pipe(first()).subscribe(result => {
      this.modelList = result;
      this.modelListData = this.modelList.docs.filter(it => it.status == 'Active');
      this.modelListData.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title > b.title ? 1 : 0)
      //this.selectedModel();
    });
  }
  getVehiclePark(): void {
    if (this.selectedDeviceModel) {
      const data1 = {
        deviceModel: this.selectedDeviceModel
      };
      this.accountService.getVehicleParkDataByModel(data1).subscribe((data) => {
        this.showvehiclePark = true;
        this.showvehiclePark2 = false;
        this.vehicleParkDataByModel = data;

        this.tempIOTArray = this.vehicleParkDataByModel['iot'];
        if (this.tempIOTArray.length != 0) {
          this.IOTCount = parseInt(this.tempIOTArray[0].total);
        }
        else {
          this.IOTCount = 0;
        }
        this.tempNONIotArray = this.vehicleParkDataByModel['nonIot'];

        if (this.tempNONIotArray.length != 0) {
          this.NonIOTCount = parseInt(this.tempNONIotArray[0].total);
        }
        else {
          this.NonIOTCount = 0;
        }
        this.TotalCount = this.IOTCount + this.NonIOTCount;

        if (this.vehicleParkDataByModel) {
          this.directionArray.forEach((dir, ind) => {
            this.vehiclePark.push({
                name: dir.value,
                series: [
                  { name: 'IOT', value: this.assignval('iot', 0, dir.name) },
                  { name: 'NONIOT', value: this.assignval('nonIot', 0, dir.name) }
                ]
              });
          });
        }
        else {
          this.vehiclePark = [];
        }
      });

    }
    else {
      var iottotal = 0;
      var noniottotal = 0;
      this.accountService.getVehicleParkData().pipe(first()).subscribe(result => {
        this.vehicleParkData = result;
        this.showvehiclePark = false;
        this.showvehiclePark2 = true;
        if (this.vehicleParkData) {
          this.vehicleParkData.iot.forEach((iotelement) => {
            iottotal = parseInt(iottotal + iotelement.total);
            //this.tempIOTArray.push(iottotal);        
          });
          this.vehicleParkData.nonIot.forEach((nonIotelement) => {
            noniottotal = parseInt(noniottotal + nonIotelement.total);
          });
          this.vehiclePark2 =
            [
              { name: 'IOT', value: iottotal },
              { name: 'NONIOT', value: noniottotal }
            ];
        }
        this.IOTCount = iottotal;
        this.NonIOTCount = noniottotal;
        this.TotalCount = this.IOTCount + this.NonIOTCount;
      });
    }
  }



  assignval(type, index, direction) {

    let val: any = 0;
    if (type == 'iot') {
      if (this.tempIOTArray && this.tempIOTArray.length > 0 && this.tempIOTArray[index][direction]) {
        return this.tempIOTArray[index][direction];
      } else {
        return 0;
      }
    } else {
      if (this.tempNONIotArray && this.tempNONIotArray.length > 0 && this.tempNONIotArray[index][direction]) {
        return this.tempNONIotArray[index][direction];
      } else {
        return 0;
      }
    }

    return val;
  }


  // ***********VEHICLE PARK End Here****************

  // ***********VEHICLE MONITORING Start Here****************
  getVehicleMonitoring(): void {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
    this.accountService.getMonitorData(data1).subscribe((data) => {
      this.monitordata = data;
      this.active = this.monitordata.countAnddetails.Active;
      this.inactive = this.monitordata.countAnddetails.InActive;
      this.vehicleMonitoring = [
        { name: 'Active', value: this.active },
        { name: 'Inactive', value: this.inactive }
      ];
    });

  }
  navMonitor(): void {
    this.router.navigateByUrl(`/dashboard/vehicle-monitoring`);
  }

  breakdownSt(): void {
    this.router.navigateByUrl(`/dashboard/breakdown-statistics`);
  }

  schCompServices(): void {
    this.router.navigateByUrl(`/dashboard/schedule-complete-services`);
  }

  utilization(): void {
    this.router.navigateByUrl(`/report/machine-utilization`);
  }

  topPerformers(): void {
    this.router.navigateByUrl(`/dashboard/top-5-Performers`);
  }

  vehicleRunHour(): void {
    this.router.navigateByUrl(`/dashboard/run-hour`);
  }

  customerSegment(): void {
    this.router.navigateByUrl(`/dashboard/customer-segmentation`);
  }

  getAllModel(): void {
    // /dashboard/vehiclemon
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    };
    this.accountService.getAllvehiclemonModel(data1).subscribe((data) => {
      this.allModelDocs = data;
      this.allModel = this.allModelDocs.dataconcat;
      this.totalLength = this.allModel.length;

      this.viewPolygon();

      this.activeDevices = this.allModel.filter(it => it.status == 'Active');
      this.devices = this.activeDevices.length;
    });
  }

  viewPolygon(): void {
    var latlangValue = [];
    for(let i = 0; i < this.allModel.length; i++) {
      let allModelType = 'noniot';
      if (this.allModel[i].type == 'dvmap') {
        allModelType = 'iot';
      }
      latlangValue.push({
        lat: parseFloat(this.allModel[i].lat),
        lng: parseFloat(this.allModel[i].lng),
        date: moment(this.allModel[i].lastDataReceivedAt).format('DD-MM-YYYY'),
        time: moment(this.allModel[i].lastDataReceivedAt),
        pinno: this.allModel[i].pinno,
        engine_hours: this.allModel[i].totalEngineHours,
        cust_code: this.allModel[i].customerCode,
        mobile_no: this.allModel[i].customerMobile,
        type: allModelType,
      });
    }
    this.maplat = latlangValue[0].lat;
    this.maplng = latlangValue[0].lng;
    this.coordinatedata = latlangValue;

    const myLatLng = { lat: this.maplat, lng: this.maplng };

    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        zoom: 8,
        center: myLatLng,
      }
    );
  }

  // ***********VEHICLE MONITORING End Here****************

  // ***********Utilization Start Here****************
  getUtilization(): void {
    this.utilizationData = [
      { name: 'Eng. Hrs', value: '12' },
      { name: 'Batches', value: '10' },
      { name: 'Prod.', value: '5' }
    ];
  }
  // ***********Utilization end Here****************


  // ***********BREAKDOWN STATISTICS Start Here****************
  getBreakdownStat(): void {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName.toUpperCase()
    };
    this.accountService.getBreakdownStatisticsCount(data1).subscribe((data: any) => {
        this.breakdownStatisticsdata = data;
        this.breakdownStatisticsdata = this.breakdownStatisticsdata.count;
        if (this.breakdownStatisticsdata) {
          this.isBrackDownData = true;
          this.breakDownDataKeys = Object.keys(this.breakdownStatisticsdata);
          this.breakDownDataValues = Object.values(this.breakdownStatisticsdata);

          this.breakDownProgressBar1 = (this.breakDownDataValues[0]) + '%';
          this.breakDownProgressBar2 = (this.breakDownDataValues[1]) + '%';
          this.breakDownProgressBar3 = (this.breakDownDataValues[2]) + '%';
          this.breakDownProgressBar4 = (this.breakDownDataValues[3]) + '%';
          this.breakDownProgressBar5 = (this.breakDownDataValues[4]) + '%';
        }
        else {
          this.isBrackDownData = false;
          return;
        }
      });

    this.breakdownStat = [
        { name: 'EH', value: 10 },
        { name: 'CB', value: 5 },
        { name: 'RAS', value: 3 },
        { name: 'EA', value: 2 }
      ];
  }
  // ***********BREAKDOWN STATISTICS End Here****************

  // ***********SERVICE SCHEDULE Start Here****************
  getServiceScheduleData(): void {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    };
    this.accountService.getServiceSchedule(data1).subscribe((data: any) => {
      this.servicedata = data;
      if (this.servicedata) {
        this.upcomingServiceCount = this.servicedata.upcomingcount;
        this.upcomingServiceCountPre = (this.upcomingServiceCount) + '%';
        this.overdueServiceCount = this.servicedata.Overduecount;
        this.overdueServiceCountPre = (this.overdueServiceCount) + '%';
        this.pastSevenDaysCount = this.servicedata['Overdue Past 7 Days count'];
        this.pastSevenDaysCountPre = (this.pastSevenDaysCount) + '%';
        this.pastThirtyDaysCount = this.servicedata['Overdue Past 30 Days count'];
        this.pastThirtyDaysCountPre = (this.pastThirtyDaysCount) + '%';
      }
      else {
        return;
      }
    });

  }

  getScheduleServiceStatus(): void {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    };
    this.accountService.getServiceSchedulesStatus(data1).subscribe((data) => {
      this.serviceScheduledStatus = data;
      this.scheduleService = [
          { name: 'Scheduled', value: this.serviceScheduledStatus.countAnddetails.open },
          { name: 'Complete', value: this.serviceScheduledStatus.countAnddetails.closed }
        ];
    });
  }

  navService(): void {
    this.router.navigateByUrl(`/dashboard/service`);
  }

  // ***********SERVICE SCHEDULE End Here****************

  // ***********TOP 5 PERFORMERS Start Here****************

  changeMonth(): void {

    this.getTop5Performers();
  }
  getTop5Performers(): void {

    if (this.selectMonth == 'lastMonth') {

      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName: JSON.parse(localStorage.getItem('user')).loginName
      };
      this.accountService.getLastmonthtopfiveperformer(data1).subscribe((data) => {
        this.lastMonthPerformerData = data;
        this.top5Performers = this.getCustomArrayForTopPerformers(this.lastMonthPerformerData);
      });
    }
    else if (this.selectMonth == 'currentMonth') {

      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName: JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getCurrentmonthtopfiveperformer(data1).subscribe((data) => {
        this.currentMonthPerformerData = data;
        this.top5Performers = this.getCustomArrayForTopPerformers(this.currentMonthPerformerData);
      });

    }

  }

  getCustomArrayForTopPerformers(argumentData): any[] {
    if (argumentData.length > 0) {
      this.customArray = [];
      this.Distance = 0;
      this.EngineHours = 0;
      argumentData.forEach((element, index) => {
        this.Distance = this.Distance + parseInt(element.totalDistance);
        this.EngineHours = this.EngineHours + parseInt(element.totalSecond);
        this.secConvert = (this.EngineHours) * (1 / 3600);
        this.EngineHours2 = parseInt(this.secConvert);
        this.customArray.push({
          name: element.pinno.slice(-7),
          series: [
            { name: 'Total Hrs', value: (element.totalSecond) * (1 / 3600) },
            { name: 'Total Distance', value: element.totalDistance }
          ]
        });
      });
      return this.customArray;
    }
  }
  // ***********TOP 5 PERFORMERS End Here****************

  // ***********RUN HOUR STATISTICS Start Here****************
  getCurrentMonth(): void {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    };
    this.accountService.getCurrentMonthCountInner(data1).subscribe((data) => {
      this.currentmonthcount = data;
      if (this.currentmonthcount) {
        this.getRunHour();
      }
      else {
        return;
      }
    });
  }
  getLastMonth(): void {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    };
    this.accountService.getLastMonthCountInner(data1).subscribe((data: any) => {
      this.lastmonthcount = data;
      if (this.lastmonthcount) {
        this.getRunHour();
      }
      else {
        return;
      }
    });
  }
  getCurrentYear(): void {

    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    };
    this.accountService.getCurrentYearCountInner(data1).subscribe((data) => {
      this.currentyearcount = data;
      if (this.currentyearcount) {
        this.getRunHour();
      }
      else {
        return;
      }
    });
  }

  getRunHour(): void {
    this.runHour = [
        { name: '0 hrs to 50 hrs', value: this.currentmonthcount.fiftyCount },
        { name: '50 hrs to 100 hrs', value: this.currentmonthcount.fiftyplusCount },
        { name: 'Above 150 hrs', value: this.currentmonthcount.onefiftyplusCount }
      ];
    this.runHour2 = [
        { name: '0 hrs to 50 hrs', value: this.lastmonthcount.fiftyCount },
        { name: '50 hrs to 100 hrs', value: this.lastmonthcount.fiftyplusCount },
        { name: 'Above 150 hrs', value: this.lastmonthcount.onefiftyplusCount }
      ];

    this.runHour3 = [
        { name: '0 hrs to 50 hrs', value: this.currentyearcount.fiftyCount },
        { name: '50 hrs to 100 hrs', value: this.currentyearcount.fiftyplusCount },
        { name: 'Above 150 hrs', value: this.currentyearcount.onefiftyplusCount }
      ];
  }
  // ***********RUN HOUR STATISTICS End Here****************

  // ***********Customer Segmentation start Here****************
  getCustomerSegmentation(): void {
    this.accountService.getCustomerSegmentationCount().subscribe((data) => {
      this.customerSegmentationCount = data;
      if (this.customerSegmentationCount) {
        this.customerSegmentation = [
            { name: 'Individual', value: parseInt(this.customerSegmentationCount.Individual) },
            { name: 'Institutional', value: parseInt(this.customerSegmentationCount.Institutional) },
            { name: 'Others', value: parseInt(this.customerSegmentationCount.Others) },
            { name: 'Contractor', value: parseInt(this.customerSegmentationCount.Contractor) }
          ];
      }
      else {
        return;
      }
      this.IndividualCount = parseInt(this.customerSegmentationCount.Individual);
      this.InstitutionalCount = parseInt(this.customerSegmentationCount.Institutional);
      this.OthersCount = parseInt(this.customerSegmentationCount.Others);
      this.ContractorCount = parseInt(this.customerSegmentationCount.Contractor);
    });


  }
}
