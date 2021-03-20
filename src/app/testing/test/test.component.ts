import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, UsermanagemntService } from '@app/_services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ExcelService, ExcelServiceXlsx } from '../../_services/excel.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.less']
})
export class TestComponent implements OnInit {
  device: number = 1;
  p: number = 1;
  searchText;
  date = new Date();
  form: FormGroup;
  submitted = false;
  loading = false;
  dataQA: any;
  dataQATest: any;
  today: Date;
  fromDate: string;
  toDate: string;
  startDate: string;
  endDate: string;
  timeBetween: any;
  dataQADocs: any;
  dataQaTestDocs: any;
  devicenumberOnClicked: any;
  varantCode: any;
  aqTestForDataId: any;
  dataQATestRowData: any;
  dataQaTesRowDatatDocs: any;

  trFormatedData = true;
  trRowData = false;

  machinedata = false;
  batchdata = false;
  consumptiondata = false;
  formateAndRowDatashow = false;

  rowDataArray: any;
  msg: string;
  type: any;
  shoxlsxbtn: boolean;
  batchDatas: any;
  batchDatadocs: any;
  consumptionDatas: any;
  consumptionDatadocs: any;
  actualRowData: any;
  dataRow: any;
  selectedRow : Number;
  setClickedRow : Function;
  constructor(private accountServices: AccountService,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private datePipe: DatePipe,
  ) {  this.setClickedRow = function(index){
    this.selectedRow = index;

}}

  ngOnInit() {

    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd') + "T00:00:00.000Z";
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z";
    this.startDate = this.fromDate.toString(),
      this.endDate = this.toDate.toString()

    this.getQAData();
    this.form = this.formBuilder.group({
      type : '',
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

  }
  get f() { return this.form.controls; }
  getQAData() {
    this.timeBetween = {
      gte: this.startDate,
      lt: this.endDate
    }
    this.accountServices.getQAData(this.timeBetween).subscribe((data) => {
      this.dataQA = data
      if (this.dataQA.status == 'Device has empty data') {
        this.alertService.error(this.dataQA.status);
        this.loading = false;
      } else {
        this.dataQADocs = this.dataQA.docs
        console.log("Data QA Docs ",this.dataQADocs);
        
      }

    })
  }
  getReportQATestForMachineData(deviceID, deviceModel, type) {
    this.formateAndRowDatashow = true;
    this.type = type;
    this.dataQaTestDocs = '';
    this.varantCode = deviceModel;
    this.aqTestForDataId = '5fe2e88d7cc3536c2c7bf2d9';
    this.devicenumberOnClicked = deviceID
    
     this.msg = "Machine Data - Device No : "+deviceID+" - Model : "+deviceModel;

     this.machinedata = true;
     this.batchdata = false;
     this.consumptiondata = false;


    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt :this.form.value.endDate + "T00:00:00.000Z",
      deviceID: deviceID
    }
    this.accountServices.getReportQATestForData(this.timeBetween).subscribe((data) => {
      this.dataQATest = data
      this.dataQaTestDocs = this.dataQATest.docs
      console.log("QA Test for data ",this.dataQATest)
      this.getReportQATestForRowData();
    })
  }
  getReportQATestForRowData() {
    console.log(this.timeBetween)
    this.accountServices.getReportQATestForRowDataAPI(this.timeBetween).subscribe((data) => {
      this.dataQATestRowData = data
      this.dataQaTestDocs = this.dataQATestRowData.docs
       
      // console.log(this.dataQATestRowData)
      // this.dataRow = this.actualRowData.rawData

      // this.rowDataArray = this.dataRow.replace('[', '').replace(']', '').split(',');
      // console.log(this.rowDataArray)
      // console.log(this.dataQaTestDocs.length)

      var rowDataArray = [];
      for (var i = 0; i < this.dataQaTestDocs.length; i++) {
        rowDataArray.push({
          rowData: this.dataQaTestDocs[i].rawData.replace('[', '').replace(']', '').split(',')
        })
      }
      this.actualRowData = rowDataArray;
      console.log(this.actualRowData);
    })
  }

  getReportQATestForBatchData(deviceID, deviceModel, id,type) {
    this.formateAndRowDatashow = false;
    this.type = type;
    this.dataQaTestDocs = '';
    this.varantCode = deviceModel;
    this.aqTestForDataId = '5fe2e88d7cc3536c2c7bf2d9';
    this.devicenumberOnClicked = deviceID

    this.msg = "Batch Data - Device No : "+deviceID+" - Model : "+deviceModel;

    this.machinedata = false;
     this.batchdata = true;
     this.consumptiondata = false;
   
    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      deviceID: this.devicenumberOnClicked
    }
    this.accountServices.getBatchData(this.timeBetween).subscribe((data) => {
      this.batchDatas = data
      this.batchDatadocs = this.batchDatas.docs
      console.log("Batch ", this.batchDatas)
      this.getReportQATestForRowData();

    })
  }
  getReportQATestForCunsumptinoData(deviceID, deviceModel, id,type){
    this.formateAndRowDatashow = false;
    this.type = type;
    this.dataQaTestDocs = '';
    this.varantCode = deviceModel;
    this.aqTestForDataId = '5fe2e88d7cc3536c2c7bf2d9';
    this.devicenumberOnClicked = deviceID;

    this.msg = "Cunsumption Data - Device No : "+deviceID+" - Model : "+deviceModel;

    this.machinedata = false;
     this.batchdata = false;
     this.consumptiondata = true;
  
    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      deviceID: this.devicenumberOnClicked
    }
    this.accountServices.getConsumptionData(this.timeBetween).subscribe((data) => {
      this.consumptionDatas = data
      this.consumptionDatadocs = this.consumptionDatas.docs
      console.log("consumptions ",this.consumptionDatas);
      this.getReportQATestForRowData();
    })
  }

  onSubmit() {
    this.submitted = true;


    if (this.form.invalid) {
      return;
    }else if(this.form.value.type == 'report'){
      this.timeBetween = {
        gte: this.form.value.startDate + "T00:00:00.000Z",
        lt :this.form.value.endDate + "T00:00:00.000Z",
        deviceID: this.aqTestForDataId
      }
      console.log(this.timeBetween);
      
      this.accountServices.getReportQATestForData(this.timeBetween).subscribe((data) => {
        this.dataQATest = data
        this.dataQaTestDocs = this.dataQATest.docs
        console.log(this.dataQaTestDocs)
        this.getReportQATestForRowData();
      })
    }else if(this.form.value.type == 'batch'){
      this.timeBetween = {
        gte: this.form.value.startDate + "T00:00:00.000Z",
        lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
        deviceID: this.devicenumberOnClicked
      }
      console.log(this.timeBetween);
      
      this.accountServices.getBatchData(this.timeBetween).subscribe((data) => {
        this.batchDatas = data
        this.batchDatadocs = this.batchDatas.docs
        console.log("Batch ", this.batchDatas)
        this.getReportQATestForRowData();
  
      })
    }else if(this.form.value.type == 'consumption'){
      this.timeBetween = {
        gte: this.form.value.startDate + "T00:00:00.000Z",
        lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
        deviceID: this.devicenumberOnClicked
      }
      console.log(this.timeBetween);
      
      this.accountServices.getConsumptionData(this.timeBetween).subscribe((data) => {
        this.consumptionDatas = data
        this.consumptionDatadocs = this.consumptionDatas.docs
        console.log("consumptions ",this.consumptionDatas);
        this.getReportQATestForRowData();
      })
    }else{
      this.timeBetween = {
        gte: this.form.value.startDate + "T00:00:00.000Z",
        lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z"
      }
      this.accountServices.getQAData(this.timeBetween).subscribe((data) => {
        this.loading = true;
        this.dataQA = data
        if (this.dataQA.status == 'Device has empty data') {
          this.alertService.error(this.dataQA.status);
          this.loading = false;
        } else {
          this.dataQADocs = this.dataQA.docs
          this.loading = false;
          console.log(this.dataQADocs)
        }
  
      })
    }

  }

  formatedData() {
    this.shoxlsxbtn = true;
    this.trFormatedData = true;
    this.trRowData = false;
  }
  rowData() {
    this.trFormatedData = false;
    this.trRowData = true;
    this.shoxlsxbtn = false;
  }

  exportAsXLSX(): void {
    this.excelxlsxService.exportAsExcelFile(this.dataQADocs, 'QA_Testing');
  }
  exportAsXLSXMachine(): void {
    this.excelxlsxService.exportAsExcelFile(this.dataQaTestDocs, 'QA_Machine');
  }
}

