import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
        var headers_object = new HttpHeaders({
            'Content-Type': 'application/json',
            'companyID': environment.companyID
        });
        var httpOptions = {
            headers: headers_object
        };

        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, a, httpOptions)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes

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
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/users/register`, user, httpOptions);
    }

    getAll() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<User[]>(`${environment.apiUrl}/users`, httpOptions);
    }
    getAllMachines() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Machine[]>(`${environment.apiUrl}/masters/poi`, httpOptions);
    }
    getAllMachines1() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Master[]>(`${environment.apiUrl}/masters/mst_data`, httpOptions);

    }

    getVariantModel(id: string) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Variant>(`${environment.apiUrl}/masters/variant/getvariant/${id}`, httpOptions);
    }
    deleteVariant(id: string){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put<Variant>(`${environment.apiUrl}/masters/variant/deletevariant/${id}`, httpOptions);
    }
    getAllLocation() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Location[]>(`${environment.apiUrl}/masters/poi`, httpOptions);

    }

    getReportData(reporthData) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/report`, reporthData, httpOptions);
    }

    getBatchData(batchData) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/batchdata`, batchData, httpOptions);
    }
    getConsumptionData(consumptionDate) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/consumption`, consumptionDate, httpOptions);
    }

    newMachine(machine: Master): Observable<any> {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}​​​​​​​/masters/mst_data/create`, machine, httpOptions);
    }


    newDevice(device: Device) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/masters/device/create`, device, httpOptions);

    }

    newVariant(variant: Variant) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/masters/variant/create`, variant, httpOptions);

    }

    newModel(model: Model) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.post(`${environment.apiUrl}/masters/model/create`, model, httpOptions);

    }


    getAllDevice() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Device[]>(`${environment.apiUrl}/masters/device`, httpOptions);
    }

    getAllCustomer() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/masters/customer`, httpOptions);

    }


    getAllModels() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Model[]>(`${environment.apiUrl}/masters/model`, httpOptions);
    }

    updateModels() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Variant[]>(`${environment.apiUrl}/masters/model/update/:id`, httpOptions);
    }

    createModels() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Model[]>(`${environment.apiUrl}/masters/model/create`, httpOptions);
    }
    deleteModel(id:string){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put<Model[]>(`${environment.apiUrl}/masters/model/deletemodel/${id}`, httpOptions);
    }

    getAllVariants() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Variant[]>(`${environment.apiUrl}/masters/variant`, httpOptions);
    }
    updateVariants() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Variant[]>(`${environment.apiUrl}/masters/variant/update/:id`, httpOptions);
    }
    createVariants() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Variant[]>(`${environment.apiUrl}/masters/variant/update/create`, httpOptions);
    }

    updateVariant(id, params) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/masters/variant/update/${id}`, params, httpOptions)
            .pipe(map(x => {
                return x;
            }));
    }
    getTrack(timeValue) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track[]>(`${environment.apiUrl}/vehicletrack/main1`, timeValue, httpOptions)
    }

    getById(id: string) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`, httpOptions);
    }

    getByIdCustomer(id: string) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Customer>(`${environment.apiUrl}/masters/customer/id/${id}`, httpOptions);
    }

    getByIdDevice(id: string) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Device>(`${environment.apiUrl}/masters/device/id/${id}`, httpOptions);
    }

    getByIdModel(id: string) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Model>(`${environment.apiUrl}/masters/model/id/${id}`, httpOptions);
    }


    getByIdMachine(id: string) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Machine>(`${environment.apiUrl}/masters/mst_data/id/${id}`, httpOptions);
    }

    getByIdVariant(id: string) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get<Variant>(`${environment.apiUrl}/masters/variant/id/${id}`, httpOptions);
    }

    newCustomer(customer: Customer) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.post(`${environment.apiUrl}/masters/customer/create`, customer, httpOptions);

    }

    updateCustomer(id, params) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/masters/customer/${id}`, params, httpOptions)
            .pipe(map((x) => {
                return x;

            }));
    }



    updateMachine(id, params) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/masters/mst_data/${id}`, params, httpOptions)
            .pipe(map((x) => {
                return x;

            }));
    }


    updateModel(id, params) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/masters/model/update/${id}`, params, httpOptions)
            .pipe(map(x => {
                return x;
            }));
    }


    updateDevice(id, params) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/masters/device/${id}`, params, httpOptions)
            .pipe(map(x => {
                return x;
            }));
    }


    update(id, params) {
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


    deleteMachine(id: string) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.delete(`${environment.apiUrl}/masters/mst_data/${id}`, httpOptions)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.machineValue.id) {
                    this.logout();
                }
                return x;
            }));
    }

    deletePoiAreaRow(id) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/masters/poi/delete/${id}`, httpOptions);
    }

    addMasterLocation(location) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.post(`${environment.apiUrl}/masters/poi/create`, location, httpOptions);
    }

    getTrackByCompanyID(map) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/map`, map, httpOptions);
    }

    getBatchDatas(batchData) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/batchdata`, batchData, httpOptions);
    }
    getEngineDatas(engineData) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/enginehour`, engineData, httpOptions);
    }

    // Dashboard
    getCurrentMonthCount() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/dashboard/currentmonthcount`, httpOptions);
    }
    getLastMonthCount() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/dashboard/lastmonthcount`, httpOptions);
    }
    getCurrentYearCount() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/dashboard/currentyearcount`, httpOptions);
    }
    getAllRunningVehicleModel() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/dashboard/vehiclepark`, httpOptions);
    }
    getAllvehiclemonModel() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/dashboard/vehiclemap`, httpOptions);
    }
    getVehicleparkCountData() {

        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.get(`${environment.apiUrl}/dashboard/vehiclepark`, httpOptions);
    }
    getVehicleparkCountTest() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.post(`${environment.apiUrl}/dashboard/vehiclepark/count`, httpOptions);
    }
    getMonitorData() {

        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.get(`${environment.apiUrl}/dashboard/vehiclemonitoring`, httpOptions);
    }

    // Dealrs 
    getAllInvoiceList() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };

        return this.http.get(`${environment.apiUrl}/transaction/invoiceView`, httpOptions);

        // return this.http.get(`${environmentDealer.apiUrl}/masters/dealer/list`);
    }
    createInvoiceList(data) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/transaction/invoiceCreate`, data, httpOptions);
    }
    getNotificationList(daterange) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/notifications/ `, daterange, httpOptions);
    }


    // Vehicle Report 
    getVehicleReportList() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/reports/vehicle/vehiclereport`, httpOptions);
    }

    // QA Testing
    getQAData(date) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/qatest/qadata`, date, httpOptions);
    }
    getReportQATestForData(data) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/qatest/dataliveforDevice`, data, httpOptions);
    }
    getReportQATestForRowData(id) {
        // alert(id)
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/qatest/qaid`, httpOptions);
    }
    getPinno(data) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/transaction/unbilled/machines`, data, httpOptions);
    }
    getEngineOff(data) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/vehicletrack/engineoff`, data, httpOptions);
    }
    getEngineOn(data) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/vehicletrack/engineon`, data, httpOptions);
    }

    // Get Location address from Latitude Langitude 
    getLocationFromlatlang() {
        var lat = 28.612673;
        var lng = 77.2772634;
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDITud13UV0N6Y58jk0AWInr5y52lJ4rsY`);
    }
    getVehicleParkCountWithModelNumber(data) {

        var headers_object = new HttpHeaders({
            'Content-Type':
                'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token,
            'companyID': environment.companyID
        });

        const httpOptions = { headers: headers_object };




        return this.http.post(`${environment.apiUrl}/dashboard/vehiclepark/count`,
            data, httpOptions);

    }
    getReportQATestForRowDataAPI(data) {
        // var data = {
        // "gte": "2021-01-01T17:54:32.000Z",
        // "lt": "2021-01-04T17:54:32.000Z",
        // "deviceID":"352913090221910"
        // }
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/reports/qatest/qaid`, data, httpOptions);
    }

    //Service
    getUpcomingServices() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/services/machines`, httpOptions);
    }
    newService(id, data) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        console.log(data);

        return this.http.post(`${environment.apiUrl}/services/machines/${id}`, data, httpOptions);
    }
    getUpcomingSchedule(id) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/services/machines/${id}`, httpOptions);
    }
    getCategory(){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/masters/categories`, httpOptions);
    }
    getSubCategory(data){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/masters/categories`, data, httpOptions);
    }
    serviceUpdate(pinno,num,data){
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/services/machines/${pinno}/${num}`, data, httpOptions);
    }
    
    //Geo-Fencing
    getAllGeofenceList() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/vehicle/geo-fence/getAll`, httpOptions);
    }

    getGeoFenceLocationList() {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.get(`${environment.apiUrl}/masters/poi`, httpOptions);
    }
    addLocation(data) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).token, 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.put(`${environment.apiUrl}/vehicle/geo-fence`, data, httpOptions);
    }
    deleteLocationGeofence(data) {
        var headers_object = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmJiM2M2YmMyMGUwZjM2MzgzNDM1ZTIiLCJpYXQiOjE2MTAzNDEzMjksImV4cCI6MTYxMDk0NjEyOX0.c5Dp4ILdwL3Zc68nxU9UAb5atlvTn0EF8MTJxkFRZmk", 'companyID': environment.companyID });
        const httpOptions = { headers: headers_object };
        return this.http.post(`${environment.apiUrl}/vehicle/geo-fence`, data, httpOptions);
    }
    getLocationAddress(lat, lng) {
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAMDelQFr1mwJz0whw7L9Bu1BFQ3hvbxZg`);
    }
}




