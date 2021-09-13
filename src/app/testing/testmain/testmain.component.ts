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

  ngOnInit() { }

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
}

