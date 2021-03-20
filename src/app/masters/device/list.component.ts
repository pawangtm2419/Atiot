import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-device',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  devices = null;
  p: number = 1;
  searchText;
  form: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;
  editDeviceData: Device;
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  isChecked;
  inActive = false;
  active = false;
  date  = new Date();
  selectedRow : Number;
  setClickedRow : Function;
  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private auth: AuthService) {
      this.setClickedRow = function(index){
        this.selectedRow = index;
        this.auth.authFunction(window.location.pathname);
    }
      
     }


  ngOnInit() {
    this.getDeviceData();


    // add device
    this.form = this.formBuilder.group({
      deviceID: ['', Validators.required],
      devicesim: ['', Validators.required],
      deviceinstallationDate: ['', Validators.required],
      devicereceiptDate: ['', Validators.required],
      deviceactivationqcDate: ['', Validators.required],


    });



  }

  getDeviceData(){

    this.accountService.getAllDevice()
    .pipe(first())
    .subscribe(devices => {
      this.devices = devices;
     this.devices = this.devices.docs.filter(it => it.status == 'Active')
     this.inActive = true; 
    });
  }

  inactiveRecords(event: any){

    if(event){
      this.inActive = false;
    this.accountService.getAllDevice()
    .pipe(first())
    .subscribe(devices => {this.devices = devices
      this.devices = this.devices.docs.filter(it => it.status == 'InActive');
      this.inActive = true;
    });

  }

  else {
    this.inActive = false;
   this.getDeviceData();

  }
  

  }




  deleteUser(id: string) {
    const user = this.devices.find(x => x.id === id);
    user.isDeleting = true;
    this.accountService.delete(id)
      .pipe(first())
      .subscribe(() => this.devices = this.devices.filter(x => x.id !== id));
  }

  get f() { return this.form.controls; }

  onSubmit() {

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      this.updateDevice(this.id);
    }
    else {
      this.createDevice();

    }

  }





  addDevice() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;
  }

  createDevice() {

   
    this.accountService.newDevice(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Device added successfully', { keepAfterRouteChange: true });
          // this.router.navigate(['../'], { relativeTo: this.route });
          this.closeButton.nativeElement.click();
          this.getDeviceData();
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });


  }





  update(event, index, id) {

    this.showModal = true;
    this.isEditMode = true;
    this.id = id;



    let ids = index;
    if (this.isEditMode) {

      this.accountService.getByIdDevice(this.id)
        .subscribe(devices => {

          this.devices = devices;
          this.form.patchValue(this.devices);

        });
    }

  }




  updateDevice(id) {

    this.accountService.updateDevice(id, this.form.value)

      .subscribe(res => {

        this.alertService.success('Update successful', { keepAfterRouteChange: true });
        // this.router.navigate(['../../'], { relativeTo: this.route });
        this.closeButton.nativeElement.click();
        this.getDeviceData();
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }

      );

    //this.closeButton.nativeElement.click();
  }


}



