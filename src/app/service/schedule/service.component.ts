import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/_services/auth.service';


@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.less']
})
export class ServiceComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  model = null;
  p: number = 1;
  searchText;
  date = new Date();

  form: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;

  id: string;
  isEditMode: boolean;
  showModal: boolean;
  batchData: any;
  batchFilter: any;
  dateRange: any;
  batchDatadocs: any;
  pinno: any;
  deviceModel: any;
  registerService: any;
  returnData: any;
  snum: any;
  enhr: any;

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private auth: AuthService) {
    this.auth.authFunction(window.location.pathname);
  }

  selected: string = '';

  //event handler for the select element's change event
  select(event: any) {
    //update the ui
    this.selected = event.target.value;
  }

  ngOnInit() {
    this.accountService.getUpcomingServices()
      .pipe(first())
      .subscribe(model => {
        this.model = model
        console.log("models", model)
      });


    this.form = this.formBuilder.group({
      title: '',
      dmodel: '',
      pinno: '',
      enhr: [''],
      serviceNumber: ['', Validators.required],
      serveng: [''],
      scheduledCompletionDate: ['', Validators.required],
      serviceengineer: "serviceengineer",
      serviceengineerid: "servicenegineerid2",
      status: "open",
      serviceType: "paid",
      gdate: [''],



    });
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
    this.RegisterService();
  }
  register(pinno,enhr,snum, deviceModel) {
    //  alert(pinno);
    this.snum = snum
    this.enhr = enhr
    console.log("Engine Hour ",enhr)
    console.log("service number ",snum)
    this.pinno = pinno
    this.deviceModel = deviceModel
  }

  RegisterService() {
    console.log(typeof this.form.value);
    this.registerService ={
      serviceengineer: 'abcd',
      servicenegineerid: "servicenegineerid",
      scheduledCompletionDate: this.form.value.scheduledCompletionDate,
      serviceNumber: this.form.value.serviceNumber,
      serviceType:"paid",
      status:"close"
     }
    console.log(this.registerService);

    // return
    
    this.accountService.newService(this.pinno, this.registerService).subscribe(data => {
      console.log(data);
      this.returnData = data
      this.closeButton.nativeElement.click();


      if(this.returnData.message == "Service record updated successfully"){
        this.alertService.success(this.returnData.code+" : "+this.returnData.message);
        // var closeAlert = document.getElementsByClassName("close").close()
        

      }else{
        this.alertService.error("Machine service scheduled already!")
        
      }

      // setTimeout(function(){
      //   // this.alertService.clear();

      // },3000);

    })
  }

}