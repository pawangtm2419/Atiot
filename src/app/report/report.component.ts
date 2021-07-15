import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExcelService, ExcelServiceXlsx } from '../_services/excel.service';
import { AuthService } from '@app/_services/auth.service';
import { DatePipe } from '@angular/common';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  model = null;
  p: number = 1;
  searchText;
  date = new Date();
  pinNo=environment.labelpinno;
  form: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;
  reportListExcel=[];

  id: string;
  isEditMode: boolean;
  showModal: boolean;
  batchData: any;
  batchFilter: any;
  dateRange: any;
  batchDatadocs: any;
  reportList: any;
  public reportListDocs: any =[];
  public stage: string;
  timeBetween: {useType: any; loginName: any; };
  today = new Date();
  fromDate: string;
  toDate: string;
  startDate: any;
  endDate: any;
  dealerCode: any;
  pinNumber: any;
  customers:any;
  Customerform: FormGroup;
  customerlist: any;
  isInvalid=true;
  status: any;
  
  get f1() { return this.Customerform.controls }

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
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
    this.createUserLOgs();
    this.Customerform = this.formBuilder.group({
      customerID: ['', Validators.required],
      vehicleNo:['',Validators.required],
      subscriptionMonths: ['12 months', Validators.required]
    })
    this.onSubmit();
  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"REPORT",
        "function":"VEHICLE",
        "type":"web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {    
         this.status=data['status'];
         console.log("status",this.status);
      },
        error => {
          this.alertService.error(error);
        })
    }

  onCustomerSubmit() {
    
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.Customerform.invalid) {
      return;
    }

   // this.isInvalid = false;
  //  this.getMachineData();
    this.closeButton.nativeElement.click();


    // if (this.isEditMode) {
    //  }
    // else {
    //   this.createDevice();

    // }

  }
  mapCheck(dealerID, pinNo, id) {
    
  //  this.Customerform.reset();
    if (dealerID) {
      this.dealerCode = dealerID;
      this.pinNumber = pinNo;
      this.id = id;
      this.Customerform.controls["vehicleNo"].setValue(this.pinNumber);
     // this.Customerform.value.vehicleNo= this.pinNumber;
      this.accountService.getCustomerListById(this.dealerCode)
      .pipe(first())
      .subscribe(result => {
        
        this.customerlist = result;
        this.customers=this.customerlist.docs;
      //   this.customers = this.customers.filter(it => it.isActive =='true')
      //  this.inActive = true;
      });
    console.log(this.customers);
    }
  }

  updateCustomerMapping(){
    debugger
   let customer = [];
   customer =this.Customerform.value.customerID.split(" ");
    let selectedCustomer = customer[customer.length - 1];
    //this.Customerform.value.vehicleNo.se
    let subscription = [];
    subscription = this.Customerform.value.subscriptionMonths.split(" ");
    let selectedmonth = subscription[0];
    const data1 = {
      customerCode:selectedCustomer,
      pinno:this.Customerform.value.vehicleNo,
      subscriptionMonths: selectedmonth
    }
    this.accountService.assignCustomer(data1)
      .subscribe(res => {
        console.log(res);
        this.alertService.success('Customer assigned Sucessfully', { keepAfterRouteChange: true });
         this.closeButton.nativeElement.click();
         this.onSubmit();
         //this.Customerform.reset();
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
    console.log("saving device data");
  }

  getStageInfo()
   {
     
    if (this.reportListDocs)
     {
      this.reportListDocs.forEach((ele, index) => {
        if(ele.customerCode && ele.type) {
          ele.stage = "4.Customer Assigned"
          return false;
        } 
        else if(ele.dealerCode && ele.type) {
          ele.stage = "3.Dealer Assigned"
          return false;
        }
        else if(ele.deviceID && ele.type=="dvmap" && !ele.dealerCode) {
          ele.stage = "2.Machine Mapped"
          return false;
        }
        else if(!ele.deviceID) {
          ele.stage = "1.Yet to Map"
          return false;
        }
        else
        {
          ele.stage="";
        }
      })
    }
  }
  exportAsCSV(): void {
    this.excelService.exportAsExcelFile(this.reportListDocs, 'Vehicle_Report');
  }

  exportAsXLSX(): void {
    this.excelxlsxService.exportAsExcelFile(this.reportListExcel, 'Vehicle_Report');
  }

  onSubmit() {
    debugger
    this.submitted = true;
    this.timeBetween = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    }
 
    this.accountService.getVehicleReportList(this.timeBetween).subscribe((data) => {
      this.reportList = data;
      if (this.reportList) {
        this.reportListDocs = this.reportList.docs;
        this.getStageInfo();
        this.reportListDocs.forEach(element => {
          this.reportListExcel.push({
            'Device Model':element.deviceModel,
            'Device ID':element.deviceID,
            'Variant':element.variant,
            'Machine No.':element.pinno,
            'Engine No.':element.engineNumber,
            'Manufacturing Date':element.manufacturingDate,
            'Machine Type':element.machineType,
            'CBC Transpose':element.cbcTranspose,
            'Battery Lot No.':element.batterylotno,
            'Delivery Date':element.deliveryDate,
            'Battery Installation Date':element.batteryInstallationDate,
            'Type':element.type,
            'Created at':element.createdDate,
            'Device Activation QC Date':element.deviceactivationqcDate,
            'Device Installation Date':element.deviceinstallationDate,
            'Vehicle Name':element.vehicleNumber,
            'Dealer Code':element.dealerCode,
            'Customer Code':element.customerCode,
            'Stage':element.stage
          })
        });
        console.log("Report lIst", this.reportList);
        this.reportListDocs = _.sortBy(this.reportListDocs, (o) => moment["default"](o.createdAt)).reverse();
 
      }
      else {
        this.alertService.error("No Record Found Between " + this.form.value.startDate + " To " + this.form.value.endDate);
      }
 
    })
  }

} 
