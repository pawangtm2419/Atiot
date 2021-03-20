import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  

  constructor(private accountService: AccountService) { 
    ;
  }

  ngOnInit(): void {
  }
  logout() {
    this.accountService.logout();
}
}
