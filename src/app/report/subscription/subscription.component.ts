import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/internal/operators/first';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.less']
})
export class SubscriptionComponent implements OnInit {
  data1: any;
  subscriptionList: any;
  date = new Date();
  p: number = 1;
  searchText;
  status: any;

  constructor(private accountService: AccountService,private alertService: AlertService) { }

  ngOnInit(): void {
    this.createUserLOgs();
    this.getRecord();
  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"REPORT",
        "function":"SUBSCRIPTION",
        "type":"web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {    
         this.status=data['status'];
      },
        error => {
          this.alertService.error(error);
        })
    }
 
  getRecord() {
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName.toUpperCase(),
    }

    this.accountService.getSubscriptionReportCount(data1)
      .pipe(first())
      .subscribe((data) => {
        this.subscriptionList = data;
        this.subscriptionList = this.subscriptionList;
      })
  }
}
