import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { Machine } from '@app/_models';
import { AccountService } from '@app/_services';
import { LayoutComponent } from './layout.component';
import { DatePipe } from "@angular/common";
import * as moment from 'moment';
import * as _ from 'lodash';


@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})
export class HomeComponent { 
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
  dashboardVehicleCount: any;
  showPolygon: any;
  location: any;
  allModel: any;
  devices: any;
  totalLength: any;
  activeDevices: any;
  parkvehicleCount: any;
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
  count:object
  Active:any
  InActive:any

  colorScheme = {
    domain: ['#454397', '#5AA454', '#C7B42C', '#AAAAAA']
  };
  totalLegends: any;
  deviceCount: any;
  monitordata: any;
  monitordatacount: any;

  agmmarker = "./../../assets/img/vehicle_icon.svg";

  constructor(private accountService: AccountService) {
    this.users = this.accountService.userValue;
  }
  ngOnInit() {
    // this.accountService.getAllMachines()
    //   .pipe(first())
    //   .subscribe(machines => {
    //     this.machines = machines
    //     this.machines = this.machines.docs;
    //     console.log(this.machines);

    //   });
    this.getAll()
  }

  getAll() {
    this.testFunction()
    this.testFunctionWithModelNo();
    this.getVehicleparkCount()
    this.getCurrentMonth()
    this.getLastMonth()
    this.getCurrentYear()
    this.getAllModel()
    this.getVhicleMonitoring()
  }

  testFunctionWithModelNo(){
    this.dashboardVehicleCount = {
      deviceModel: "ARGO4500",
    }
    this.accountService.getVehicleParkCountWithModelNumber(this.dashboardVehicleCount).subscribe((data)=>{
      console.log(data);
      this.deviceCount = data

      
      this.allzone = [
        { name: 'East', value: this.deviceCount.devicecount[0].east },
        { name: 'West', value: this.deviceCount.devicecount[0].west },
        { name: "North", value: this.deviceCount.devicecount[0].north },
        { name: "South", value: this.deviceCount.devicecount[0].south},
        { name: "Total", value: this.deviceCount.devicecount[0].total },
      ]
    })
  }  

  testFunction(){
    this.accountService.getVehicleparkCountTest().subscribe((data)=>{
      console.log(data)
      this.iotNonIotValueNew = [
        {name : data[0]._id+" "+ data[0].sum, value : data[0].sum},
        {name : data[1]._id+" "+ data[1].sum, value : data[1].sum},
      ]
      this.totalLegends = data[0].sum+data[1].sum;
    })
  }

  getVehicleparkCount() {
    this.dashboardVehicleCount = {
      deviceModel: "KIR02500",
    }
    this.accountService.getVehicleparkCountData().subscribe((data) => {
      this.vehicleparkCount = data
      console.log(this.vehicleparkCount);
      // this.iotNonIOTValue = [
      //   { name: 'NONIOT', value: this.vehicleparkCount.docs.filter(noniot => noniot.type == "NONIOT").length },
      //   { name: 'IOT', value: this.vehicleparkCount.docs.filter(iot => iot.type == "IOT").length },
      // ];
      // this.iotNonIOTValue = [
      //   { name: 'NON-IOT '+this.iotNonIOTValue[0].value, value: this.iotNonIOTValue[0].value },
      //   { name: 'IOT '+this.iotNonIOTValue[1].value, value: this.iotNonIOTValue[1].value },
      // ];

      this.parkvehicleCount = this.vehicleparkCount.docs.filter(x => x).length
      this.east = 0;
      this.west = 0;
      this.north = 0;
      this.south = 0;
      this.central = 0;
      this.totalvpark = 0;
      for (var i = 0; i < this.parkvehicleCount; i++) {
        var eastvalue = parseInt(this.vehicleparkCount.docs[i].east);
        this.east += eastvalue

        var westvalue = parseInt(this.vehicleparkCount.docs[i].west)
        this.west += westvalue

        var northvalue = parseInt(this.vehicleparkCount.docs[i].north)
        this.north += northvalue

        var southvalue = parseInt(this.vehicleparkCount.docs[i].south)
        this.south += southvalue

        var centralvalue = parseInt(this.vehicleparkCount.docs[i].central)
        this.central += centralvalue

        var totalvalue = parseInt(this.vehicleparkCount.docs[i].total)
        this.totalvpark += totalvalue
      }
      this.eastzone = [
        { name: "Total", value: this.totalvpark },
        { name: 'East', value: this.east },
      ]
      this.westzone = [
        { name: "Total", value: this.totalvpark },
        { name: 'West', value: this.west },
      ]
      this.norhtzone = [
        { name: "Total", value: this.totalvpark },
        { name: "North", value: this.north },
      ]

      this.southzone = [
        { name: "Total", value: this.totalvpark },
        { name: "South", value: this.south },
      ]

      this.centralzone = [
        { name: "Total", value: this.totalvpark },
        { name: "Central", value: this.central },
      ]

      // this.allzone = [
      //   { name: 'East', value: this.east },
      //   { name: 'West', value: this.west },
      //   { name: "North", value: this.north },
      //   { name: "South", value: this.south },
      //   { name: "Central", value: this.central },
      // ]


      this.activeDevices = this.allModel.filter(it => it.status=="Active");

    })
  }

  getCurrentMonth() {
    this.accountService.getCurrentMonthCount().subscribe((data) => {
      this.currentmonthcount = Object.values(data)
      console.log(this.currentmonthcount);
      
    })
  }
  getLastMonth() {
    this.accountService.getLastMonthCount().subscribe((data) => {
      this.lastmonthcount = Object.values(data)
      console.log(this.lastmonthcount);
      
    })
  }
  getCurrentYear() {
    this.accountService.getCurrentYearCount().subscribe((data) => {
      this.currentyearcount = Object.values(data)
      console.log(this.currentyearcount);
      
    })
  }
  getAllModel() {
    // /dashboard/vehiclemon
    this.accountService.getAllvehiclemonModel().subscribe((data) => {
      this.allModelDocs = data
      this.allModel = this.allModelDocs.docs;  
      console.log("all Models   ", this.allModel);
      this.totalLength = this.allModel.length

      this.viewPolygon();

      this.activeDevices = this.allModel.filter(it => it.status == "Active");
      this.devices = this.activeDevices.length;
      // console.log(this.devices);
    })
  }

  viewPolygon() {


    console.log('show length ', this.allModel.length);

    var latlangValue = [];
    for (var i = 0; i < this.allModel.length; i++) {
      latlangValue.push({
        lat: parseFloat(this.allModel[i].lat),
        lng: parseFloat(this.allModel[i].lng),
        date: moment(this.allModel[i].engineLastOn).format('DD-MM-YYYY'),
        time: moment(this.allModel[i].engineLastOn).format('HH:mm:ss'),
        pinno : this.allModel[i].pinno
      })
    }
    this.maplat = latlangValue[0].lat;
    this.maplng = latlangValue[0].lng;
    this.coordinatedata = latlangValue
   

    const myLatLng = { lat: this.maplat, lng: this.maplng };

    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 8,
        center: myLatLng,
      }
    );

    // new google.maps.Marker({
    //   icon: image,
    //   position: myLatLng,
    //   map,
    //   title: "Hello World!",
    // });

    // var marker
    // for (let i = 0; i < this.allModel.length; i++) {
    //   new google.maps.Marker({
    //     position: { lat: this.coordinatedata[i].lat, lng: this.coordinatedata[i].lng },
    //     map,
        // icon: image,
        // shape: shape,
        // title: beach[0],
        // zIndex: beach[3],
      // })

      // map.setCenter(marker.getPosition())


      // var content = "Loan Number"

      // var infowindow = new google.maps.InfoWindow()

      // google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
      //   return function () {
      //     infowindow.setContent(content);
      //     infowindow.open(map, marker);
      //   };
      // })(marker, content, infowindow));

    // }

  }
  getVhicleMonitoring(){
     this.accountService.getMonitorData().subscribe((data) => {
       this.monitordata = data
       console.log("Vehicle Monitoring Data ====   ",this.monitordata);
     })
   }
}