import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-drun-hours',
  templateUrl: './drun-hours.component.html',
  styleUrls: ['./drun-hours.component.less']
})
export class DrunHoursComponent implements OnInit {

  selectCount:string='fiftyCount';
  selectCount2:string='fiftyCount';
  selectCount3:string='fiftyCount';
  fiftyCountData:any;
  fiftyplusCount:any;
  onefiftyplusCount:any;
  countData: any;
  date = new Date();
  currentCountData : any;
  currentYCountData : any;
  p: number = 1;
  searchText;
  selected: string = 'lastmonth';
pinNo=environment.labelpinno;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.getLastRunHour();
    this.getCurrentRunHour();
    this.getCurrentYRunHour();
  }

  select(event: any) {
    //update the ui
    this.selected = event.target.value;
  }

  changeLastMonth(){
    this.getLastRunHour();
  }

  changeCurrentMonth(){
    this.getCurrentRunHour();
  }

  changeCurrentYear(){
    this.getCurrentYRunHour();
  }

  getLastRunHour() {
    
    if(this.selectCount=='fiftyCount')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      
      this.accountService.getLastMonthCountInner(data1)
      .pipe(first())
      .subscribe((data) => {
        this.fiftyCountData = data;
        this.countData = this.fiftyCountData.fiftydetails;
        console.log("fiftyCountdata", this.countData);
    })
   }

   else if(this.selectCount=='fiftyplusCount')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      
      this.accountService.getLastMonthCountInner(data1)
      .pipe(first())
      .subscribe((data) => {
        this.fiftyplusCount = data;
        this.countData = this.fiftyplusCount.fiftyplussdetails;
        console.log("fiftyplusCount", this.countData);
    })
   }

   else if(this.selectCount=='onefiftyplusCount')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      
      this.accountService.getLastMonthCountInner(data1)
      .pipe(first())
      .subscribe((data) => {
        this.onefiftyplusCount = data;
        this.countData = this.onefiftyplusCount.onefiftyplussdetails;
        console.log("onefiftyplusCount", this.countData);
    })
   }
   
  }

  getCurrentRunHour() {
    
    if(this.selectCount2=='fiftyCount')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      
      this.accountService.getCurrentMonthCountInner(data1)
      .pipe(first())
      .subscribe((data) => {
        this.fiftyCountData = data;
        this.currentCountData = this.fiftyCountData.fiftydetails;
        console.log("fiftyCountdata", this.currentCountData);
    })
   }

   else if(this.selectCount2=='fiftyplusCount')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      
      this.accountService.getCurrentMonthCountInner(data1)
      .pipe(first())
      .subscribe((data) => {
        this.fiftyplusCount = data;
        this.currentCountData = this.fiftyplusCount.fiftyplussdetails;
        console.log("fiftyplusCount", this.currentCountData);
    })
   }

   else if(this.selectCount2=='onefiftyplusCount')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      
      this.accountService.getCurrentMonthCountInner(data1)
      .pipe(first())
      .subscribe((data) => {
        this.onefiftyplusCount = data;
        this.currentCountData = this.onefiftyplusCount.onefiftyplussdetails;
        console.log("onefiftyplusCount", this.currentCountData);
    })
   }
   
  }

  getCurrentYRunHour() {
    
    if(this.selectCount3=='fiftyCount')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      
      this.accountService.getCurrentYearCountInner(data1)
      .pipe(first())
      .subscribe((data) => {
        this.fiftyCountData = data;
        this.currentYCountData = this.fiftyCountData.fiftydetails;
        console.log("fiftyCountdata", this.currentYCountData);
    })
   }

   else if(this.selectCount3=='fiftyplusCount')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      
      this.accountService.getCurrentYearCountInner(data1)
      .pipe(first())
      .subscribe((data) => {
        this.fiftyplusCount = data;
        this.currentYCountData = this.fiftyplusCount.fiftyplussdetails;
        console.log("fiftyplusCount", this.currentYCountData);
    })
   }

   else if(this.selectCount3=='onefiftyplusCount')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      
      this.accountService.getCurrentYearCountInner(data1)
      .pipe(first())
      .subscribe((data) => {
        this.onefiftyplusCount = data;
        this.currentYCountData = this.onefiftyplusCount.onefiftyplussdetails;
        console.log("onefiftyplusCount", this.currentYCountData);
    })
   }
   
  }
}
