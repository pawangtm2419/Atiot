
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, UsermanagemntService } from '@app/_services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Master } from '@app/_models';
import { DatePipe } from '@angular/common';
import { environment } from '@environments/environment';
import { AuthService } from '@app/_services/auth.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {


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
  isEdit = false;
  editMachineData: Master;
  id: string;
  deviceModel;
  market = null;
  zone = null;
  role = null;
  subzone = null;
  states = null;
  dealer = null;
  userzone = null;
  usersubzone = null;
  userrole = null;
  usermarket = null;
  userstate = null;
  userdealer = null;
  date = new Date();
  comp = environment.companyID;

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

  constructor(private usermanagementService: UsermanagemntService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private auth: AuthService) {
      this.auth.authFunction(window.location.pathname);
     }

  ngOnInit() {
    this.getAllUser();

    //add machine
    this.dropdownData();
    this.form = this.formBuilder.group({
      // deviceModel: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      companyID : ['',Validators.required],
      useType: ['', Validators.required],
      role: ['', Validators.required],
      userZone: [''],
      userSubzone: [''],
      userState: ['',Validators.required],
      loginName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ])),

      createdAtmuserMarket: ['',Validators.required],
      pincode: ['', Validators.required],
      city: ['', Validators.required],
      userDealer: [''],
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ])),
      confirmpassword: ['', Validators.required]
    });


  }




  getAllUser() {

    this.usermanagementService.getAllUsers()
      .pipe(first())
      .subscribe(user => {
        this.user = user
        this.user = this.user.docs;
      });

  }

  getrole() {


    this.usermanagementService.getRole(this.form.value.useType)
      .subscribe(role => {
        this.role = role;
        this.role = this.role.docs;

      });

  }

  getZone() {

    this.usermanagementService.getZone(this.form.value.createdAtmuserMarket)
      .subscribe(zone => {
        this.zone = zone;
        this.zone = this.zone.docs;

      });


  }

  getSubZone() {

    const market = this.form.value.createdAtmuserMarket;
    const zonecode = this.form.value.userZone;
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

    const market = this.form.value.createdAtmuserMarket;
    const zonecode = this.form.value.userZone;
    const subzoneCode = this.form.value.userSubzone;
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
      "marketCode": this.form.value.createdAtmuserMarket,
      "zoneCode": this.form.value.userZone,
      "subzoneCode": this.form.value.userSubzone,
      "stateCode": this.form.value.userState.toLowerCase()
    }

    this.usermanagementService.getDealers(subzoneData)
      .subscribe(dealer => {
        this.dealer = dealer;
        this.dealer = this.dealer.docs;


      });


  }


  deleteUser(id: string) {
    const master = this.user.find(x => x.id === id);
    master.isDeleting = true;
    // this.usermanagementService.deleteUsers(id)
    //   .pipe(first())
    //   .subscribe(() => this.user = this.user.filter(x => x.id !== id));
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
      this.updateUser(this.id);
    }
    else {
      this.createUser();

    }

  }



  isEditMode: boolean;
  showModal: boolean;
  addMachine() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.userzone = null;
    this.userrole = null;
    this.usermarket = null;
    this.usersubzone = null;
    this.userstate = null;
    this.userdealer = null;

    this.submitted = false;
  }

  createUser() {
    console.log(this.form.value);

    this.usermanagementService.newUser(this.form.value)
      // .pipe(first())
      .subscribe(res => {
        //next: () 
        console.log(res)
        this.alertService.success('User added successfully', { keepAfterRouteChange: true });
        // this.router.navigate(['../'], { relativeTo: this.route });
        this.closeButton.nativeElement.click();
        this.getAllUser();
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );

  }


  update(event, index, id) {

    this.showModal = true;
    this.isEditMode = true;
    this.id = id;
    console.log(this.id);


    let ids = index;
    if (this.isEditMode) {

      this.usermanagementService.getByIdUser(this.id)
        .subscribe(user => {

          this.user = user;
          this.form.patchValue(this.user);

          this.userzone = this.user.userZone;
          this.userrole = this.user.role;
          this.usermarket = this.user.createdAtmuserMarket;
          this.usersubzone = this.user.userSubzone;
          this.userstate = this.user.userState;
          this.userdealer = this.user.userDealer;


        });
    }

  }




  updateUser(id) {
    console.log(this.form.value);
    this.usermanagementService.updateUser(id, this.form.value)

      .subscribe(res => {
        console.log(res);
        this.alertService.success('Updated successful', { keepAfterRouteChange: true });
        this.closeButton.nativeElement.click();
        this.getAllUser();
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
