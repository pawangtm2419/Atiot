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
    const data1 = {
      useType: JSON.parse(localStorage.getItem('user')).useType,
      loginName: JSON.parse(localStorage.getItem('user')).loginName.toUpperCase()
    }
    this.accountService.getBreakdownStatisticsCount(data1)
      .subscribe((data) => {
        this.breakdownCount = data;
        this.breakdownCount = this.breakdownCount.Details;
      })
  }
}
