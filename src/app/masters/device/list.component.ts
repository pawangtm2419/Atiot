import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';
import { DatePipe } from '@angular/common';
import { ExcelService, ExcelServiceXlsx } from '@app/_services/excel.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-device',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  @ViewChild('exampleModal7', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  @ViewChild('qrCode', { static: true }) exampleModalRef1: ElementRef;
  @ViewChild('fileInput')
  myInputVariable: ElementRef;
  filesToUpload: Array<File> = [];
  devices = null;
  p: number = 1;
  searchText;
  file: File;
  qrCode=false;
  arrayBuffer: any;
  form: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;
  editDeviceData: Device;
  showedit=false;
  showdelete=false;
  showButton=false;
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  showModal1: boolean;
  isChecked;
  inActive = false;
  active = false;
  date  = new Date();
  selectedRow : Number;
  setClickedRow : Function;
  currentFile: File;
  workbook: any;
  sheets: any;
  sheet_names: any;
  sheet_name: string;
  sheetNameCount: number;
  itemsperpage=50;
  status: any;
  qrData: string;
  deviceID: String;
  noSpacePattern="^(?=.*[0-9])(?=.*[0-9])([0-9]+)$";
  
  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private http: HttpClient,
    ) {
      this.setClickedRow = function(index){
        this.selectedRow = index;
        
    }
 
      
     }


  ngOnInit() {
    this.createUserLOgs();
    if(JSON.parse(localStorage.getItem('user')).role =='production')
    {
    this.showedit=true;
    this.showdelete=true;
    this.showButton=true;
    }
    else
    {
      this.showedit=false;
      this.showdelete=false;
      this.showButton=false;
    }

    this.getDeviceData();


    // add device
    this.form = this.formBuilder.group({
      deviceID: ['',[Validators.required,Validators.pattern(this.noSpacePattern)]],
      devicesim: ['',[Validators.required,Validators.pattern(this.noSpacePattern)]],
      category: ['', Validators.required],
      deviceinstallationDate: ['', Validators.required],
      devicereceiptDate: ['', Validators.required],
      deviceactivationqcDate: ['', Validators.required],
      createdDate:[''],
      createdBy:[''],
      updatedBy:[''],
      updatedAt:['']
    });
  }

  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"MASTER",
        "function":"DEVICE",
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
 
  getDeviceData(){
    this.accountService.getAllDevice2()
    .pipe(first())
    .subscribe(devices => {
      this.devices = devices;
      console.log(this.devices)
     this.devices = this.devices.docs.filter(it => it.status == 'Active')
     this.inActive = true; 
     
    });
  }
  // exportAsXLSX(): void {
  //  this.excelxlsxService.exportAsExcelFile(this.devices, 'DeviceMaster');
  // }
  inactiveRecords(event: any){

    if(event){
      this.inActive = false;
    this.accountService.getAllDevice2()
    .pipe(first())
    .subscribe(devices => {this.devices = devices
      this.devices = this.devices.docs.filter(it => it.status == 'InActive');
      this.inActive = true;
    });

  }

  else {
    this.inActive = false;
   this.getDeviceData();

  }
  

  }

  public downloadDeviceMaster() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '../../../assets/files/devicemaster.xlsx');
    link.setAttribute('download', `devicemaster.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  public readFile() {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      this.workbook = XLSX.read(bstr, { type: "binary" });
      this.sheet_names = this.workbook.SheetNames;
      this.sheetNameCount = this.workbook.SheetNames.length;
      this.sheet_name = this.sheet_names[0];
      var worksheet = this.workbook.Sheets[this.sheet_name];
  
    }
  }

  onFileSelect(fileInput: any) {

    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.file = fileInput.target.files[0];
    this.readFile();
  }

  uploadFile() {
    const formData = new FormData;
    const files: Array<File> = this.filesToUpload;
    console.log(files);
    this.currentFile = files[0];
 
    formData.append("file",files[0]);
    formData.append("dataType",'items');
  
    console.log(formData);
  
    if (this.currentFile && this.sheetNameCount == 2 && this.sheet_name == "devicemaster") {
      //this.readFile();
    
      this.accountService.uploadDeviceData(formData).subscribe(
        files => {
          console.log('files', files);
          this.alertService.success('File uploaded successfully', { keepAfterRouteChange: true });
          this.getDeviceData();
          this.myInputVariable.nativeElement.value = "";
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      )
    }
    else {
      this.myInputVariable.nativeElement.value = "";
      this.alertService.error('Please select valid file', { keepAfterRouteChange: true });
    }
  }



  deleteDevice(id: string) {
    const user = this.devices.find(x => x.id === id);
    user.isDeleting = true;
    let result = window.confirm("Are you sure you want to delete the record?")
    if (result == true) {
    this.accountService.deletedevice(id).subscribe((data) => {
      this.devices = data
      this.alertService.success('Device deleted successfully', { keepAfterRouteChange: true });
      this.getDeviceData();
    })
    }
    else{
      user.isDeleting = false;
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
      this.updateDevice(this.id);
    }
    else {
      this.loading = false;
      this.createDevice();

    }

  }





  addDevice() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;
  }

  createDevice() {
    var createdDate=new Date();
    this.form.value.createdDate=this.datePipe.transform(createdDate,'dd-MM-yyyy h:mm:ss');
    this.form.controls['createdBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);
    this.accountService.newDevice(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Device added successfully', { keepAfterRouteChange: true });
          // this.router.navigate(['../'], { relativeTo: this.route });
          this.getDeviceData();
          const btn = document.getElementById('closeBtn');
          btn.click();
          document.getElementById("closeBtn2").click();
         
      //    $('#myModal').modal('hide')
          console.log(this.form.value)
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });


  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
 }
 



  update(event, index, id) {
    this.showModal = true;
    this.isEditMode = true;
    this.id = id;



    let ids = index;
    if (this.isEditMode) {
      this.loading = false;
      this.accountService.getByIdDevice(this.id)
        .subscribe(devices => {

          this.devices = devices;
          this.devices.deviceinstallationDate=this.datePipe.transform(this.devices.deviceinstallationDate,'dd-MM-yyyy');
          this.form.patchValue(this.devices);
          this.form.value.deviceinstallationDate.setValue(this.devices.deviceinstallationDate);

        });
    }

  }




  updateDevice(id) {
    var updatedDate=new Date();
    this.form.value.updatedAt=this.datePipe.transform(updatedDate,'dd-MM-yyyy h:mm:ss');
    this.form.controls['updatedBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);
    this.accountService.updateDevice(id, this.form.value)

      .subscribe(res => {

        this.alertService.success('Update successful', { keepAfterRouteChange: true });
        // this.router.navigate(['../../'], { relativeTo: this.route });
        const btn = document.getElementById('closeBtn');
        btn.click();
        this.getDeviceData();
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }

      );

    //this.closeButton.nativeElement.click();
  }
  qrCodeGen(deviceID: String, devicereceiptDate: Date, category: string) {
    this.showModal1=true;
    this.qrCode = true;
    var mngDate = new Date(devicereceiptDate);
    var mgDate = mngDate.getDate()+'-'+(1+mngDate.getMonth())+'-'+mngDate.getFullYear();
    // var mgDate = mngDate.getDate()+'-'+mngDate.getMonth()+'-'+mngDate.getFullYear();
    this.qrData = deviceID+', '+mgDate+', '+category;
    this.deviceID = deviceID;
  }


}



