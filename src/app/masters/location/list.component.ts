import { Component, OnInit, AfterViewInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, AlertService } from '@app/_services';
import { MapLoaderService } from "./map.loader";
import { JsonPipe } from '@angular/common';
import * as moment from 'moment';
import { AuthService } from '@app/_services/auth.service';
declare var google: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  location = null;
  date = new Date();
  form: FormGroup;
  submitted = false;
  formdata: any;
  addMasterData: any;
  map: any;
  drawingManager: any;
  deleteCredential: any;
  polygon: any;
  locationValue: any;
  newdata: string;
  parsobj: any;
  lanNewValue: any[];
  polygonMAP: any;
  polygonMsg: string = '';
  showPolygon: any;
  p: number = 1;
  searchText;
  areaDetails = { fieldName: '', companyID: '', maxIdealTime: '' };
  deletePoi: any;
  locationDocs: any;
  status: any;
  constructor(private accountService: AccountService, private formBuilder: FormBuilder,
    private alertService: AlertService,
  ) {
   
  }

  ngAfterViewInit() {
    MapLoaderService.load().then(() => {
      this.drawPolygon();
    });
  }

  drawPolygon() {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 12.9716, lng: 77.5946 },
      zoom: 8
    });

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ["polygon"]
      }
    });

    this.drawingManager.setMap(this.map);
    google.maps.event.addListener(
      this.drawingManager,
      "overlaycomplete",
      event => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          // alert(event.overlay.getPath().getArray());
          this.locationValue = event.overlay.getPath().getArray();
          this.newdata = JSON.stringify(this.locationValue)
          this.parsobj = JSON.parse(this.newdata)
          var latlangValue = [];
          for (var i = 0; i < this.parsobj.length; i++) {
            latlangValue.push({
              lat: parseFloat(this.parsobj[i].lat),
              lng: parseFloat(this.parsobj[i].lng)
            })
          }
          return this.polygonMAP = latlangValue;
        }
      }
    );
  }

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
    this.createUserLOgs();
    this.getAllLocatin()
    this.form = this.formBuilder.group({
      fieldName: ['', Validators.required],
      location: ['', Validators.required],
      maxIdealTime: ['', Validators.required,],
      // overlayType: ['', Validators.required],
      // stateCode: ['', Validators.required]
    });
  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"MASTER",
        "function":"LOCATION",
        "type":"web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {    
         this.status=data['status'];
      },
        error => {
          this.alertService.error(error);
        })
    }
  get f() { return this.form.controls; }

  getAllLocatin() {
    let params=
    {
      "useType":JSON.parse(localStorage.getItem('user')).useType,
    "loginName":JSON.parse(localStorage.getItem('user')).loginName, 
}
 
    this.accountService.getAllLocation(params)
      .pipe(first())
      .subscribe((location) => {
        this.locationDocs = location
        this.location = this.locationDocs.docs;
 
        return this.location
      });
  }
  deletePoiRow(id: string) {
    let result = window.confirm("Are you sure you want to delete the record?")
    if (result == true) {
      this.accountService.deletePoiAreaRow(id).subscribe((data) => {
        this.deletePoi = data
        this.alertService.success('Location deleted successfully', { keepAfterRouteChange: true });
        this.getAllLocatin()
      })
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    else {
      if (this.polygonMAP == undefined) {
        alert("Polygon Map undefined!");
        return
      } else {
        this.formdata = {
          loginName:JSON.parse(localStorage.getItem('user')).loginName,
          fieldName: this.form.value.fieldName,
          radius: 0,
          maxIdealTime: this.form.value.maxIdealTime,
          overlayType: this.form.value.location,
          field: this.polygonMAP,
          locationType: this.form.value.location,
          clientID: "aY6w4GyyR1",
          zoneCode: "central",
          marketCode: "india",
          subzoneCode: "central",
          stateCode: this.form.value.stateCode,
          type: "locationmaster",
        }
        this.accountService.addMasterLocation(this.formdata).subscribe((data) => {
          this.addMasterData = data
          this.getAllLocatin()
          var btn = document.getElementById('addModelClosebtn');
          btn.click();
          if (this.addMasterData.status == 'success') {
            this.getAllLocatin()
          } else {
            this.alertService.error(this.addMasterData);
          }
        })
      }
    }
  }
  viewPolygon(id) {
    this.areaDetails = {
      fieldName: this.location[id].fieldName,
      companyID: this.location[id].companyID,
      maxIdealTime: this.location[id].maxIdealTime
    }
    this.showPolygon = this.location[id].field
    const map = new google.maps.Map(document.getElementById("maparea"), {
      zoom: 12,
      center: { lat: this.showPolygon[0].lat, lng: this.showPolygon[0].lng },
      mapTypeId: "terrain",
    });

    const triangleCoords = this.location[id].field;
    const polygonAngles = new google.maps.Polygon({
      paths: triangleCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
    });
    polygonAngles.setMap(map);
  }

}
