import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit, Directive, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from '../home.component'
import { AccountService, AlertService } from '@app/_services';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-vmon',
  templateUrl: './vmon.component.html',
  styleUrls: ['./vmon.component.less']
})
export class VmonComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  date = new Date();
  form: FormGroup;
  monitordata: any;
  servicedata: any;
  p: number = 1;
  searchText;
  selectOne: string='active';
  pinNo=environment.labelpinno;


  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private homeComponent: HomeComponent) { }

  ngOnInit() {
    this.getMonitorData();
  }

  changeMonitor(){
    this.getMonitorData();
  }

  getMonitorData() {
    
    if(this.selectOne=='active')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getMonitorData(data1)
      .subscribe((data) => {
        this.monitordata = data
        this.monitordata = this.monitordata.countAnddetails.Activedetails;
    })
   }

    else if(this.selectOne=='inactive')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getMonitorData(data1)
      .subscribe((data) => {
        this.monitordata = data
        this.monitordata = this.monitordata.countAnddetails.InActivedetails;
      })
    }
   
  }

}
