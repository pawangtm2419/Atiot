import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-non-iot',
  templateUrl: './non-iot.component.html',
  styleUrls: ['./non-iot.component.less']
})
export class NonIotComponent implements OnInit {
  nonIotCount: any;
  date = new Date();
  searchText;
  p: number = 1;
  pinNo=environment.labelpinno;
  status: any;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.createUserLOgs();
    this.getNonIot();

  }

  
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"REPORT",
        "function":"NON_IOT",
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
  getNonIot(){
    // const data1 = {
    //   useType: JSON.parse(localStorage.getItem('user')).useType,
    //   loginName:JSON.parse(localStorage.getItem('user')).loginName
    //  }
    this.accountService.getNonIotReport()
    .subscribe(data => {
      this.nonIotCount = data
      this.nonIotCount = this.nonIotCount.docs
      console.log("nonIotCount", this.nonIotCount)
    });
  }

}
