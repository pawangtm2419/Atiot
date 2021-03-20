import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html',
             styleUrls:['list.component.css'] })

export class ListComponent implements OnInit {
    users = null;
    shortasc = '-createdAt';
    shortdesc = 'createdAt'
    filter = {isActive: true}
    isChecked;
    date = new Date();
    selectedRow : Number;
    setClickedRow : Function;
    constructor(private accountService: AccountService) {
         
      this.setClickedRow = function(index){
        this.selectedRow = index;
    }
     }

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe((users) => {
                this.users = users
                console.log(this.users)
            });
    }

    deleteUser(id) {
        if (id == null) {
            alert("id = " + id);
            return
        }
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => this.users = this.users.filter(x => x.id !== id));
    }

    onItemChangeActive() {
            this.filter = {
                isActive: false,
                }
            }

        
        
    onItemChangedeActive() {
        this.filter = {
            isActive: false,
        }
    }
}