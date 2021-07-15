import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';

@Component({
  selector: 'app-runhrst',
  templateUrl: './runhrst.component.html',
  styleUrls: ['./runhrst.component.less']
})
export class RunhrstComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  date  = new Date();
  form: FormGroup;

  constructor( private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService, ) { }

  ngOnInit(): void {
  }
  get f() { return this.form.controls; }

}
