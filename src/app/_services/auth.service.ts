import { Injectable } from '@angular/core';
import { AccountService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    loginRecord: any;

    adminUrl = [
        { url: '/dashboard' },
        { url: '/masters/model' },
        { url: '/users' },
        { url: '/masters/machine' },
        { url: '/masters/machine/add' },
        { url: '/masters/device' },
        { url: '/masters/variant' },
        { url: '/masters/customer' },
        { url: '/masters/location' },
        { url: '/masters/geofencing' },
        
        { url: '/track' },
        { url: 'details/:**' },
        { url: '/masters/shipment' },
        { url: '/summary' },
        { url: '/service' },
        { url: '/user' },
        { url: '/user/userlist' },
        { url: '/user/dealer' },
        { url: '/notifications' },
        { url: '/testing/test' },
        { url: '/testing/main' },
        { url: '/report' },
        { url: '/users' },
        { url: '/users/add' },
        { url: '/users/edit' },
    ];

    delearUrl = [
        { url: '/dashboard' },
        { url: '/track' },
        { url: 'details/:**' },
        { url: '/report' },
        { url: '/masters/model' },
        { url: '/masters/machine' },
        { url: '/masters/machine/add' },
        { url: '/masters/device' },
        { url: '/masters/variant' },
        { url: '/masters/customer' },
        { url: '/masters/location' },
        { url: '/masters/shipment' },


    ];

     zoneUrl = [
        { url: '/dashboard' },
        { url: '/masters/model' },
        { url: '/masters/machine' },
        { url: '/masters/machine/add' },
        { url: '/masters/device' },
        { url: '/masters/variant' },
        { url: '/masters/customer' },
        { url: '/masters/location' },
        { url: '/track' },
        { url: 'details/:**' },
        { url: '/masters/shipment' },
        { url: '/summary' },
        { url: '/service' },
        { url: '/notifications' },
        { url: '/report' },
     ];

    getUrl: any;
    getUrlDelear: any;
    constructor(private accountService: AccountService, private route: ActivatedRoute, private router: Router, ) { }
    authFunction(b) {
        console.log(JSON.parse(localStorage.getItem('user')));
        
        console.log("bb ", b);

        if (JSON.parse(localStorage.getItem('user')).role == "ADMIN") {
            this.getUrl = this.adminUrl.find(x => x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {
                console.log("Okk Authorized")
            } else {
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
                this.router.navigateByUrl(returnUrl);
                console.log("Not authoriszed");
            }
        }
        if(JSON.parse(localStorage.getItem('user')).role == "officero"){
            this.getUrl = this.delearUrl.find(x => x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {
                console.log("Okk Authorized")
            } else {
                console.log("Not authoriszed");
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
                this.router.navigateByUrl(returnUrl);
            }

        }
        if(JSON.parse(localStorage.getItem('user')).useType == "ZONE"){
            this.getUrl = this.zoneUrl.find(x => x.url == b);
            console.log(this.getUrl);
            if (this.getUrl.url == b) {
                console.log("Okk Authorized")
            } else {
                console.log("Not authoriszed");
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
                this.router.navigateByUrl(returnUrl);
            }

        }
    }
}