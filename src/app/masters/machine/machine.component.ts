import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Master } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';


@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.less']
})
export class MachineComponent implements OnInit {

  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  master = null;
  model = null;
  devices = null;
  variant = null;
  form: FormGroup;
  submitted = false;
  loading = false;
  p: number = 1;
  searchText;
  isEdit = false;
  editMachineData: Master;
  id: string;
  isChecked;
  inActive = false;
  active = false;
  deviceModel;
  date = new Date()







  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private auth: AuthService) {
      this.auth.authFunction(window.location.pathname);
     }


    ngOnInit() {
    
    this.getDeviceName()
    this.getMachineData();
    //add machine
    this.dropdownData();
    this.form = this.formBuilder.group({
      deviceModel: ['', Validators.required],
      variant: ['', Validators.required],
      machineno: ['', Validators.required],
      pinno: ['', Validators.required],
      batterylotno: ['', Validators.required],
      manufacturingDate: ['', Validators.required],
      deliveryDate: new FormControl(),
      shipmentDate: new FormControl(),
      batteryInstallationDate: new FormControl(),

    });
  }

  getDeviceName(){
    this.accountService.getAllDevice()
    .pipe(first())
    .subscribe(devices => {
      this.devices = devices;
     this.devices = this.devices.docs.filter(it => it.status == 'Active')
     this.inActive = true; 
    });
  }

  
  getMachineData() {
    this.accountService.getAllMachines1()
      .pipe(first())
      .subscribe(master => {
        this.master = master
        this.master = this.master.docs.filter(it => it.status == 'Active');
        this.inActive = true;
      });

  }

  inactiveRecords(event: any) {

    if (event) {
      this.inActive = false;
      this.accountService.getAllMachines1()
        .pipe(first())
        .subscribe(master => {
          this.master = master
          this.master = this.master.docs.filter(it => it.status == 'InActive');
          this.inActive = true;
        });

    }
    else {
      this.inActive = false;
      this.getMachineData();
    }


  }


  deleteUser(id: string) {
    const master = this.master.find(x => x.id === id);
    master.isDeleting = true;
    this.accountService.deleteMachine(id)
      .pipe(first())
      .subscribe(() => this.master = this.master.filter(x => x.id !== id));
  }

  dropdownData() {
    this.accountService.getAllModels()
      .pipe(first())
      .subscribe(model => {
     
        this.model = model;
         this.model = this.model.docs.filter(it => it.status == 'Active');
            this.model.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title > b.title ? 1 : 0)
      });
  }
  
  get f() { return this.form.controls; }

  getVariant() {


    this.accountService.getVariantModel(this.form.value.deviceModel)
      .subscribe(variant => {
        this.variant = variant;

      });

  }

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
      this.updateMachine1(this.id);
    }
    else {
      this.createMachine();

    }

    if (this.isEditMode) {
      this.updateDevice(this.id);
    }
    else {
      this.createDevice();

    }


  }

  



  isEditMode: boolean;
  showModal: boolean;
  addMachine() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;

  }

  
  addDevice() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;
  }

  createDevice() {

   
    this.accountService.newDevice(this.form.value)
      .subscribe(res   => { 
          console.log(res);
          this.alertService.success('Device added successfully', { keepAfterRouteChange: true });
          this.closeButton.nativeElement.click();
          this.getDeviceName();
        },
         error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );


  }
  
  createMachine() {

    this.accountService.newMachine(this.form.value)
      .subscribe((res) => {
        console.log(res);



        if (res.status == "success") {
          this.alertService.success('Machine added successfully', { keepAfterRouteChange: true });
          this.getMachineData();
        }
        else {
          this.alertService.error('Machine already created', { keepAfterRouteChange: true });

        }
        this.closeButton.nativeElement.click();
        this.loading = false;

      },
        err => {
          this.alertService.error(err);
          this.loading = false;
        }
      );

  }

  





  update(event, index, id) {

    this.showModal = true;
    this.isEditMode = true;
    this.id = id;



    let ids = index;
    if (this.isEditMode) {

      this.accountService.getByIdMachine(this.id)
        .subscribe(master => {
          console.log(ids);
          this.master = master;
          this.form.patchValue(this.master);

        });
    }

  }




  updateMachine1(id) {

    this.accountService.updateMachine(id, this.form.value)

      .subscribe(res => {
        console.log(res);
        this.alertService.success('Updated successful', { keepAfterRouteChange: true });
        // this.router.navigate(['../../'], { relativeTo: this.route });
        this.closeButton.nativeElement.click();
        this.getMachineData();
      },
        error => {
          console.log(error)
          // this.alertService.error(error);
          this.loading = false;
          this.closeButton.nativeElement.click();
        }

      );


  }

  update1(event, index, id) {

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
        console.log(res);
        this.alertService.success('Update successful', { keepAfterRouteChange: true });
        this.closeButton.nativeElement.click();
        this.getDeviceName();
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }

      );
      console.log("saving device data");
  }

  /*  closeModal(modal){
    document.querySelector('#'+ modal).classList.remove('md-show');
  }

  closeMyModal(event){
   ((event.target.parentElement).parentElement).classList.remove('md-show');
  } 
 */




}


