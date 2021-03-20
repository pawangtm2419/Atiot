import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  userRecord: any;
  userType: any;
  userRecord2: any;

  constructor() { } 
   
  ngOnInit(): void {
       
       this.getUserroleRecord()
  }   

  getUserroleRecord(){
    this.userRecord2 =  JSON.parse(localStorage.getItem('user')).role.toString();
    console.log(this.userRecord2);
    
  }
}
    