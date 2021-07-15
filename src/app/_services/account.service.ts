import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User, Variant, Model, Location, Track } from '@app/_models';
import { Machine } from '@app/_models';
import { Master } from '@app/_models';
import { Device } from '@app/_models';
import { Customer } from '@app/_models';
import { parse } from 'path';


@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    private machineSubject: BehaviorSubject<Machine>;
    public machine: Observable<Machine>;
    private masterSubject: BehaviorSubject<Master>;
    public master: Observable<Master>;
    private deviceSubject: BehaviorSubject<Device>;
    public device: Observable<Device>;

    private modelSubject: BehaviorSubject<Model>;
    public model: Observable<Model>;
    private variantSubject: BehaviorSubject<Variant>;
    public variant: Observable<Variant>;
    private trackSubject: BehaviorSubject<Track>;
    public track: Observable<Track>;
    private customerSubject: BehaviorSubject<Customer>;
    public customer: Observable<Customer>;
    userToken: string;
    httpOptions: any;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.machineSubject = new BehaviorSubject<Machine>(JSON.parse(localStorage.getItem('machine')));
        this.machine = this.machineSubject.asObservable();
        this.masterSubject = new BehaviorSubject<Master>(JSON.parse(localStorage.getItem('master')));
        this.master = this.masterSubject.asObservable();
        this.deviceSubject = new BehaviorSubject<Device>(JSON.parse(localStorage.getItem('device')));
        this.device = this.deviceSubject.asObservable();

        this.modelSubject = new BehaviorSubject<Model>(JSON.parse(localStorage.getItem('model')));
        this.model = this.modelSubject.asObservable();
        this.variantSubject = new BehaviorSubject<Variant>(JSON.parse(localStorage.getItem('variant')));
        this.variant = this.variantSubject.asObservable();
        this.trackSubject = new BehaviorSubject<Track>(JSON.parse(localStorage.getItem('track')));
        this.track = this.trackSubject.asObservable();

    }

    public get userValue(): User {
        return this.userSubject.value;
    }




    public get machineValue(): Machine {
        return this.machineSubject.value;
    }

    public get deviceValue(): Device {
        return this.deviceSubject.value;
    }

    login(a) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        var headers_object = new HttpHeaders({
            'Content-Type': 'application/json',
            'companyID': environment.companyID
        });
        var httpOptions = {
            headers: headers_object
        };

        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, a, httpOptions)
            .pipe(map(user => {

                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                console.log(user);
                return user;


            }))

    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        //For register user
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/users/register`, user, httpOptions);
    }

    getAll() 
    {
        //Get all user list
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<User[]>(`${environment.apiUrl}/users`, httpOptions);
    }
    // getAllMachines() {
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.get<Machine[]>(`${environment.apiUrl}/masters/poi`, httpOptions);
    // }
    getAllMachines1(data) {
        //Get all machine master list
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Master[]>(`${environment.apiUrl}/masters/mst_data`,data, httpOptions);

    }
    // getAllMachines1() {
    //     //Get all machine master list
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.get<Master[]>(`${environment.apiUrl}/masters/mst_data`, httpOptions);

    // }

    getAllServicesMaster() 
    {
        //Get all service list
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Master[]>(`${environment.apiUrl}/services/schedule-master`,httpOptions);

    }
    assignCustomer(data)
    {
        //Assign customer to machine under particular dealer
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/vehicle/AssignCustomer`,data, httpOptions);
    }
    getCustomerListById(id)
     {
        //Get customer list for the particular dealer
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/masters/customer/dealer/${id}`, httpOptions);
    }

    mapCheck(id)
    {
        //Check the status that machine is mapped or not
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/masters/mst_data/checkmap/${id}`, httpOptions);
    }

    updateDeviceMap(data) {
        //Map the device to particular machine 
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        console.log(data)
        return this.http.post(`${environment.apiUrl}/masters/mst_data/updatemap`, data, httpOptions);
    }

    getVariantModel(id: string) 
    {
        //Get variant list for particular device model
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Variant>(`${environment.apiUrl}/masters/variant/getvariant/${id}`, httpOptions);
    }
    deleteVariant(id: string)
    {​​​​​​​​
    //Delete variant data
    var headers_object = new HttpHeaders({​​​​​​​​​​​​ 'Content-Type':'application/json', 'Authorization':"Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID':environment.companyID }​​​​​​​​​​​​);
    const httpOptions = {​​​​​​​​​​​​ headers:headers_object }​​​​​​​​​​​​;
    const URL = environment.apiUrl + '/masters/variant/deletevariant/' + id;
    console.log("url", URL)
    return this.http.put<Variant>(URL, httpOptions);
    }​​​​​​​​
    getAllLocation(data) 
    {
        //Get all location list
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/masters/poi`,data, httpOptions);
 
    }
    getVehicleTrackReport(data) 
    {
        //Get live vehicle track report data
        console.log('Token', JSON.parse(localStorage.getItem('user')).token);
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/vehicletrack/report`, data, httpOptions);
    }

    getReportData(reporthData)
     {
        //Get live vehicle track summary report data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/report`, reporthData, httpOptions);
    }

    getBatchData(batchData) {
        //Get batch details for vehicle report
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/Sumconsumption`, batchData, httpOptions);
    }
    getsumConsumptionData(batchData) {
        //Get batch details for vehicle report
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/Sumconsumption`, batchData, httpOptions);
    }
    getConsumptionData(consumptionDate) 
    {
        //Get consumption details for vehicle report
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/consumption`, consumptionDate, httpOptions);
    }


    // newMachine(machine) {
    //     console.log(machine)
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     // const URL = environment.apiUrl + '/masters/mst_data/masterservice/create';
    //     // console.log('URL', URL);
    //     return this.http.post<Master>(`http://172.16.16.30:4000​​​​​​​/masters/mst_data/masterservice/create`, machine, httpOptions);
    // }


    newDevice(device: Device) {
        //Add new device
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        
        return this.http.post(`${environment.apiUrl}/masters/device/create`, device, httpOptions);

    }

    newServiceSchedule(serviceSchedule)
     {
         //Add new service
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        
        return this.http.post(`${environment.apiUrl}/services/schedule-master`, serviceSchedule, httpOptions);

    }

    newMC(data) 
    {
        //Add new machine
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        console.log(data)

        return this.http.post(`${environment.apiUrl}/masters/mst_data/create`, data, httpOptions);

    }
    newVariant(variant: Variant) 
    {
        //Add new variant
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        console.log(variant)
        return this.http.post(`${environment.apiUrl}/masters/variant/create`, variant, httpOptions);

    }

    newModel(model: Model)
     {
         //Add new device model
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/masters/model/create`, model, httpOptions);
    }


    getAllDevice() 
    {
        //Get all deviceID list for mapping
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Device[]>(`${environment.apiUrl}/masters/mst_data/getmap`, httpOptions);
    }
    getAllDevice2() 
    {
        //Get all device data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Device[]>(`${environment.apiUrl}/masters/device`, httpOptions);
    }


    getAllCustomer() 
    {
        //Get all customer data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/masters/customer`, httpOptions);

    }


    getAllModels() {
        //Get all device model data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Model[]>(`${environment.apiUrl}/masters/model`, httpOptions);
    }

    deleteModel(id:string){​​​​​​​​
        //Delete the model
        var headers_object = new HttpHeaders({​​​​​​​​​​​​ 'Content-Type':'application/json', 'Authorization':"Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID':environment.companyID }​​​​​​​​​​​​);
        const httpOptions = {​​​​​​​​​​​​ headers:headers_object }​​​​​​​​​​​​;
        const URL = environment.apiUrl + '/masters/model/deletemodel/' + id;
        console.log("url", URL)
        return this.http.put<Model[]>(URL, httpOptions);
            }​​​​​​​​

    getAllVariants() {
        //Get all variant data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Variant[]>(`${environment.apiUrl}/masters/variant`, httpOptions);
    }
    // updateVariants() {
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.get<Variant[]>(`${environment.apiUrl}/masters/variant/update/:id`, httpOptions);
    // }
    // createVariants() {
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.get<Variant[]>(`${environment.apiUrl}/masters/variant/update/create`, httpOptions);
    // }

    updateVariant(id, params) {
        //Update variant data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/masters/variant/update/${id}`, params, httpOptions)
            .pipe(map(x => {
                return x;
            }));
    }

    getTrack(timeValue) {
        //Get vehicle track details between start date and end date
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track[]>(`${environment.apiUrl}/vehicletrack/main1`, timeValue, httpOptions)
    }


    getById(id: string) {
        //Get user details by userid
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`, httpOptions);
    }

    getByIdCustomer(id: string) {
        //Get customer details by customerId
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Customer>(`${environment.apiUrl}/masters/customer/id/${id}`, httpOptions);
    }

    getByIdDevice(id: string) {
        //Get device details by deviceId
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Device>(`${environment.apiUrl}/masters/device/id/${id}`, httpOptions);
    }

    getByIdModel(id: string) {
        //Get model details by modelId
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Model>(`${environment.apiUrl}/masters/model/id/${id}`, httpOptions);
    }


    getByIdMachine(id: string) {
        //Get machine details by machineId
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Machine>(`${environment.apiUrl}/masters/mst_data/id/${id}`, httpOptions);
    }

    getByIdVariant(id: string) {
        //Get variant details by variantId
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Variant>(`${environment.apiUrl}/masters/variant/id/${id}`, httpOptions);
    }

    newCustomer(customer: Customer) {
        //Add new customer
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.post(`${environment.apiUrl}/masters/customer/create`, customer, httpOptions);

    }

    updateCustomer(id, params) {
        //Update customer data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/masters/customer/${id}`, params, httpOptions)
            .pipe(map((x) => {
                return x;

            }));
    }



    updateMachine(id, params) {
        //Update machine data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/masters/mst_data/${id}`, params, httpOptions)
            .pipe(map((x) => {
                return x;

            }));
    }


    updateModel(id, params) {
        //Update model data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/masters/model/update/${id}`, params, httpOptions)
            .pipe(map(x => {
                return x;
            }));
    }


    updateDevice(id, params) {
        //Update device data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/masters/device/${id}`, params, httpOptions)
            .pipe(map(x => {
                return x;
            }));
    }


    update(id, params) {
       //Update user details
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/users/${id}`, params, httpOptions)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.delete(`${environment.apiUrl}/users/${id}`, httpOptions)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }


    // deleteMachine(id: string) {
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.delete(`${environment.apiUrl}/masters/mst_data/${id}`, httpOptions)
    //         .pipe(map(x => {
    //             // auto logout if the logged in user deleted their own record
    //             if (id == this.machineValue.id) {
    //                 this.logout();
    //             }
    //             return x;
    //         }));
    // }
deletedevice(id) {
        //Delete device data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        const URL = environment.apiUrl + '/masters/device/deleteDevice/' + id;
        console.log("url", URL)
        return this.http.put(URL, httpOptions);
    }​​
    deleteMachineData(id) {
        //Delete machine data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        const URL = environment.apiUrl + '/masters/mst_data/deleteMasters/' + id;
        console.log("url", URL)
        return this.http.put<Machine>(URL, httpOptions);
    }​
    removeCustomerRow(id: string) {​​​​​​​​
        //Delete customer data  
        var headers_object = new HttpHeaders({​​​​​​​​​​​​ 'Content-Type':'application/json', 'Authorization':"Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID':environment.companyID }​​​​​​​​​​​​);
        const httpOptions = {​​​​​​​​​​​​ headers:headers_object }​​​​​​​​​​​​;
        const URL = environment.apiUrl + '/masters/customer/deleteCustomer/' + id;
        console.log("url", URL)
        return this.http.put(URL, httpOptions);
        
            }​​​​​​​​
    deletePoiAreaRow(id) {
        //Delete location data 
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/masters/poi/delete/${id}`, httpOptions);
    }

    addMasterLocation(location) {
        //Add location
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/masters/poi/create`, location, httpOptions);
    }

    getTrackByCompanyID(map) {
        //Get vehicle track data by pinno and between start date & end date
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/map`, map, httpOptions);
    }
    getAllTrackByCompanyID(map) {
        //Get all on and off vehicles track data by pinno and between start date & end date
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/Allmap`, map, httpOptions);
    }


    getBatchDatas(batchData) {
        //Get batch data by pinno and between start date & end date
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/batchdata`, batchData, httpOptions);
    }
    getEngineDatas(engineData) {
        //Get engine hours data by pinno and between start date & end date
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/enginehour`, engineData, httpOptions);
    }

    //Dashboard Inner Pages
    getLastMonthCountInner(data) {
        //Get run hour statistics data for last month
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/dashboardn/lastmonthcount`, data, httpOptions);
    }
    
    getCurrentMonthCountInner(data) {
        //Get run hour statistics data for last month
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/dashboardn/currentmonthcount`, data, httpOptions);
    }
    
    getCurrentYearCountInner(data) {
        //Get run hour statistics data for last month
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/dashboardn/currentyearcount`, data, httpOptions);
    }

    // Dashboard
    getCurrentMonthCount(data) {
        //Get run hour statistics data for current month
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/dashboard/currentmonthcount`, data, httpOptions);
    }
    getLastMonthCount(data) {
        //Get run hour statistics data for last month
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/dashboard/lastmonthcount`, data, httpOptions);
    }
    getCurrentYearCount(data) {
        //Get run hour statistics data for current year
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/dashboard/currentyearcount`, data, httpOptions);
    }
    // getAllRunningVehicleModel() {
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.get(`${environment.apiUrl}/dashboard/vehiclepark`, httpOptions);
    // }
    getAllvehiclemonModel(data) {
        //Get all vehicle monitoring model data 
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/dashboardn/vehiclemap`,data, httpOptions);
    }
    // getVehicleparkCountData() {

    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };

    //     return this.http.get(`${environment.apiUrl}/dashboard/vehiclepark`, httpOptions);
    // }
    // getVehicleparkCountTest() {
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };

    //     return this.http.post(`${environment.apiUrl}/dashboard/vehiclepark/count`, httpOptions);
    // }
    // getVehicleParkData(){
    //     //Get vehicle park data
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.post(`${environment.apiUrl}/dashboard/vehiclepark/Count`, httpOptions);
    // }

    // getVehicleParkDataByModel(data){
    //     //Get vehicle park data by device model
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.post(`${environment.apiUrl}/dashboard/vehiclepark/Count`,data, httpOptions);
    // }

    getVehicleParkData(){
        //Get vehicle park data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/dashboardn/vehiclepark/count/model`, httpOptions);
    }
      getVehicleParkDataByModel(data){
        //Get vehicle park data by device model
        const params = new HttpParams()
       .set('deviceModel', data.deviceModel);
 
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object,params};
        return this.http.get(`${environment.apiUrl}/dashboardn/vehiclepark/count/model`, httpOptions);
    }

    getServiceSchedule(data) {
        //Get service schedule data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/dashboardn/ServiceSchedules`,data, httpOptions);
  }
  getServiceSchedulesStatus(data) {
      //Get service schedule status
    var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    const httpOptions = { headers: headers_object };
    return this.http.post(`${environment.apiUrl}/dashboardn/ServiceSchedulesStatus`,data, httpOptions);

    
}
getCustomerSegmentationCount() {
    //Get customer segmentation count
    var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    const httpOptions = { headers: headers_object };
    return this.http.get(`${environment.apiUrl}/dashboardn/CustomerSegmentationCount`, httpOptions);
}
getBreakdownStatisticsCount(data) {
    //Get breakdown statistics count
    var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    const httpOptions = { headers: headers_object };
    return this.http.post(`${environment.apiUrl}/dashboardn/BreakDownStatisticsCount`, data, httpOptions);
}
   getMonitorData(data){
       //Get vehicle monitoring data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
 
        return this.http.post(`${environment.apiUrl}/dashboardn/vehiclemonitoring`, data , httpOptions);
 
    }
   
    // getServiceSchedule(){
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.get(`${environment.apiUrl}/dashboard/ServiceSchedules`, httpOptions);

    // }

    getSummary(data){
        //Get summary data by pinno
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/vehicletrack/vehicle-summary`, data, httpOptions);
    }
    
    // getPerformers(data){
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.post(`${environment.apiUrl}/dashboard/month-topfiveperformer`,data, httpOptions);

    // }

    // getMonthwise(data){
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.post(`${environment.apiUrl}/dashboard/vehiclerunhourmonthly`,data, httpOptions);
    // }
    
    getLastmonthtopfiveperformer(data){
        //Get top 5 performers data for last month
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/dashboardn/Lastmonth-topfiveperformer`,data, httpOptions);
    }

    getCurrentmonthtopfiveperformer(data){
         //Get top 5 performers data for current month
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/dashboardn/Currentmonth-topfiveperformer`,data, httpOptions);
    }
    // batch report
    getBatchReport(data){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/batchreport/datesWiseBatchdata`, data, httpOptions);
    }
     // Battery Analytics
     getBatteryAnalytics(data){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/datesWiseBatteryAnalyticsdata`, data, httpOptions);
    }
    
    // Fuel Analytics
    getfuelAnalytics(data){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/fuelAnalytics`, data, httpOptions);
    }

    // Alert Analytics
    getAlertAnalytics(data){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/alertAnalytics`, data, httpOptions);
    }
    //Service Report
    getServiceReport(data){
       var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
       const httpOptions = { headers: headers_object };
       return this.http.post(`${environment.apiUrl}/services/machines/report`, data, httpOptions);
    }

    getServiceReportById(pinno,serviceNumber) {
        //4. Get upcoming master service schedule by pinno and service number
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/services/machines/${pinno}/${serviceNumber}`, httpOptions);
    }

    updateServiceReport(data) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/services/machines`, data, httpOptions)
    }

    // NonIot Device Report
    getNonIotReport(){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/vehicletrack/NonIoT`,  httpOptions);
     }
   
    getSubscriptionReportCount(data){
       var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
       const httpOptions = { headers: headers_object };
       return this.http.post(`${environment.apiUrl}/reports/vehicle/subscriptionReport`, data, httpOptions);
   }


   

    // Dealrs 
    getAllInvoiceList() {
        //Get all invoice list data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.get(`${environment.apiUrl}/transaction/invoiceView`, httpOptions);

        // return this.http.get(`${environmentDealer.apiUrl}/masters/dealer/list`);
    }
    createInvoiceList(data) {
        //Create invoice
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/transaction/invoiceCreate`, data, httpOptions);
    } 
    getNotificationList(daterange) {
        //Get notification list between the date range 
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/notifications/ `, daterange, httpOptions);
    }
    
    getNotificationListAll(data) {
        //Get notification list between the date range 
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/Allnotifications `, data, httpOptions);
    }


    // Vehicle Report 
    getVehicleReportList(data) {
        //Get vehicle report list data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/vehicle/vehiclereport`, data, httpOptions);
    }
    // QA Testing
    getReportQATestData(data) {
        //Get Report QA test data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/qatest/dataliveforDevice`, data, httpOptions);
    }
    getQATestMachineData(data) {
        //Get QA data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/qatest/qaiddatalive`, data, httpOptions);
    }
    getQATestBatchData(data) {
        //Get QA data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/qatest/qaidbatch`, data, httpOptions);
    }
    getMachineUtilizationData(data){
        //Get Machine Utilization report data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/utilization`, data, httpOptions);
   }
    getPinno(data) {
        //Get pinno list by device model and variant
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/transaction/unbilled/machines`, data, httpOptions);
    }
    getEngineOff(data) {
        //Get engine off data between date range and by pinno
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/vehicletrack/engineoff`, data, httpOptions);
    }
    getEngineOn(data) {
          //Get engine on data between date range and by pinno
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/vehicletrack/engineon`, data, httpOptions);
    }

    getLocationFromlatlang() {
          // Get Location address from Latitude Langitude 
        var lat = 28.612673;
        var lng = 77.2772634;
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDITud13UV0N6Y58jk0AWInr5y52lJ4rsY`);
    }
    // getVehicleParkCountWithModelNumber(data) {
    //     var headers_object = new HttpHeaders({
    //         'Content-Type':
    //         'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token,
    //         'companyID': environment.companyID
    //     });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.post(`${environment.apiUrl}/dashboard/vehiclepark/count`,
    //         data, httpOptions);
    // }

    getReportQATestForRowDataAPI(data) {
        //Get report QA test for row data

        // var data = {
        // "gte": "2021-01-01T17:54:32.000Z",
        // "lt": "2021-01-04T17:54:32.000Z",
        // "deviceID":"352913090221910"
        // }
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/qatest/qaid`, data, httpOptions);
    }
    createUserlogs(data) {
        //For creating user logs
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/userlogs/Create`, data, httpOptions);
    }
    
    GetUserlogsSummaryData(data) {
        //Get list of user logs summary
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        const URL = environment.apiUrl + '/userlogs/getSummary';
        console.log("url", URL)
        return this.http.post(URL,data, httpOptions);
            }
        
        GetUserlogsDetailsData(data) {
                //Get list of user logs details
                var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
                const httpOptions = { headers: headers_object };
                const URL = environment.apiUrl + '/userlogs';
                console.log("url", URL)
                return this.http.post(URL,data, httpOptions);
        }

    //Service
    // Upcoming service page details start here 
    getUpcomingServices(data) {
        //1. Get upcoming services data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/services/machines`,data, httpOptions);
    }
    registerService(id,data) {
        //2. Register an upcoming service and convert in scheduled service
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        console.log(data);

        return this.http.post(`${environment.apiUrl}/services/machines/${id}`, data, httpOptions);

        // var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        // const httpOptions = { headers: headers_object };
        // return this.http.post(`${environment.apiUrl}/services/machines/`+id, httpOptions);
    }
    
    // Upcoming service page details ends here  

    // Scheduled or completed Services page details start here 
    getCreatedServices(data) {

        //3. Get created services data (open or close)

        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });

        const httpOptions = { headers: headers_object };

        return this.http.post(`${environment.apiUrl}/services/machines/getService`,data, httpOptions);

    }
    getCreatedServicesByMachine(id,snum) {
        //4. Get upcoming master service schedule by pinno and service number
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/services/machines/${id}/${snum}`, httpOptions);
    }
    serviceUpdate(pinno,num,data){
        //5. Update service data and set status as close
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/services/machines/${pinno}/${num}`, data, httpOptions);
    }
    // Scheduled or completed Services page details ends here 

    // getUpcomingServices() {
    //     //Get upcoming services data
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.get(`${environment.apiUrl}/services/machines`, httpOptions);
    // }
    newService(id, data) {
        //update service by pinno and service details
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        console.log(data);

        return this.http.post(`${environment.apiUrl}/services/machines/${id}`, data, httpOptions);
    }
    
    // getUpcomingSchedule(id,snum) {
    //     var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
    //     const httpOptions = { headers: headers_object };
    //     return this.http.get(`${environment.apiUrl}/services/machines/${id}`, httpOptions);
    // }
    getCategory(){
        //Get category data by pinno and service number
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/masters/categories`, httpOptions);
    }
    getSubCategory(data){
        //Get subcategory by category
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/masters/categories`, data, httpOptions);
    }
    
    
    //Geo-Fencing
    getAllGeofenceList(data) {
        //Get all geofence list
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/vehicle/geo-fence/getAll`,data, httpOptions);
    }

    getGeoFenceLocationList() {
        //Get all geofence location list
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/masters/poi`, httpOptions);
    }
    getServiceNotification(data) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/notifications/create`, data, httpOptions);
    }
    addLocation(data) {
        //Add geofence location data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/vehicle/geo-fence`, data, httpOptions);
    }
    deleteLocationGeofence(data) {
        //Delete geofence location data
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmJiM2M2YmMyMGUwZjM2MzgzNDM1ZTIiLCJpYXQiOjE2MTAzNDEzMjksImV4cCI6MTYxMDk0NjEyOX0.c5Dp4ILdwL3Zc68nxU9UAb5atlvTn0EF8MTJxkFRZmk", 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/vehicle/geo-fence`, data, httpOptions);
    }
    getLocationAddress(lat, lng) {
        //Get location address
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAMDelQFr1mwJz0whw7L9Bu1BFQ3hvbxZg`);
    }
    changePassword(data){
        //Change password 
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/users/password/change`, data, httpOptions);

    }
	getLocationInfo(appURL) {
        //get the  location by openstreetmap
        return this.http.get(appURL);
      }
}




