import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AccountService, AlertService } from '@app/_services';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Master } from '@app/_models';
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
  constructor(
    private accountService: AccountService,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private http: HttpClient
  ) { }

  get f() { return this.form.controls; }
  get f1() { return this.deviceform.controls; }

  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  // @ViewChild('fileInput') fileInput;
  // @ViewChild('inputEl') inputEl;
  @ViewChild('fileInput')
  myInputVariable: ElementRef;

  // @ViewChild('fileInput') fileInput;
  comp = environment.companyID;
  message: string;
  fileToUpload: File = null;
  master = null;
  model = null;
  devices = null;
  variant = null;
  form: FormGroup;
  showMapping = false;
  showAddMachine = false;
  exceltoJson = {};
  deviceform: FormGroup;
  submitted = false;
  loading = false;
  p = 1;
  searchText;
  isEdit = false;
  editMachineData: Master;
  id: string;
  isChecked;
  inActive = false;
  active = false;
  arrayBuffer: any;
  itemsperpage = 50;
  file: File;
  deviceModel;
  date = new Date();
  deviceid: any;
  qrData: any;
  machineNo: string;
  qrCode = false;
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
  pinNo = environment.labelpinno;
  modeltext: string;
  disableDelete = false;
  devicetypeValue: string;
  status: any;
  noSpacePattern = '^(?=.*[0-9])(?=.*[A-Z])([A-Z0-9]+)$';
  isEditMode: boolean;
  showModal: boolean;

  ngOnInit(): void {
    this.createUserLOgs();
    if (JSON.parse(localStorage.getItem('user')).role === 'production') {
      this.showMapping = true;
      this.disableDelete = true;
    }
    if (JSON.parse(localStorage.getItem('user')).role === 'qainspector') {
      this.showAddMachine = true;
      this.disableDelete = true;
    }
    this.getDeviceName();
    this.getMachineData();
    // add machine
    this.dropdownData();
    this.form = this.formBuilder.group({
      deviceModel: ['', Validators.required],
      variant: ['', Validators.required],
      engineNumber: ['', Validators.required],
      pinno: ['', [Validators.required, Validators.pattern(this.noSpacePattern)]],
      batterylotno: ['', [Validators.required, Validators.pattern(this.noSpacePattern)]],
      manufacturingDate: ['', Validators.required],
      // deliveryDate: ['', Validators.required],
      // shipmentDate: ['', Validators.required],
      batteryInstallationDate: ['', Validators.required],
      createdDate: [''],
      createdBy: [''],
      updatedBy: [''],
      updatedAt: ['']
    });

    this.deviceform = this.formBuilder.group({
      deviceID: ['', Validators.required],
      devicetype: ['']
    });
  }
  createUserLOgs(): void {
    const params = {
      loginName: JSON.parse(localStorage.getItem('user')).loginName,
      module: 'MASTER',
      function: 'MACHINE',
      type: 'web'
    };
    this.accountService.createUserlogs(params).subscribe((data) => {
      this.status = data.status;
    },
      error => {
        this.alertService.error(error);
      });
  }
  getDeviceName(): void {
    this.accountService.getAllDevice().pipe(first()).subscribe(devices => {
      this.devices = devices;
      // this.devices = this.devices.filter(it => it.status === 'Active')
      this.inActive = true;
    });
  }
  filterItem(event: any): void {
    if (!event.inputType) {
      let deviceValue = [];
      deviceValue = event.target.value.split('-');
      this.devicetypeValue = deviceValue[deviceValue.length - 1];
      const selecteddeviceValue = deviceValue[0];
      this.modeltext = selecteddeviceValue;
      event.target.value = '';
    }
  }
  getMachineData(): void {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName
    };
    this.accountService.getAllMachines1(data1).subscribe(master => {
      this.master = master;
      this.master = this.master.docs.filter(it => it.status === 'Active');
      this.inActive = true;
    });
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
  public downloadMachineMaster(): void {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '../../../assets/files/machinemaster.xlsx');
    link.setAttribute('download', `machinemaster.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  public readFile(): void {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
      const bstr = arr.join('');
      this.workbook = XLSX.read(bstr, { type: 'binary' });
      this.sheet_names = this.workbook.SheetNames;
      this.sheetNameCount = this.workbook.SheetNames.length;
      this.sheet_name = this.sheet_names[0];
      const worksheet = this.workbook.Sheets[this.sheet_name];
    };
  }

  onFileSelect(fileInput: any): void {
    this.filesToUpload = (fileInput.target.files as Array<File>);
    this.file = fileInput.target.files[0];
    this.readFile();
  }

  uploadFile(): void {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    this.currentFile = files[0];
    formData.append('file', files[0]);
    formData.append('dataType', 'items');
    if (this.currentFile && this.sheetNameCount === 1 && this.sheet_name === 'machinemaster') {
      this.accountService.uploadMachineData(formData).subscribe(() => {
        this.alertService.success('File uploaded successfully', { keepAfterRouteChange: true });
        this.getMachineData();
        this.myInputVariable.nativeElement.value = '';
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    }
    else {
      this.myInputVariable.nativeElement.value = '';
      this.alertService.error('Please select valid file', { keepAfterRouteChange: true });
    }
  }

  inactiveRecords(event: any): void {
    if (event) {
      this.inActive = false;
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName: JSON.parse(localStorage.getItem('user')).loginName
      };
      this.accountService.getAllMachines1(data1).subscribe(master => {
        this.master = master;
        // this.master = this.master.docs.filter(it => it.status === 'Active');
        this.master = this.master.docs.filter(it => it.status === 'InActive');
        this.inActive = true;
      });
    }
    else {
      this.inActive = false;
      this.getMachineData();
    }
  }
  deleteMachine(id: string): void {
    const master = this.master.find(x => x.id === id);
    master.isDeleting = true;
    const result = window.confirm('Are you sure you want to delete the record?');
    if (result === true) {
      this.accountService.deleteMachineData(id).subscribe((data) => {
        this.deleteMachinedata = data;
        this.alertService.success('Machine deleted successfully', { keepAfterRouteChange: true });
        this.getMachineData();
      });
    }
    else {
      master.isDeleting = false;
    }

  }
  dropdownData(): void {
    this.accountService.getAllModels()
      .pipe(first())
      .subscribe(model => {

        this.model = model;
        this.model = this.model.docs.filter(it => it.status === 'Active');
        this.model.sort((a, b) => a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title > b.title ? 1 : 0);
        //  this.model.materialSelect();
      });
  }
  getVariant(): void {
    this.accountService.getVariantModel(this.form.value.deviceModel).subscribe(variant => {
      this.variant = variant;
    });
  }
  ondeviceSubmit(): void {
    this.submitted = true;
    this.alertService.clear();
    if (this.deviceform.invalid) {
      return;
    }
    this.loading = true;
    this.getMachineData();
    this.closeButton.nativeElement.click();
  }

  onSubmit(): void {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.isEditMode) {
      this.updateMachine1(this.id);
    } else {
      this.createMachine();
    }
  }
  addMachine(): void {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;
  }

  createMachine(): void {
    const createdAt = new Date();
    this.form.value.createdDate = this.datePipe.transform(createdAt, 'dd-MM-yyyy h:mm:ss');
    this.form.controls.createdBy.setValue(JSON.parse(localStorage.getItem('user')).loginName);
    this.accountService.newMC(this.form.value).subscribe((res) => {
      this.up = res;
      if (this.up.status === 'success') {
        this.alertService.success('Machine added successfully', { keepAfterRouteChange: true });
        this.getMachineData();
      } else {
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

  update(event, index, id): void {
    this.showModal = true;
    this.isEditMode = true;
    this.id = id;
    const ids = index;
    if (this.isEditMode) {
      this.accountService.getByIdMachine(this.id).subscribe(master => {
        this.master = master;
        this.form.patchValue(this.master);
        this.form.get('deviceModel').setValue(this.master.deviceModel);
        this.form.get('variant').setValue(this.master.variant);
        this.form.value.manufacturingDate.setValue(new Date(this.master.manufacturingDate));
      });
    }
  }

  mapCheck(deviceId, pinNo, id): void {
    this.modeltext = '';
    this.deviceform.controls.deviceID.setValue(null);
    if (deviceId) {
      this.deviceid = deviceId;
      this.pinNumber = pinNo;
      this.id = id;
      this.accountService.mapCheck(this.deviceid).subscribe(master => {
        this.check = master;
        this.checkedStatus = this.check.status;
      });
      if (this.checkedStatus === 'machine is mapped') {
        return this.alertService.error('machine is already mapped');
      }
    }
    else {
      this.checkedStatus = 'machine is not mapped';
      this.id = id;
      this.pinNumber = pinNo;
      this.getDeviceName();
    }
  }


  updateMachine1(id): void {
    const updatedDate = new Date();
    this.form.value.updatedAt = this.datePipe.transform(updatedDate, 'dd-MM-yyyy h:mm:ss');
    this.form.controls.updatedBy.setValue(JSON.parse(localStorage.getItem('user')).loginName);
    this.accountService.updateMachine(id, this.form.value).subscribe(res => {
      this.alertService.success('Updated successful', { keepAfterRouteChange: true });
      // this.router.navigate(['../../'], { relativeTo: this.route });
      this.closeButton.nativeElement.click();
      this.getMachineData();
    },
      error => {
        // this.alertService.error(error);
        this.loading = false;
        this.closeButton.nativeElement.click();
      });
  }

  update1(event, index, id): void {
    this.showModal = true;
    this.isEditMode = true;
    this.id = id;
    const ids = index;
    if (this.isEditMode) {
      this.accountService.getByIdDevice(this.id).subscribe(devices => {
        this.devices = devices;
        this.form.setValue(this.devices);
      });
    }
  }

  updateDeviceMapping(): void {
    this.deviceform.value.pinno = this.pinNumber;
    if (this.devicetypeValue === 'advance') {
      this.deviceform.value.devicetype = 'dvmap';
    }
    else if (this.devicetypeValue === 'basic') {
      this.deviceform.value.devicetype = 'dvmapb';
    } else {
      this.deviceform.value.devicetype = this.devicetypeValue;
    }
    const params = {
      deviceID: this.modeltext,
      devicetype: this.deviceform.value.devicetype,
      pinno: this.deviceform.value.pinno
    };
    this.accountService.updateDeviceMap(params).subscribe(res => {
      this.alertService.success('Update successful', { keepAfterRouteChange: true });
      // this.closeButton.nativeElement.click();
    },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }

  qrCodeGen(pinNo: string, model: string, mngDate: Date, engineNumber: string): void {
    this.qrCode = true;
    const mngDate1 = new Date(mngDate);
    const mgDate = mngDate1.getDate() + '-' + (1 + mngDate1.getMonth()) + '-' + mngDate1.getFullYear();
    this.qrData = model + ', ' + pinNo + ', ' + engineNumber + ', ' + mgDate;
    this.machineNo = pinNo;
  }
}
