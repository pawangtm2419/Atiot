import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';
import { ExcelService, ExcelServiceXlsx } from '@app/_services/excel.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.less']
})
export class ModelComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  model = null;
  p: number = 1;
  searchText;

  form: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;
  editDeviceData: Model;
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  isChecked;
  inActive = false;
  active = false;
  date = new Date();
  selectedRow : Number;
  setClickedRow : Function;
  deleteMod: Model[];
  modelExcelData=[];
  status: any;
  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
   ) { 
      this.setClickedRow = function(index){
        this.selectedRow = index;

    }
  
    }

  ngOnInit() {
   this.createUserLOgs();
    this.getModelData();

    this.form = this.formBuilder.group({

      title: ['', Validators.required],


    });
  }

  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"MASTER",
        "function":"MODEL",
        "type":"web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {    
         this.status=data['status'];
      },
        error => {
          this.alertService.error(error);
        })
    }
  getModelData(){
    this.accountService.getAllModels()
    .pipe(first())
    .subscribe(model => {
      this.model = model;
     this.model = this.model.docs.filter(it => it.status == 'Active')
     this.inActive = true; 
     this.model.forEach(element => {
      this.modelExcelData.push({
        "Model":element.title,
        "Created On":new Date(element.createdAt),
        "Status":element.status     
      });
     });  
    });
  }

  exportAsXLSX(): void {
    this.excelxlsxService.exportAsExcelFile(this.modelExcelData, 'ModelMaster');
   }

  inactiveRecords(event: any){

    if(event){
      this.inActive = false;
    this.accountService.getAllModels()
    .pipe(first())
    .subscribe(model => {this.model = model
      this.model = this.model.docs.filter(it => it.status == 'InActive');
      this.inActive = true;
    });

  }

  else {
    this.inActive = false;
   this.getModelData();

  }
  

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
      this.loading = false;
      this.updateModel(this.id);
      this.submitted = false;
    }
    else {
      this.loading = false;
      this.createModel();
      this.submitted = false;

    }

  }

  addModel() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;
    // this.master=null
  }

  createModel() {  
    this.accountService.newModel(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Model added successfully', { keepAfterRouteChange: true });
          // this.router.navigate(['../'], { relativeTo: this.route });
          this.closeButton.nativeElement.click();
          this.getModelData();
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
      this.loading = false;
      this.accountService.getByIdModel(this.id)
        .subscribe(model => {
          this.model = model;
          this.form.patchValue(this.model);

        });
    }

  }


  deleteModel(id: string){
    let result = window.confirm("Are you sure you want to delete the record?")
    if (result == true) {
      this.accountService.deleteModel(id).subscribe((data) => {
        this.deleteMod = data
        this.alertService.success('Model deleted successfully', { keepAfterRouteChange: true });
        this.getModelData()
      })
    }
}

  updateModel(id) {

    this.accountService.updateModel(id, this.form.value)

      .subscribe(res => {

        this.alertService.success('Update successful', { keepAfterRouteChange: true });
        // this.router.navigate(['../../'], { relativeTo: this.route });
        this.closeButton.nativeElement.click();
        this.getModelData();
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
          this.closeButton.nativeElement.click();
        }

      );


  }



}
