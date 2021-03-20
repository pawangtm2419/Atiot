import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, UsermanagemntService } from '@app/_services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-testmain',
  templateUrl: './testmain.component.html',
  styleUrls: ['./testmain.component.less']
})
export class TestmainComponent implements OnInit {

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

  constructor(private usermanagementService: UsermanagemntService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private auth: AuthService) {
      this.auth.authFunction(window.location.pathname);
     }

  ngOnInit() {
    // this. getAlldealers();

    // //add machine
    // this.dropdownData();
    // this.form = this.formBuilder.group({
    //   // deviceModel: ['', Validators.required],
    //   name: ['', Validators.required],
    //   marketCode: ['', Validators.required],
    //   zoneCode: ['', Validators.required],
    //   subzoneCode: ['', Validators.required],
    //   useType: ['', Validators.required],
    //   stateCode: ['', Validators.required],
    //   code: ['', Validators.required],
    // });


  }




  // getAlldealers() {

  //   this.usermanagementService.getAlldealers()
  //     .pipe(first())
  //     .subscribe(dealer => {
  //       this.dealer = dealer
  //       this.dealer = this.dealer.docs;
  //       console.log(this.dealer)
  //     });

  // }

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

  



  // createDealer() {
  //   console.log(this.form);

  //   this.usermanagementService.newDealer(this.form.value)
  //     // .pipe(first())
  //     .subscribe(res => {
  //       //next: () 
  //       console.log(res)
  //       this.alertService.success('Dealer added successfully', { keepAfterRouteChange: true });
  //       // this.router.navigate(['../'], { relativeTo: this.route });
  //       this.closeButton.nativeElement.click();
  //       this.getAlldealers();
  //     },
  //       error => {
  //         this.alertService.error(error);
  //         this.loading = false;
  //       }
  //     );

  // }

 


//   deleteUser(id: string) {
//     const master = this.user.find(x => x.id === id);
//     master.isDeleting = true;
//     // this.usermanagementService.deleteUsers(id)
//     //   .pipe(first())
//     //   .subscribe(() => this.user = this.user.filter(x => x.id !== id));
//   }
//   onSubmit() {
    
   
//     this.createDealer();

// }




  // dropdownData() {

  //   this.usermanagementService.getMarket()
  //     .pipe(first())
  //     .subscribe(market => {
  //       this.market = market;
  //       this.market = this.market.docs;
  //     });

  // }
  // get f() { return this.form.controls; }





  // isEditMode: boolean;
  // showModal: boolean;
  // addMachine() {
  //   this.showModal = true;
  //   this.isEditMode = false;
  //   this.form.reset();
  //   this.name = null;
  //   this.maketCode = null;
  //   this.zoneCode = null;
  //   this.subzoneCode = null;
  //   this.stateCode = null;
  //   this.code = null;

  //   this.submitted = false;
  // }




  // update(event, index, id) {

  //   this.showModal = true;
  //   this.isEditMode = true;
  //   this.id = id;
  //   console.log(this.id);


  //   let ids = index;
  //   if (this.isEditMode) {

  //     this.usermanagementService.getByIdUser(this.id)
  //       .subscribe(user => {

  //         this.user = user;
  //         this.form.patchValue(this.user);

  //         this.userzone = this.user.userZone;
  //         this.userrole = this.user.role;
  //         this.usermarket = this.user.createdAtmuserMarket;
  //         this.usersubzone = this.user.userSubzone;
  //         this.userstate = this.user.userState;
  //         this.userdealer = this.user.userDealer;


  //       });
  //   }

  // }







}

