import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-alertanalytics',
  templateUrl: './alertanalytics.component.html',
  styleUrls: ['./alertanalytics.component.less']
})
export class AlertanalyticsComponent implements OnInit {

  date = new Date();
  p: number = 1;
  searchText;
  stdate = JSON.parse(sessionStorage.getItem('alertData')).gte;
  endate = JSON.parse(sessionStorage.getItem('alertData')).lt;
  pinno = JSON.parse(sessionStorage.getItem('alertData')).pinno;
  data: { fromDate: any; toDate: any; pinno: any; };
  alertData: any;
  alertDataDocs: any;
  form: FormGroup;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getRecord();
    
    this.form = this.formBuilder.group({
      stdate: ['', Validators.required],
      endate: ['', Validators.required],
    });
  }

  getRecord() {
    this.data = {
      fromDate: this.stdate,
      toDate: this.endate,
      pinno: this.pinno,
    }
    console.log("Data === ", this.data)
    this.accountService.getAlertAnalytics(this.data)
      .subscribe((result) => {
        this.alertData = result;
        this.alertDataDocs = this.alertData
        console.log("alert Data Docs ===", this.alertDataDocs);

        if (this.alertDataDocs == undefined) {
          this.alertService.error("No Record Found Between ");
        }
      })
  }

  onSubmit() {
    this.data = {
      fromDate: this.form.value.stdate + "T00:00:00.000Z",
      toDate: this.form.value.endate + "T00:00:00.000Z",
      pinno: this.pinno,
    }
    console.log("Data === ", this.data)
    this.accountService.getAlertAnalytics(this.data)
      .subscribe((result) => {
        this.alertData = result;
        this.alertDataDocs = this.alertData
        console.log("alert date filter Data ===", this.alertDataDocs);

        if (this.alertDataDocs == undefined) {
          this.alertService.error("No Record Found Between ");
        }
      })
  }
}
