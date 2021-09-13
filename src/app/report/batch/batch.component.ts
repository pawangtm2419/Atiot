import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.less']
})
export class BatchComponent implements OnInit {

  today: Date;
  fromDate: string;
  toDate: string;
  startDate: string;
  
  form: FormGroup;
  loading = false;
  isEdit = false;
  endDate: string;
  date = new Date();
  p: number = 1;
  searchText;
  data: any;
  batchList: any;
  snum: any;
  pinno: any;
  useType: any;
  loginName: any;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private alertService: AlertService) { }

  ngOnInit(): void {
    
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    
    this.getRecord();  
  }

  getRecord() {
    this.useType = JSON.parse(localStorage.getItem('user')).useType;
    this.loginName = JSON.parse(localStorage.getItem('user')).loginName;
    this.loginName = this.loginName.toUpperCase( );
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 30);
    this.fromDate = this.datePipe.transform(this.today, 'yyyy-MM-dd') + "T00:00:00.000Z";
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + "T" + this.datePipe.transform(new Date(), 'HH:mm:ss') + ".000Z";
    this.startDate = this.fromDate.toString();
    this.endDate = this.toDate.toString();

    this.data = {
      fromDate: this.startDate,
      toDate: this.endDate,
      loginName:this.loginName,
      useType:this.useType,
    }

    this.accountService.getBatchReport(this.data)
      .subscribe((data) => {
        this.batchList = data,
          this.batchList = this.batchList;
        });
  }

  onSubmit2()
  {
    if (this.form.invalid) {
      return;
    }
    else {
      this.useType = JSON.parse(localStorage.getItem('user')).useType;
      this.loginName = JSON.parse(localStorage.getItem('user')).loginName;
      this.loginName = this.loginName.toUpperCase( );
      this.data = {
        fromDate: this.form.value.startDate,
        toDate: this.form.value.endDate,
        loginName:this.loginName,
        useType:this.useType,
      };
      this.accountService.getBatchReport(this.data)
        .subscribe((data) => {
          this.batchList = data,
            this.batchList = this.batchList;
        })
    }
  }

}
