import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { AccountService, AlertService, UsermanagemntService} from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Customer, Dealer, Master } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';
import { ExcelService, ExcelServiceXlsx } from '@app/_services/excel.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.less']
})
export class CustomerComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  customer : any;
  Custpassword=environment.dpass;
  p: number = 1;
  searchText;
  form: FormGroup;
  submitted = false;
  isEdit = false;
  inActive = false;
  active = false;
  isChecked;
  editMachineData: Customer;
  id: string;
  isEditMode: boolean;
  stateCode;
  showModal: boolean;
  loading: boolean = false;
  date = new Date();
  dealer: any;
 // dealercode:any;
  registerCustomer:any;
  deletecustomerData: Object;
  customerExcelData=[];
  selectedDealer:any;
  textsadasdasd: any;
  newDealer: any;
  status: any;
  constructor(private accountService: AccountService,
    private usermanagementService: UsermanagemntService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private excelxlsxService: ExcelServiceXlsx,
    private excelService: ExcelService
  ) { 
    
    }

  ngOnInit() {
    this.createUserLOgs();
    console.log("hello world".split(" ").slice(-1)[0])
      this.getCustomerData();
      this.getAlldealers();
    this.form = this.formBuilder.group({


      loginName: ['', Validators.required],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      dealerName:['', Validators.required],
     dealercode: ['', Validators.required],
 stateCode:['',Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: ['', Validators.required],
      segmentation:['',Validators.required],
      password:['']
    });

  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"MASTER",
        "function":"CUSTOMER",
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
 
  getAlldealers() {
    this.usermanagementService.getAlldealers()
      .pipe(first())
      .subscribe(dealer => {
        this.dealer = dealer
        this.dealer = this.dealer.docs;
       // this.dealercode=this.form.value.dealerName.split(" ").slice(-1)[0];
        this.dealer.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name > b.name ? 1 : 0)
        console.log(this.dealer)
      });

  }

  getState(event) {
    if(event){
    this.dealer.forEach(element => {
      if(element.name == event.target.value) {
        this.newDealer = element;
    this.form.controls['stateCode'].setValue(this.newDealer.stateCode);
    this.selectedDealer=this.newDealer.code;
      }
    });
  }
  else{
    this.form.controls['stateCode'].setValue('');
  }
    console.log(this.newDealer);
  }
  

  getCustomerData(){
    this.accountService.getAllCustomer()
    .pipe(first())
    .subscribe(customer => {

      this.customer = customer;
      this.customer = this.customer.docs.filter(it => it.isActive == true);
      this.customer.forEach(element => {
        this.customerExcelData.push({
          "Username":element.firstName + ' ' + element.lastName,
          "Login Name":element.loginName,
          "Dealer Code":element.userDealer,
          "Dealer Name":element.dealerName,
          "Address":element.address,
          "Contact":element.phone,
          "Status":(element.isActive==true?'Active':'Inactive'),
          "Segmentation":element.segmentation,
          "Created On":new Date(element.createdAt)
        })
      });
      console.log("true ",this.customer)
    });
  }

  inactiveRecords(event: any){

    if(event){
      this.inActive = false;
    this.accountService.getAllCustomer()
    .pipe(first())
    .subscribe(customer => {this.customer = customer
      this.customer = this.customer.docs.filter(it => it.isActive == false);
      this.inActive = true;
    });

  }

  else {
    this.inActive = false;
   this.getCustomerData();

  }
  

  }
  exportAsXLSX(): void {
    this.excelxlsxService.exportAsExcelFile(this.customerExcelData, 'CustomerMaster');
  }

  deletecustomer(id: string) {
    const user = this.customer.find(x => x.id === id);
    user.isDeleting = true;
    
    let result = window.confirm("Are you sure you want to delete the record?")
    if (result == true) {
      this.accountService.removeCustomerRow(id).subscribe((data) => {
        this.deletecustomerData = data
        this.alertService.success('Customer deleted successfully', { keepAfterRouteChange: true });
        this.getCustomerData()
      })
    }
    else {
      user.isDeleting = false;
    }
  } 

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

 
    this.loading = true;

    if (this.isEditMode) {
      this.updateCustomer(this.id);
      this.loading = false;
    }
    else {
      this.createcustomer();
      this.loading = false;
    }


  }


  addcustomer() {
    this.showModal = true;
    this.form.reset();
    this.isEditMode = false;
    this.submitted = false;

  }

  createcustomer() {
    // let dealer = [];
    // dealer = this.form.value.dealerName.split(" ");
    // let selectedDealer = dealer[dealer.length - 1];
    this.registerCustomer ={
      loginName: this.form.value.loginName,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      dealercode:this.selectedDealer,
     stateCode: this.form.value.stateCode,
      address:this.form.value.address,
      password:this.Custpassword,
      city:this.form.value.city,
      phone:this.form.value.phone,
      email:this.form.value.email,
      segmentation:this.form.value.segmentation
     }
     console.log("form value",this.registerCustomer);
    this.accountService.newCustomer(this.registerCustomer)

      .subscribe(res => {
        console.log(res);
        this.alertService.success('Customer added successfully', { keepAfterRouteChange: true });
        // this.router.navigate(['../'], { relativeTo: this.route });
        this.closeButton.nativeElement.click();
        this.getCustomerData();
       // this.form.reset();
      },
        error => {
          this.alertService.error(error);
          this.closeButton.nativeElement.click();
        }
      );

  }





  update(event, index, id) {

    this.showModal = true;
    this.isEditMode = true;
    this.id = id;



    let ids = index;
    if (this.isEditMode) {

      this.accountService.getByIdCustomer(this.id)
        .subscribe(customer => {
          console.log(customer);
          this.customer = customer;
          this.form.patchValue(this.customer);

        });
    }

  }



  updateCustomer(id) {



    console.log(id)
    this.accountService.updateCustomer(id, this.form.value)

      .subscribe(res => {

        this.alertService.success('Update successful', { keepAfterRouteChange: true });
        this.closeButton.nativeElement.click();
        this.getCustomerData();
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }

      );



  }
}
