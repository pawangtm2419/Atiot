import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-dtperformer',
  templateUrl: './dtperformer.component.html',
  styleUrls: ['./dtperformer.component.less']
})
export class DtperformerComponent implements OnInit {
  
  selectMonth:string='currentMonth';
  lastMonthPerformerData:any;
  date = new Date();
  top5Performers: any;
  getCustomArrayForTopPerformers: any;
  currentMonthPerformerData : any;
  p: number = 1;
  searchText;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.getTop5Performers();
  }

  changeMonth(){
    this.getTop5Performers();
  }

  getTop5Performers() {
    
    if(this.selectMonth=='lastMonth')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      
      this.accountService.getLastmonthtopfiveperformer(data1)
      .pipe(first())
      .subscribe((data) => {
        this.lastMonthPerformerData = data;
        // console.log("lasttopperformerdata", this.lastMonthPerformerData);
        this.top5Performers = this.lastMonthPerformerData;
        console.log("lasttopperformerdata", this.top5Performers);
    })
   }

    else if(this.selectMonth=='currentMonth')
    {
      const data1 = {
        useType: JSON.parse(localStorage.getItem('user')).useType,
        loginName:JSON.parse(localStorage.getItem('user')).loginName
      }
      this.accountService.getCurrentmonthtopfiveperformer(data1)
      .pipe(first())
      .subscribe((data) => {
        this.currentMonthPerformerData = data;
        // console.log("currentMonthPerformerData", this.currentMonthPerformerData);
        this.top5Performers = this.currentMonthPerformerData;
        console.log("currentMonthPerformerData", this.top5Performers);
    })
   
    }
   
  }

}
