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
  formateAndRowDatashow = false;
  rowDataArray: any;
  msg: string;
  msg1:string;
  type: any;
  shoxlsxbtn=false;
  batchDatas: any;
  batchDatadocs: any;
  actualRowData: any;
  actualRowData1: any;
  dataRow: any;
  selectedRow: Number;
  setClickedRow: Function;
  hideModal: boolean = true;
  machineExcelData=[];
  itemsperpage=50;
  itemsperpage1=50;
  itemsperpage2=50;
  itemsperpage3=50;
  trRowUnmappedData=false;
 
  dataQADocs1:any;
  QAUnmappedData: any;
  selected2: string='Mapped Devices';
  actualUnmappedRawData: any;
  actualUnmappedRawData1: any;
  dataQATestUnmappedRawData: any;
  dataQaTestUnmappedDocs: any;
  trRowUnmappedData1=false;

  constructor(private accountServices: AccountService,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private datePipe: DatePipe,
  ) {
    this.setClickedRow = function (index) {
      this.selectedRow = index;

    }
  }

  ngOnInit() {
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd') + "T00:00:00.000Z";
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z";
    this.startDate = this.fromDate.toString(),
      this.endDate = this.toDate.toString()
    
      this.getQAData();
    
      this.getQAUnmappedData();
    this.form = this.formBuilder.group({
      type: '',
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

  }
  get f() { return this.form.controls; }
  select2(event: any) {
    this.selected2 = event.target.value;
    if (this.selected2 == "Mapped Devices") {
      this.getQAData();
    }
    else if (this.selected2 == "Unmapped Devices")
    {
      this.getQAUnmappedData();
    }
  }
  getQAData() {
    this.loading = true;
    this.timeBetween = {
      gte: this.startDate,
      lt: this.endDate
    }
    this.accountServices.getReportQATestMappedData(this.timeBetween).subscribe((data) => {
      this.dataQA = data
      if (this.dataQA.status == 'Device has empty data') {
        this.alertService.error(this.dataQA.status);
        this.clearAlert();
        this.loading = false;
      } else {
        this.dataQADocs = this.dataQA.array
        console.log("Data QA Docs ", this.dataQADocs);

      }

    })
  }

  getQAUnmappedData(){
    
        this.accountServices.getReportQATestUnmappedData()
        .pipe(first())
        .subscribe(result => {
          this.QAUnmappedData = result;
        });
      }

      getReportQAUnmappedRawData(deviceID){
        
        this.trRowUnmappedData = true;
        this.msg1="Raw Data - Device No : " + deviceID;
        this.loading = true;
          this.actualUnmappedRawData = [];
          this.actualUnmappedRawData1 = [];
          this.dataQATestUnmappedRawData=[];
          let params={
            deviceID:deviceID
          }
          this.accountServices.getReportQATestUnmappedRawData(params).subscribe((data) => {
            this.loading = false;
            this.dataQATestUnmappedRawData = data
            if (this.dataQATestUnmappedRawData.status == 'Device has empty data') {
              this.alertService.error(this.dataQATestUnmappedRawData.status);
              this.clearAlert();
              this.loading = false;
              this.dataQATestUnmappedRawData = [];
            }
            if(this.dataQATestUnmappedRawData) {
              this.dataQaTestUnmappedDocs = this.dataQATestUnmappedRawData;
              this.actualUnmappedRawData = [];
              this.actualUnmappedRawData1 = [];
              var rowDataArray1 = [];
              for (var i = 0; i < this.dataQaTestUnmappedDocs.length; i++) {
                rowDataArray1.push({
                  rowData: this.dataQaTestUnmappedDocs[i].rawData.replace('[', '').replace(']', '').split(',')
                })
              }
              rowDataArray1.forEach(element => {
                if (element.rowData.length == 47) {
                   this.actualUnmappedRawData1 = rowDataArray1;
                   this.actualUnmappedRawData = [];
                }
                else {
                   this.actualUnmappedRawData = rowDataArray1;
                   this.actualUnmappedRawData1 = [];
                }
    
              }
              );
             
            }
          })
      }
  getReportQATestForMachineData(deviceID, deviceModel, type) {
    
    this.hideModal = false;
    this.trFormatedData = true;
    this.trRowData=false;
    this.formateAndRowDatashow = true;
    this.shoxlsxbtn=true;
    this.type = type;
    this.dataQaTestDocs = [];
    this.varantCode = deviceModel;
    this.aqTestForDataId = '5fe2e88d7cc3536c2c7bf2d9';
    this.devicenumberOnClicked = deviceID
    this.msg = "Machine Data - Device No : " + deviceID + " - Model : " + deviceModel;
    this.machinedata = true;
    this.batchdata = false;
    this.loading = true;
    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T00:00:00.000Z",
      deviceID: deviceID
    }
    this.accountServices.getQATestMachineData(this.timeBetween).subscribe((data) => {
      this.loading = false;
      this.dataQATest = data
      if(data) {
        if (this.dataQATest.status == 'Device has empty data') {
          this.alertService.error(this.dataQATest.status);
          this.clearAlert();
          this.batchdata = false;
          this.hideModal = true;
        } else {
          this.dataQaTestDocs = this.dataQATest.docs
          this.dataQaTestDocs.forEach(element => {
            if(element.extras)
            {
              element.extras.forEach(element1 => {
                this.machineExcelData.push(
                  {
                    'Date & Time':element.devicePublishTime,
                    'Latitude':element.lat,
                    'Longitude':element.lng,
                    'Power Source':element1.powerSource,
                    'Battery Level(Volts)':element1.batteryLevel,
                    'Fuel Level':element1.fuelLevel,
                    'Coolant Temp':element1.coolantTemp,
                    'Oil Pressure(bar)':element1.oilpressure,
                    'Ignition Status(Volts)':element1.ignitionStatus,
                    'RPM':element1.rpm,
                    'Parking Switch':element1.parkingSwitch,
                    'Hydraulic Oil Filter':element1.hydralicOilFilterChoke,
                  }
                )
              });
            
            }
          });
        
          this.hideModal = false;
        }
      }
      
    })
  }

  clearData() {
    this.hideModal = true;
  }
  getReportQATestForRowData() {
    
    this.loading = true;
    this.shoxlsxbtn = false;
  //  if (this.machinedata == true) {
      this.actualRowData = [];
      this.actualRowData1 = [];
      this.dataQaTestDocs = [];
      this.accountServices.getQATestMachineData(this.timeBetween).subscribe((data) => {
        this.loading = false;
        this.dataQATestRowData = data
        if (this.dataQATestRowData.status == 'Device has empty data') {
          this.alertService.error(this.dataQATest.status);
          this.clearAlert();
          this.loading = false;
          this.dataQaTestDocs = [];
        }
        else {
          this.dataQaTestDocs = this.dataQATestRowData.docs;
          this.actualRowData = [];
          this.actualRowData1 = [];
          var rowDataArray = [];
          for (var i = 0; i < this.dataQaTestDocs.length; i++) {
            rowDataArray.push({
              rowData: this.dataQaTestDocs[i].rawData.replace('[', '').replace(']', '').split(',')
            })
          }
          rowDataArray.forEach(element => {
            if (element.rowData.length == 47) {
               this.actualRowData1 = rowDataArray;
               this.actualRowData = [];
            }
            else {
              this.actualRowData = rowDataArray;
              this.actualRowData1 = [];
            }

          }
          );
          console.log("rowData",this.actualRowData1)
        }
      })
   // }

  }

  getReportQATestForBatchData(deviceID, deviceModel, type) {
   
    this.formateAndRowDatashow=false;
    this.batchDatadocs = [];
    this.machinedata=false;
    this.batchdata = true;
    this.type = type;
    this.shoxlsxbtn = false;
    this.varantCode = deviceModel;
    this.aqTestForDataId = '5fe2e88d7cc3536c2c7bf2d9';
    this.devicenumberOnClicked = deviceID;
    this.loading = true;
    this.msg = "Batch Data - Device No : " + deviceID + " - Model : " + deviceModel;
    this.timeBetween = {
      gte: this.form.value.startDate + "T00:00:00.000Z",
      lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
      deviceID: this.devicenumberOnClicked
    }
    this.accountServices.getQATestBatchData(this.timeBetween).subscribe((data) => {
      this.loading = false;
      this.batchDatas = data
      if (this.batchDatas.status == 'Device has empty data') {
        this.loading = false;
        this.batchdata = false;
        this.hideModal = true;
        this.batchDatadocs = [];
        this.alertService.error(this.batchDatas.status);
        this.clearAlert();
        
      } 
      else {
        this.batchdata = true;
        this.batchDatadocs = this.batchDatas.docs;
        this.loading = false;
        this.hideModal = false;
      }
    })
  }


  onSubmit() {
    this.submitted = true;


    if (this.form.invalid) {
      return;
    } else if (this.form.value.type == 'report') {
      this.batchdata = false;
      this.machinedata = true;
      this.trRowData=false;
      this.trFormatedData = true;
      this.shoxlsxbtn=true;
      this.dataQaTestDocs = [];
      this.timeBetween = {
        gte: this.form.value.startDate + "T00:00:00.000Z",
        lt: this.form.value.endDate + "T00:00:00.000Z",
        deviceID: this.aqTestForDataId
      }
      console.log(this.timeBetween);
      this.loading = true;
      this.accountServices.getQATestMachineData(this.timeBetween).subscribe((data) => {
        this.loading = false;
        this.formateAndRowDatashow = true;
        this.dataQATest = data
        if (this.dataQATest.status == 'Device has empty data') {
          this.alertService.error(this.dataQATest.status);
          this.clearAlert();
          this.loading = false;
          this.batchdata = false;
        } else {
          this.dataQaTestDocs = this.dataQATest.docs
            this.dataQaTestDocs.forEach(element => {
            if(element.extras)
            {
              element.extras.forEach(element1 => {
                this.machineExcelData.push(
                  {
                    'Date & Time':element.devicePublishTime,
                    'Latitude':element.lat,
                    'Longitude':element.lng,
                    'Power Source':element1.powerSource,
                    'Battery Level(Volts)':element1.batteryLevel,
                    'Fuel Level':element1.fuelLevel,
                    'Coolant Temp':element1.coolantTemp,
                    'Oil Pressure(bar)':element1.oilpressure,
                    'Ignition Status(Volts)':element1.ignitionStatus,
                    'RPM':element1.rpm,
                    'Parking Switch':element1.parkingSwitch,
                    'Hydraulic Oil Filter':element1.hydralicOilFilterChoke,
                  }
                )
              });
            
            }
          });
          console.log(this.dataQaTestDocs)
          this.loading = false;
          this.machinedata = true;
          // if (this.trRowData == true) {
          //   this.actualRowData = [];
          //   this.actualRowData1 = [];
          //   this.getReportQATestForRowData();
          // }
        }

        //this.getReportQATestForRowData();
      })
    } else if (this.form.value.type == 'batch') {
      this.formateAndRowDatashow = false;
      this.loading = true;
      this.batchDatadocs = [];
      this.batchdata = true;
      this.machinedata = false;
      this.shoxlsxbtn = false;
      // this.trRowData=false;
      this.timeBetween = {
        gte: this.form.value.startDate + "T00:00:00.000Z",
        lt: this.form.value.endDate + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z",
        deviceID: this.devicenumberOnClicked
      }
      console.log(this.timeBetween);

      this.accountServices.getQATestBatchData(this.timeBetween).subscribe((data) => {
        this.loading = false;
        this.batchDatas = data
        if (this.batchDatas.status == 'Device has empty data') {
          this.batchDatadocs = [];
          this.hideModal=true;
          this.alertService.error(this.batchDatas.status);
          this.clearAlert();
          this.loading = false;
          this.machinedata = false;
        } else {
          this.batchDatadocs = this.batchDatas.docs
          console.log("Batch ", this.batchDatas)
          this.loading = false;
          this.batchdata = true;

        }

        // this.getReportQATestForRowData();

      })
    }

  }

  formatedData() {
    this.shoxlsxbtn = true;
    this.trFormatedData = true;
    //this.trFormatedData1 = true;
    this.trRowData = false;
    this.formateAndRowDatashow=true;
  }
  rowData() {
    this.trFormatedData = false;
    this.trRowData = true;
    this.shoxlsxbtn = false;
    this.actualRowData = [];
    this.actualRowData1 = [];
    this.getReportQATestForRowData();
  }

  exportAsXLSX(): void {
    this.excelxlsxService.exportAsExcelFile(this.dataQADocs, 'QA_Testing');
  }
  exportAsXLSXMachine(): void {
      this.excelxlsxService.exportAsExcelFile(this.machineExcelData, 'QA_Machine');
   
  }
  clearAlert() {
    setTimeout(() => {
      this.alertService.clear();
    }, 4000);
  }
}

