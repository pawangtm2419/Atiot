import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  userRecord: any;
  userType: any;
  userMenu: [];

  masters: boolean;
  dashboard: boolean;
  model: boolean;
  reports: boolean;
  variant: boolean;
  machine: boolean;
  device: boolean;
  customer: boolean;
  location: boolean;
  geofence: boolean;
  shipment: boolean;
  serviceMaster: boolean;
  trackvehicles: boolean;
  services: boolean;
  schedules: boolean;
  update: boolean;
  usermanagement: boolean;
  users: boolean;
  dealers: boolean;

  constructor() { } 
   
  ngOnInit(): void {
    this.getUserroleRecord()
  }   
  getUserroleRecord(){
    this.userRecord = JSON.parse(localStorage.getItem('user')); 
    console.log(this.userRecord);
    this.userType =  this.userRecord.role.toString();

    this.masters = this.userRecord.roleMenus.masters.link;
    this.dashboard = this.userRecord.roleMenus.dashboard.link;
    this.services = this.userRecord.roleMenus.services.link;
    /* this.reports = this.userRecord.roleMenus.reports.link; */
    this.reports = false;
    this.model = this.userRecord.roleMenus.model.link;
    this.machine = this.userRecord.roleMenus.machine.link;
    this.device = this.userRecord.roleMenus.device.link;
    this.location = this.userRecord.roleMenus.location.link;
    this.schedules = this.userRecord.roleMenus.schedules.link;
    this.users = this.userRecord.roleMenus.users.link;
    this.variant = this.userRecord.roleMenus.variant.link;
    this.customer = this.userRecord.roleMenus.customer.link;
    this.geofence = this.userRecord.roleMenus.geofence.link;
    this.shipment = this.userRecord.roleMenus.shipment.link;
    this.serviceMaster = this.userRecord.roleMenus.serviceMaster.link;
    this.trackvehicles = this.userRecord.roleMenus.trackvehicles.link;
    this.update = this.userRecord.roleMenus.update.link;
    this.usermanagement = this.userRecord.roleMenus.usermanagement.link;
    this.dealers = this.userRecord.roleMenus.dealers.link;
  }
}
    






