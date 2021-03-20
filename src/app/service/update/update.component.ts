import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/_services/auth.service';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {
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
  pinno: any;
  service: any;
  deviceModel: any;
  category: any;
  categoryDocs: void;
  subcategory: any;
  subcategoryDocs: any;
  releases: any = [];
  release: any = [];
  showFromData=false;
  records: any;
  snum: any;

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
  getService(pinno,deviceModel){
    this.pinno = pinno
    this.deviceModel = deviceModel
    this.accountService.getUpcomingSchedule(this.pinno)
    .pipe(first())
    .subscribe(service => {
      this.service = service
      console.log("service ", service)
    });
  }
  getCategory(pinno,snum){
    this.snum = snum
    console.log("service num ",snum)
    this.pinno = pinno
    this.accountService.getCategory()
    .pipe(first())
    .subscribe(category => {
      this.category = category
      this.categoryDocs =  this.category.docs
      console.log("Category ", this.categoryDocs)
    });
  }
  getSubCategory(){
    this.batchFilter = {
      name : this.form.value.category
    }
    this.accountService.getSubCategory(this.batchFilter)
    .pipe(first())
    .subscribe(subcategory => {
      this.subcategory = subcategory
      this.subcategoryDocs =  this.subcategory.docs
      console.log("Sub Category ", this.subcategoryDocs)
    });
  }
  addDetails() {
    this.releases = {
      category: this.form.value.category,
      subcategory: this.form.value.subcategory,
    
    };
    this.release.push(this.releases)
    this.showFromData = true
  }
  delete(v){
    this.release.pop(this.release[v])
  }


  ngOnInit() {
    this.accountService.getUpcomingServices()
      .pipe(first())
      .subscribe(model => {
        this.model = model
        console.log("models", model)
      });
     
    this.form = this.formBuilder.group({
      category:['',Validators.required],
      subcategory:['',Validators.required],
      machineno:['',Validators.required],
      actualcompletiondate:['',Validators.required],
      remarks:['',Validators.required],
      cost:['',Validators.required],
      


    });


  }
  get f() { return this.form.controls; }

  onSubmit(){
    this.submitted = true;
    if (this.form.invalid) {
      return;
  }else {
    this.records = {
      actualcompletiondate: this.form.value.actualcompletiondate,
      cost : this.form.value.cost,
      remarks : this.form.value.remarks,
      category : this.form.value.category,
      subcategory : this.form.value.subcategory,
      items : ["1","2"],
      status : "close"
    }
    this.accountService.serviceUpdate(this.form.value.machineno,this.snum,this.records).subscribe((data) => {
      const buttonModal = document.getElementById("invoiceMode")
      buttonModal.click()
    })
        
      }

}

  }
  





