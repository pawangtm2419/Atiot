import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Customer, Master } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.less']
})
export class CustomerComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  customer: any;
  p: number = 1;
  searchText;
  form: FormGroup;
  submitted = false;
  isEdit = false;
  editMachineData: Customer;
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  loading: boolean = false;
  date = new Date();
  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private auth: AuthService) { 
      this.auth.authFunction(window.location.pathname);
    }

  ngOnInit() {
  
      this.getCustomerData();
    this.form = this.formBuilder.group({


      loginName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['AGEX2345']

      



    });
  


  }

  getCustomerData(){
    this.accountService.getAllCustomer()
    .pipe(first())
    .subscribe(customer => {

      this.customer = customer;
      this.customer = this.customer.docs;
    });
  }

  deleteUser(id: string) {
    const user = this.customer.find(x => x.id === id);
    user.isDeleting = true;
    this.accountService.delete(id)
      .pipe(first())
      .subscribe(() => this.customer = this.customer.filter(x => x.id !== id));
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
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.updateCustomer(this.id);
    }
    else {
      this.createcustomer();

    }


  }


  addcustomer() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;

  }

  createcustomer() {

    console.log(this.form.value);
    this.accountService.newCustomer(this.form.value)

      .subscribe(res => {
        console.log(res);
        this.alertService.success('Customer added successfully', { keepAfterRouteChange: true });
        // this.router.navigate(['../'], { relativeTo: this.route });
        this.closeButton.nativeElement.click();
        this.getCustomerData();
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
