import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { validate } from 'json-schema';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.less']
})
export class ShipmentComponent implements OnInit {
  [x: string]: Object;
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  customer: any;
  p: number = 1;
  searchText;
  form: FormGroup;
  submitted = false;
  isEdit = false;

  id: string;
  isEditMode: boolean;
  showModal: boolean;
  loading: boolean = false;
  date = new Date();
  dealsrList: any;
  dealsrListDocs: any;
  invoiceList: any;
  inovoiceListDocs: any;
  releases:any = [];
  release: any = [];
  jsondata: any;
  jsonobh: any;
  batchFilter:any;
  showFromData = false
  records: any;
  createInvoid: any;
  model: any;
  variant: any;
  invoiePreview: any;
  invoiePreviewDetails: any;
  invoicePreviewModelPop = false;


  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private auth: AuthService) { 
      this.auth.authFunction(window.location.pathname);
     }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      deviceModel: ['', Validators.required],
      variant: ['', Validators.required],
      pinno: ['', Validators.required,],
      dealer: ['', Validators.required],
      invoiceno: ['', Validators.required],
      invoiceDate : ['', Validators.required],
      dispatchDate: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
    this.getAllInvoice()
    this.dropdownData()
  }
  get f() { return this.form.controls; }

  dropdownData() {
    this.accountService.getAllModels()
    .pipe(first())
    .subscribe(model => {​​​​​
   
      this.model = model;
       this.model = this.model.docs.filter(it => it.status == 'Active');
          this.model.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title > b.title ? 1 : 0)
      });

    // this.accountService.getAllVariants()
    //   .pipe(first())
    //   .subscribe(variant => {
    //     this.variant = variant;
    //     this.variant =this.variant.docs;
    //   });

  }
  getVariant(){

    console.log(this.form.value.deviceModel);

    this.accountService.getVariantModel(this.form.value.deviceModel)
    .subscribe(variant => {
      this.variant = variant;

    });  

 }


getPinNoList(){
  this.batchFilter = {
    deviceModel:this.form.value.deviceModel,
    variant : this.form.value.variant
  } 
  console.log(this.batchFilter)
  this.accountService.getPinno(this.batchFilter)
  .subscribe(pin => {
    this.pin = pin;
    console.log(this.pin)
  });  
}

  getAllInvoice() {
    this.accountService.getAllInvoiceList().subscribe((data) => {
      this.invoiceList = data
      this.inovoiceListDocs = this.invoiceList.docs
    })
  }

  getInvoicPreview(i){
    this.invoicePreviewModelPop = true;
    this.invoiePreview = this.inovoiceListDocs[i];
    this.invoiePreviewDetails = this.invoiePreview.details
    console.log(this.invoiePreview);
    
    console.log(this.invoiePreviewDetails);
    
  }

 
  addInvoid() {
    this.releases = {
      deviceModel: this.form.value.deviceModel,
      variant: this.form.value.variant,
      pinno: this.form.value.pinno,
    };
    this.release.push(this.releases)
    this.showFromData = true
  }
  delete(v){
    this.release.pop(this.release[v])
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.records = {
        details : this.release,
        qty : this.release.length,
        dealer: this.form.value.dealer,
        invoiceno: this.form.value.invoiceno,
        shipdate : this.form.value.dispatchDate,
        invoicedate : this.form.value.invoiceDate,
        from : this.form.value.fromDate,
        to :  this.form.value.toDate
      }
      this.accountService.createInvoiceList(this.records).subscribe((invoice) => {
        this.createInvoid = invoice
        const buttonModal = document.getElementById("invoiceMode")
        buttonModal.click()
        this.getAllInvoice() 
      })
    }
  }
}
