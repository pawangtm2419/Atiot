import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Variant } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-variant',
  templateUrl: './variant.component.html',
  styleUrls: ['./variant.component.less']
})
export class VariantComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  variant = null;
  p: number = 1;
  searchText;
  form: FormGroup;
  submitted = false;
  loading = false;
  model = null;
  isEdit = false;
  editDeviceData: Variant;
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  isChecked;
  inActive = false;
  active = false;
  date = new Date();
  selectedRow : Number;
  setClickedRow : Function;
  deleteVar: Variant;

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private auth: AuthService) { 
      this.setClickedRow = function(index){
        this.selectedRow = index;
    }
    this.auth.authFunction(window.location.pathname);
    }

  ngOnInit() {
   this.getVariantData();
    this.dropdownData();

    // add variant
    this.form = this.formBuilder.group({
      deviceModel: ['', Validators.required],
      title: ['', Validators.required],
    });

  }

  getVariantData(){

    this.accountService.getAllVariants()
    .pipe(first())
    .subscribe(variant => {
      this.variant = variant;
    console.log("variant data ",this.variant)
     this.variant = this.variant.docs.filter(it => it.status == 'Active')
     this.inActive = true; 
    });
  }
  deleteVariant(id: string){
    this.accountService.deleteVariant(id).subscribe((data) => {
      this.deleteVar = data
      this.getVariantData()
    })
}

  inactiveRecords(event: any){

    if(event){
      this.inActive = false;
    this.accountService.getAllVariants()
    .pipe(first())
    .subscribe(variant => {this.variant = variant
      this.variant = this.variant.docs.filter(it => it.status == 'InActive');
      this.inActive = true;
    });

  }

  else {
    this.inActive = false;
    this.getVariantData();

  }
  

  }


  



  dropdownData() {
    this.accountService.getAllModels()
    .pipe(first())
    .subscribe(model => {​​​​​
   
      this.model = model;
       this.model = this.model.docs.filter(it => it.status == 'Active');
          this.model.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title > b.title ? 1 : 0)
    });

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
      this.updateVariant(this.id);
    }
    else {
      this.createVariant();

    }

  }



  addVariant() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;

  }

  createVariant() {

    this.accountService.newVariant(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Variants added successfully', { keepAfterRouteChange: true });
          // this.router.navigate(['../'], { relativeTo: this.route });
          this.closeButton.nativeElement.click();
          this.getVariantData();
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

      this.accountService.getByIdVariant(this.id)
        .subscribe(variant => {
          this.variant = variant;
          this.form.patchValue(this.variant);

        });
    }

  }




  updateVariant(id) {



    this.accountService.updateVariant(id, this.form.value)

      .subscribe(res => {
        this.alertService.success('Update successful', { keepAfterRouteChange: true });
        this.closeButton.nativeElement.click();
        this.getVariantData();
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
          this.closeButton.nativeElement.click();
        }

      );


  }


}





