import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/_services/auth.service';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.less']
})
export class SummaryComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  model = null;
  p: number = 1;
  searchText;
  date = new Date();

  form: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;

  id: string;
  isEditMode: boolean;
  showModal: boolean;
  batchData: any;
  batchFilter: any;
  dateRange: any;
  batchDatadocs: any;

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private auth: AuthService) { 
      this.auth.authFunction(window.location.pathname);
    }

  selected: string = '';

  //event handler for the select element's change event
  select(event: any) {
    //update the ui
    this.selected = event.target.value;
  }

  ngOnInit() {
    this.accountService.getAllModels()
      .pipe(first())
      .subscribe(model => {
        this.model = model
        this.model = this.model.docs
      });


    this.form = this.formBuilder.group({

      title: ['', Validators.required],


    });

    this.getBatchData();

  }
  get f() { return this.form.controls; }

  getBatchData() {
      this.batchFilter = {
        gte: JSON.parse(sessionStorage.getItem('dateTimeRange')).gte,
        lt: JSON.parse(sessionStorage.getItem('dateTimeRange')).lt,
        pinno: this.id = this.route.snapshot.params['id']
      }
      // console.log(this.batchFilter)
    this.accountService.getBatchDatas(this.batchFilter).subscribe((data) => {
      this.batchData = data
      this.batchDatadocs = this.batchData.docs
      console.log(this.batchDatadocs);
      
    })
  }




}
