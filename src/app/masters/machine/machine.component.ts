import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AccountService, AlertService } from '@app/_services';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Master } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';
import { ExcelService, ExcelServiceXlsx } from '../../_services/excel.service';
import * as XLSX from 'xlsx';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.less'],
  providers: [DatePipe]
})

export class MachineComponent implements OnInit {

  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  // @ViewChild('fileInput') fileInput;
  // @ViewChild('inputEl') inputEl;
  @ViewChild('fileInput')
  myInputVariable: ElementRef;

  //@ViewChild('fileInput') fileInput;  
  comp = environment.companyID;
  message: string;
  fileToUpload: File = null;
  master = null;
  model = null;
  devices = null;
  variant = null;
  form: FormGroup;
  showMapping=false;
  qrCode=false;
  showAddMachine=false;
  exceltoJson = {};
  deviceform: FormGroup;
  submitted = false;
  loading = false;
  p: number = 1;
  searchText;
  isEdit = false;
  editMachineData: Master;
  id: string;
  isChecked;
  inActive = false;
  active = false;
  arrayBuffer: any;
  itemsperpage=50;
  file: File;
  deviceModel;
  date = new Date()
  deviceid: any;
  check: any;
  up: any;
  downloadFile: any;
  checkedStatus: any;
  pinNumber: string;
  deleteMachinedata: any;
  machineMaster: any;
  formData: any;
  filesToUpload: Array<File> = [];
  progress = 0;
  currentFile: File;
  workbook: any;
  sheets: any;
  sheet_names: any;
  sheet_name: string;
  sheetNameCount: number;
  pinNo=environment.labelpinno;
  modeltext: string;
  disableDelete=false;
  devicetypeValue: string;
  status: any;
  qrData: any;
  // http: any;
  // fileformat: any;
  // fileContent: any;
  // fileInputLabel: string;


  constructor(private accountService: AccountService,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private http: HttpClient) {
  
  }


  ngOnInit() {
    this.createUserLOgs();
    if(JSON.parse(localStorage.getItem('user')).role =='production')
    {
      this.showMapping=true;
      this.disableDelete=true;
    }
    if(JSON.parse(localStorage.getItem('user')).role =='qainspector')
    {
      this.showAddMachine=true;
      this.disableDelete=true;
    }
    this.getDeviceName()
    this.getMachineData();
    //add machine
    this.dropdownData();
    this.form = this.formBuilder.group({
      deviceModel: ['', Validators.required],
      variant: ['', Validators.required],
      engineNumber: ['', Validators.required],
      pinno: ['', Validators.required],
      batterylotno: ['', Validators.required],
      manufacturingDate: ['', Validators.required],
      // deliveryDate: ['', Validators.required],
     //  shipmentDate: ['', Validators.required],
      batteryInstallationDate: ['', Validators.required]
    });

    this.deviceform = this.formBuilder.group({
      deviceID: ['', Validators.required],
      devicetype:['']
    })
  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"MASTER",
        "function":"MACHINE",
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
  getDeviceName() {
    debugger
    this.accountService.getAllDevice()
      .pipe(first())
      .subscribe(devices => {
        
        this.devices = devices;
        // this.devices = this.devices.filter(it => it.status == 'Active')
        this.inActive = true;
      });
    console.log(this.devices);
  }
  filterItem(event) {
    debugger
    if (!event.inputType) {
      let deviceValue = [];
      deviceValue =event.target.value.split("-");
      this.devicetypeValue=deviceValue[deviceValue.length-1]
      let selecteddeviceValue =deviceValue[0];
      this.modeltext =selecteddeviceValue;
      event.target.value = "";
    }
  }
  getMachineData() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName:JSON.parse(localStorage.getItem('user')).loginName
     }
    this.accountService.getAllMachines1(data1) .subscribe(master => {
      this.master = master
      this.master = this.master.docs.filter(it => it.status == 'Active');
      this.inActive = true;
      console.log("machine data", this.master)
    });
  }
  // getMachineData() {
  //   this.accountService.getAllMachines1()
  //     .pipe(first())
  //     .subscribe(master => {
  //       ;
  //       this.master = master
  //       this.master = this.master.docs.filter(it => it.status == 'Active');
  //       this.inActive = true;
  //       console.log("machine data", this.master)
  //     });
  // }
  // $(document).ready(function() {
  //   $('.mdb-select').materialSelect();
  //   });

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
  public downloadMachineMaster() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '../../../assets/files/machinemaster.xlsx');
    link.setAttribute('download', `machinemaster.xlsx`);
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
    


    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    console.log(files);
    this.currentFile = files[0];
 
    formData.append("file", files[0]);
    formData.append("dataType", 'items');
  
    console.log(files[0]);
  
    if (this.currentFile && this.sheetNameCount == 1 && this.sheet_name == "machinemaster") {
      //this.readFile();

      this.http.post('http://103.149.113.100:8035/masters/data/upload/machinemaster', formData).subscribe(
        files => {
          console.log('files', files);
          this.alertService.success('File uploaded successfully', { keepAfterRouteChange: true });
          this.getMachineData();
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


  // inactiveRecords(event: any) {

  //   if (event) {
  //     this.inActive = false;
  //     this.accountService.getAllMachines1()
  //       .pipe(first())
  //       .subscribe(master => {
  //         this.master = master
  //         this.master = this.master.docs.filter(it => it.status == 'InActive');
  //         this.inActive = true;
  //       });

  //   }
  //   else {
  //     this.inActive = false;
  //     this.getMachineData();
  //   }
  // }

  inactiveRecords(event: any) {
debugger
    if (event) {
      this.inActive = false;
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
       }
      this.accountService.getAllMachines1(data1) .subscribe(master => {
        this.master = master
       // this.master = this.master.docs.filter(it => it.status == 'Active');
        this.master = this.master.docs.filter(it => it.status == 'InActive');
        this.inActive = true;
        console.log("machine data", this.master)
      });
    }
    else {
      this.inActive = false;
      this.getMachineData();
    }
  }
  // deleteUser(id: string) {
  //   
  //   const master = this.master.find(x => x.id === id);
  //   master.isDeleting = true;
  //   this.accountService.deleteMachine(id)
  //     .pipe(first())
  //     .subscribe(() => this.master = this.master.filter(x => x.id !== id));
  // }

deleteMachine(id: string) {
    const master = this.master.find(x => x.id === id);
    master.isDeleting = true;
    let result = window.confirm("Are you sure you want to delete the record?")
    if (result == true) {
      this.accountService.deleteMachineData(id).subscribe((data) => {
        this.deleteMachinedata = data
        this.alertService.success('Machine deleted successfully', { keepAfterRouteChange: true });
        this.getMachineData()
      })
    }
    else {
      master.isDeleting = false;
    }
 
  }
  dropdownData() {
    this.accountService.getAllModels()
      .pipe(first())
      .subscribe(model => {

        this.model = model;
        this.model = this.model.docs.filter(it => it.status == 'Active');
        this.model.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title > b.title ? 1 : 0)
        //  this.model.materialSelect();
      });
  }

  get f() { return this.form.controls; }
  get f1() { return this.deviceform.controls }
  getVariant() {


    this.accountService.getVariantModel(this.form.value.deviceModel)
      .subscribe(variant => {
        this.variant = variant;

      });

  }
  ondeviceSubmit() {
    ;
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.deviceform.invalid) {
      return;
    }

    this.loading = true;
    this.getMachineData();
    this.closeButton.nativeElement.click();

    // if (this.isEditMode) {
    //  }
    // else {
    //   this.createDevice();

    // }

  }

  onSubmit() {
    ;
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      // this.update();
      this.updateMachine1(this.id);
    }
    else {
      this.createMachine();

    }


  }





  isEditMode: boolean;
  showModal: boolean;
  addMachine() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;

  }


  // addDevice() {
  //   this.showModal = true;
  //   this.isEditMode = false;
  //   this.form.reset();
  //   this.submitted = false;
  // }

  // createDevice() {

  //   
  //   this.accountService.newDevice(this.form.value)
  //     .subscribe(res => {
  //       console.log(res);
  //       this.alertService.success('Device added successfully', { keepAfterRouteChange: true });
  //       this.closeButton.nativeElement.click();
  //       this.getDeviceName();
  //     },
  //       error => {
  //         this.alertService.error(error);
  //         this.loading = false;
  //       }
  //     );


  // }

  createMachine() {

    this.accountService.newMC(this.form.value)
      .subscribe((res) => {
        console.log(res);

        this.up = res

        if (this.up.status == "success") {
          this.alertService.success('Machine added successfully', { keepAfterRouteChange: true });
          this.getMachineData();
        }
        else {
          this.alertService.error('Machine already created', { keepAfterRouteChange: true });

        }
        this.closeButton.nativeElement.click();
        this.loading = false;

      },
        err => {
          this.alertService.error(err);
          this.loading = false;
        }
      );

  }







  update(event, index, id) {
    
    this.showModal = true;
    this.isEditMode = true;
    this.id = id;
    let ids = index;
    if (this.isEditMode) {
      this.accountService.getByIdMachine(this.id)
        .subscribe(master => {
          console.log(ids);
          
          this.master = master;
          this.form.patchValue(this.master);
          this.form.get('deviceModel').setValue(this.master.deviceModel);
          this.form.get('variant').setValue(this.master.variant);
          this.form.value.manufacturingDate.setValue(new Date(this.master.manufacturingDate));
          console.log(this.form)
        });
    }

  }

  mapCheck(deviceId, pinNo, id) {
      this.modeltext='';
      this.deviceform.controls['deviceID'].setValue(null);
      if (deviceId) {
        this.deviceid = deviceId;
        this.pinNumber = pinNo;
        this.id = id;
        this.accountService.mapCheck(this.deviceid)
          .subscribe(master => {
            console.log(master);
            this.check = master
            this.checkedStatus = this.check.status
  
          });
        if (this.checkedStatus === "machine is mapped") {
          return this.alertService.error("machine is already mapped")
        }
        // else {
        //   this.id=id;
        //   this.checkedStatus = 'machine is not mapped'
        //   this.getDeviceName();
        //   this.updateDeviceMapping();
        // }
      }
      else {
        this.checkedStatus = 'machine is not mapped'
        this.id = id;
        this.pinNumber = pinNo;
        this.getDeviceName();
      }
  }


  updateMachine1(id) {
    
    this.accountService.updateMachine(id, this.form.value)

      .subscribe(res => {
        console.log(res);
        this.alertService.success('Updated successful', { keepAfterRouteChange: true });
        // this.router.navigate(['../../'], { relativeTo: this.route });
        this.closeButton.nativeElement.click();
        this.getMachineData();
      },
        error => {
          console.log(error)
          // this.alertService.error(error);
          this.loading = false;
          this.closeButton.nativeElement.click();
        }

      );


  }

  update1(event, index, id) {
    debugger
    this.showModal = true;
    this.isEditMode = true;
    this.id = id;



    let ids = index;
    if (this.isEditMode) {

      this.accountService.getByIdDevice(this.id)
        .subscribe(devices => {

          this.devices = devices;
          this.form.setValue(this.devices);
        });
    }
  }

  updateDeviceMapping() {
    debugger
    this.deviceform.value.pinno = this.pinNumber;
    if(this.devicetypeValue == "advance")
    {
      this.deviceform.value.devicetype = "dvmap";
    }
    else if(this.devicetypeValue == "basic")
    {
      this.deviceform.value.devicetype = "dvmapb";
    }
    else
    {
      this.deviceform.value.devicetype = this.devicetypeValue;
    }
   let params =
   {
     "deviceID":this.modeltext,
     "devicetype":this.deviceform.value.devicetype,
     "pinno":this.deviceform.value.pinno
   }
    this.accountService.updateDeviceMap(params)
      .subscribe(res => {
        console.log(res);
        this.alertService.success('Update successful', { keepAfterRouteChange: true });
        // this.closeButton.nativeElement.click();
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
    console.log("saving device data");
  }

  /*  closeModal(modal){
    document.querySelector('#'+ modal).classList.remove('md-show');
  }
  closeMyModal(event){
   ((event.target.parentElement).parentElement).classList.remove('md-show');
  } 
 */

  qrCodeGen(model: String, mngDate: Date, engineNumber: string) {
    this.qrCode = true;
    this.qrData = model+', '+mngDate+', '+engineNumber;
  }

}