import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { environment } from '@environments/environment';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-non-iot',
  templateUrl: './non-iot.component.html',
  styleUrls: ['./non-iot.component.less']
})
export class NonIotComponent implements OnInit {
  // @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  // @ViewChild('fileInput')

  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;

  myInputVariable: ElementRef;
  filesToUpload: Array<File> = [];
  nonIotCount: any;
  file: File;
  currentFile: File;
  date = new Date();
  loading = false;
  searchText;
  p = 1;
  pinNo = environment.labelpinno;
  status: any;
  arrayBuffer: any;
  workbook: any;
  sheets: any;
  sheet_names: any;
  sheet_name: string;
  sheetNameCount: number;
  qrCode: boolean;
  qrData: string;
  machineNo: String;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createUserLOgs();
    this.getNonIot();

    this.fileUploadForm = this.formBuilder.group({
      myfile: ['']
    });

  }


  createUserLOgs() {
    const params = {
      loginName: JSON.parse(localStorage.getItem('user')).loginName,
      module: 'REPORT',
      function: 'NON_IOT',
      type: 'web'
    };
    this.accountService.createUserlogs(params).subscribe((data) => {
      this.status = data.status;
      console.log('status', this.status);
    },
      error => {
        this.alertService.error(error);
      });
  }
  getNonIot() {
    // const data1 = {
    //   useType: JSON.parse(localStorage.getItem('user')).useType,
    //   loginName:JSON.parse(localStorage.getItem('user')).loginName
    //  }
    this.accountService.getNonIotReport()
      .subscribe(data => {
        this.nonIotCount = data;
        this.nonIotCount = this.nonIotCount.docs;
        console.log('nonIotCount', this.nonIotCount);
      });
  }


  public downloadDemoFile() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '../../../assets/files/machinemaster2827.xlsx');
    link.setAttribute('download', `machinemaster2827.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  onFileSelect(event) {
    const af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // console.log(file);

      if (!_.includes(af, file.type)) {
        alert('Only EXCEL Docs Allowed!');
      } else {
        this.fileInputLabel = file.name;
        this.fileUploadForm.get('myfile').setValue(file);
      }
    }
  }


  onFormSubmit() {

    if (!this.fileUploadForm.get('myfile').value) {
      alert('Please fill valid details!');
      return false;
    }

    const formData = new FormData();
    formData.append('file', this.fileUploadForm.get('myfile').value);
    // formData.append('agentId', '007');


    this.http
      .post<any>('http://172.16.15.30:4000/noniot/noniotExcelData', formData).subscribe(response => {
        console.log('response ===', response);
        if (response.status == 200) {
          // Reset the file input
          this.alertService.success('File uploaded successfully', { keepAfterRouteChange: true });
          this.getNonIot();
          this.uploadFileInput.nativeElement.value = '';
          this.fileInputLabel = undefined;
        }
        else if (response.status == 400) {
          this.alertService.error('The pinno should be unique. !!!', { keepAfterRouteChange: true });
        }
        else
        {
          this.alertService.error('Somthing went wrong !!!', { keepAfterRouteChange: true });
        }
      }, error => {
        console.log('error is ==', error);
        this.alertService.error('Somthing went wrong !!!', { keepAfterRouteChange: true });
      });
  }
  qrCodeGen(pinNo: string, model: string, mangDate: string, engineNumber: string): void {
    this.qrCode = true;
    const mngDate = new Date(mangDate);
    const mgDate = mngDate.getDate() + '-' + (1 + mngDate.getMonth()) + '-' + mngDate.getFullYear();
    // var mgDate = mngDate.getDate()+'-'+mngDate.getMonth()+'-'+mngDate.getFullYear();
    this.qrData = model + ', ' + pinNo + ', ' + engineNumber + ', ' + mgDate;
    this.machineNo = pinNo;
  }

}
