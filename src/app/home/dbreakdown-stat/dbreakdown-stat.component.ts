import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-dbreakdown-stat',
  templateUrl: './dbreakdown-stat.component.html',
  styleUrls: ['./dbreakdown-stat.component.less']
})
export class DbreakdownStatComponent implements OnInit {

  p: number = 1;
  date = new Date();
  searchText;
  data:any;
  useType:any;
  loginName:any;
  breakdownCount :any;

  constructor(private accountService: AccountService) { }
  ngOnInit(): void {
  this.getRecord();
  }

  getRecord() {
    // debugger
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName.toUpperCase()
    }
    this.accountService.getBreakdownStatisticsCount(data1)
      .subscribe((data) => {
        this.breakdownCount = data;
        this.breakdownCount = this.breakdownCount.Details;

        console.log("Breakdown List ====", this.breakdownCount);

        // this.trackdocs = _.sortBy(this.trackdocs, (o) => moment["default"](o.createdAt)).reverse();
        // if (this.trackdocs == undefined) {
        //   this.alertService.error("No Record Found Between " + this.datePipe.transform(this.today, 'yyyy-MM-dd') + " To " + this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
        // }

      })
  }
}
