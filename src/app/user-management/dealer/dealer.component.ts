import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, UsermanagemntService } from '@app/_services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Master } from '@app/_models';
import { DatePipe } from '@angular/common';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.less']
})
export class DealerComponent implements OnInit {

  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  user = null;
  model = null;
  variant = null;
  form: FormGroup;
  submitted = false;
  loading = false;
  p: number = 1;
  searchText;
  isChecked;
  isEdit = false;
  editMachineData: Master;
  id: string;
  deviceModel;
  market = null;
  zone = null;
  role = null;
  subzone = null;
  states = null;
  dealer: any = [];
  userzone = null;
  usersubzone = null;
  userrole = null;
  usermarket = null;
  userstate = null;
  userdealer = null;
  date = new Date();

  error_messages = {
    'loginName': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' }
    ],
    'password': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' }
    ],

  }
  maketCode: null;
  name: null;
   zoneCode: null;
  subzoneCode: null;
  stateCode: null;
  code: null;
  up:any;
  deletedealerdata: Object;
  dealers=[];
  mobileNumberPattern="^((\\+91-?)|0)?[0-9]{10}$";
  params: {};
  addressData: any;

  constructor(private usermanagementService: UsermanagemntService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
   ) { 
     
    }

  ngOnInit() {
    this.getAlldealers();

    //add machine
    this.dropdownData();
    this.form = this.formBuilder.group({
      // deviceModel: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      marketCode: ['', Validators.required],
      address:[''],
      zoneCode: ['', Validators.required],
      pinCode:[''],
      subzoneCode: ['', Validators.required],
      lat:[''],
      stateCode: ['', Validators.required],
      lng:[''],
      contactNo:['',Validators.pattern(this.mobileNumberPattern)],
      contactPerson:['']
    });


  }



  getAlldealers() {
debugger
    this.usermanagementService.getAlldealers()
      .pipe(first())
      .subscribe(dealer => {
        this.dealer = dealer
        this.dealer = this.dealer.docs.filter(it => it.isActive == 'true');
     //   this.dealer =  this.dealer.filter(s => s.includes(s.isActive == true));
      });
      console.log(this.dealer)
  }
  inactiveRecords(event: any) {
    debugger
    if (event) {
      this.usermanagementService.getAlldealers()
        .pipe(first())
        .subscribe(dealer => {
          this.dealer = dealer
          this.dealer = this.dealer.docs.filter(it => it.isActive == 'false');
        });

    }

    else {

      this.getAlldealers();

    }
  }

  getrole() {


    this.usermanagementService.getRole(this.form.value.useType)
      .subscribe(role => {
        this.role = role;
        this.role = this.role.docs;

      });

  }

  getZone() {
    this.usermanagementService.getZone(this.form.value.marketCode)
      .subscribe(zone => {
        this.zone = zone;
        this.zone = this.zone.docs;
      });
  }

  getSubZone() {

    const market = this.form.value.marketCode;
    const zonecode = this.form.value.zoneCode;
    const subzoneData = {
      "marketCode": market,
      "zoneCode": zonecode
    }

    this.usermanagementService.getSubZone(subzoneData)
      .subscribe(subzone => {
        this.subzone = subzone;
        this.subzone = this.subzone.docs;


      });


  }
  getState() {

    const market = this.form.value.marketCode;
    const zonecode = this.form.value.zoneCode;
    const subzoneCode = this.form.value.subzoneCode;
    const subzoneData = {
      "marketCode": market,
      "zoneCode": zonecode,
      "subzoneCode": subzoneCode
    }

    this.usermanagementService.getState(subzoneData)
      .subscribe(state => {
        this.states = state;
        this.states = this.states.docs;

      });


  }

  getDealers() {


    const subzoneData = {
      "marketCode": this.form.value.marketCode,
      "zoneCode": this.form.value.zoneCode,
      "subzoneCode": this.form.value.subzoneCode,
      "stateCode": this.form.value.stateCode.toLowerCase()
    }

    this.usermanagementService.getDealers(subzoneData)
      .subscribe(dealer => {
        this.dealer = dealer;
        this.dealer = this.dealer.docs;


      });


  }

  deleteDealer(id: string) {
    debugger
    const dealer = this.dealer.find(x => x.id === id);
    dealer.isDeleting = true;
    let result = window.confirm("Are you sure you want to delete the record?")
    if (result == true) {
      this.usermanagementService.deleteDealers(id).subscribe((data) => {
        this.deletedealerdata = data
        this.alertService.success('Dealer deleted successfully', { keepAfterRouteChange: true });
        this.getAlldealers();
      })
    }
    else {
      dealer.isDeleting = false;
    }
  }




  createDealer() {
    console.log(this.form);
  // this.params={
  //   name:this.form.value.name,
  //   code:this.form.value.name,
  //   marketCode:this.form.value.marketCode,
  //   zoneCode:this.form.value.zoneCode,
  //   address:this.form.value.address,
  //   pincode:this.form.value.pincode
  //   subzoneCode:this.form.value.subzoneCode,
  //   lat:this.form.value.lat,
  //   stateCode:this.form.value.stateCode,
  //   lng:this.form.value.lng,
  //   contactNo:this.form.value.contactNo,
  //   contactPerson:this.form.value.contactPerson
  // }
    this.usermanagementService.newDealer(this.form.value)
      // .pipe(first())
      .subscribe(res => {
        //next: () 
        console.log(res)
        this.up = res

        if (this.up.status == "success") {
        this.alertService.success('Dealer added successfully', { keepAfterRouteChange: true });
        this.getAlldealers();

        }
        // this.router.navigate(['../'], { relativeTo: this.route });
        this.closeButton.nativeElement.click();
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );

  }

 


  onSubmit() {
    debugger;
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      this.updateDealer(this.id);
    }
    else {
      this.createDealer();

    }

  }





  dropdownData() {

    this.usermanagementService.getMarket()
      .pipe(first())
      .subscribe(market => {
        this.market = market;
        this.market = this.market.docs;
      });

  }
  get f() { return this.form.controls; }





  isEditMode: boolean;
  showModal: boolean;
  addDealer() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.zoneCode = null;
    this.subzoneCode = null;
    this.stateCode = null;
    this.submitted = false;
  }




  update(event, index, id) {
debugger
    this.showModal = true;
    this.isEditMode = true;
    this.id = id;
    console.log(this.id);
    let ids = index;
    if (this.isEditMode) {

      this.usermanagementService.getDealerById(this.id)
        .subscribe(dealer => {
          this.getZone();
if(dealer){
  this.dealer = dealer;
  this.form.patchValue(this.dealer);
 // this.form.controls['zoneCode'].patchValue(this.dealer.zoneCode);
 this.zoneCode=this.dealer.zoneCode;;
 this.subzoneCode=this.dealer.subzoneCode;
 this.stateCode=this.dealer.stateCode;
}
  console.log("Form",this.form)
 this.userzone = this.dealer.zoneCode;
  this.usermarket = this.dealer.marketCode;
  this.usersubzone = this.dealer.subzoneCode;
  this.userstate = this.dealer.stateCode;
});
}
}


  updateDealer(id) {
    debugger
    console.log(this.form.value);
    this.usermanagementService.updateDealer(id, this.form.value)

      .subscribe(res => {
        console.log(res);
        this.alertService.success('Dealer updated successfully', { keepAfterRouteChange: true });
        this.closeButton.nativeElement.click();
        this.getAlldealers();
      },
        error => {
          console.log(error)
          this.alertService.error(error);
          this.loading = false;
          this.closeButton.nativeElement.click();
        }

      );


  }





}

