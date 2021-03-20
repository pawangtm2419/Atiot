import { Component, OnInit } from '@angular/core';
import { Model } from '@app/_models';

import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-geofencing',
  templateUrl: './geofencing.component.html',
  styleUrls: ['./geofencing.component.less']
})
export class GeofencingComponent implements OnInit {
  // @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  // @ViewChild('closeButton') closeButton;
  p: number = 1;
  searchText;
  model = null;
  showModal: boolean;
  date = new Date();
  inActive = false;
  active = false;
  form: FormGroup;
  submitted = false;
  geofence: any;
  geofenceDocs: any;
  locationDocs: any;
  location: any;
  pinno: any;
  deleteLocationDetails: any;
  geofencelist: any;
  geofencelistDocs: any;
  locationData: any;
  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      pinno: '',
      poi: ['', Validators.required],
    });
    this.getGeofenceList()
    this.getGeoFenceLocation()
    this.getAllLocatin();
  }
  get f() { return this.form.controls; }

  getGeofenceList() {
    this.accountService.getAllGeofenceList().subscribe((data) => {
      // console.log(data)
      this.geofencelist = data
      this.geofencelistDocs = this.geofencelist.docs;
      console.log(this.geofencelistDocs);

    })
  }

  getPinno(pinno) {
    this.pinno = pinno
  }

  deleteLocation(pinno, poi) {
    this.deleteLocationDetails = {
      pinno: pinno,
      poi: poi
    }
    console.log(this.deleteLocationDetails);

    this.accountService.deleteLocationGeofence(this.deleteLocationDetails).subscribe((data) => {
      console.log(data)
      this.getGeofenceList()
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return
    } else {
      this.locationData = {
        pinno: this.form.value.pinno,
        poi: this.form.value.poi
      }
      console.log(this.locationData)
      this.accountService.addLocation(this.locationData).subscribe((data) => {
        console.log(data);
        this.getGeofenceList()
        var modelclose = document.getElementById("mapLocationclose");
        modelclose.click();
      })
    }
  }

  getGeoFenceLocation() {
    this.accountService.getGeoFenceLocationList().subscribe((data) => {
      // console.log(data)
      this.geofence = data;
      this.geofenceDocs = this.geofence.docs
      console.log(this.geofenceDocs);

    })
  }
  getAllLocatin() {
    this.accountService.getAllLocation()
      .pipe(first())
      .subscribe((location) => {
        this.locationDocs = location
        this.location = this.locationDocs.docs
        console.log(this.location);

        return this.location
      });
  }


  // Test get address
  getAddresViaLatLang(){
    // alert("worlkding")
    let lat = 28.612673;
    let lng = 77.2597539;
    this.accountService.getLocationAddress(lat,lng).subscribe((data)=>{
      console.log(data);
      
    })
  }
}
