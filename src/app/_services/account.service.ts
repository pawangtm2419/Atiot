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

    constructor(private router: Router, private http: HttpClient) {
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
    login(a: { loginName: any; agreementSignedOn?: string; password?: any; }): Observable<User> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', companyID: environment.companyID }) };
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, a, httpOptions).pipe(map(user => {
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            return user;
        }));
    }

    logout(): void {
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }
    register(user: User): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/users/register`, user, httpOptions);
    }

    getAll(): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<User[]>(`${environment.apiUrl}/users`, httpOptions);
    }
    getAllMachines1(data: { useType: any; loginName: any; }): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post<Master[]>(`${environment.apiUrl}/masters/mst_data`, data, httpOptions);
    }

    getAllServicesMaster(): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<Master[]>(`${environment.apiUrl}/services/schedule-master`, httpOptions);
    }
    assignCustomer(data: { customerCode: any; pinno: any; subscriptionMonths: any; }) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/vehicle/AssignCustomer`, data, httpOptions);
    }
    getCustomerListById(id: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/masters/customer/dealer/${id}`, httpOptions);
    }

    mapCheck(id: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/masters/mst_data/checkmap/${id}`, httpOptions);
    }

    updateDeviceMap(data: { deviceID: string; devicetype: any; pinno: any; }): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/masters/mst_data/updatemap`, data, httpOptions);
    }

    getVariantModel(id: string) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<Variant>(`${environment.apiUrl}/masters/variant/getvariant/${id}`, httpOptions);
    }
    deleteVariant(id: string) {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID });
        const httpOptions = { headers: header };
        const URL = environment.apiUrl + '/masters/variant/deletevariant/' + id;
        return this.http.put<Variant>(URL, httpOptions);
    }
    getAllLocation(data: { useType: any; loginName: any; }) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/masters/poi`, data, httpOptions);
    }
    getVehicleTrackReport(data: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/vehicletrack/report`, data, httpOptions);
    }

    getReportData(reporthData: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/report`, reporthData, httpOptions);
    }

    getBatchData(batchData: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/Sumconsumption`, batchData, httpOptions);
    }
    getsumConsumptionData(batchData: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/Sumconsumption`, batchData, httpOptions);
    }
    getConsumptionData(consumptionDate: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/consumption`, consumptionDate, httpOptions);
    }

    newDevice(device: Device): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/masters/device/create`, device, httpOptions);
    }

    newServiceSchedule(serviceSchedule: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/services/schedule-master`, serviceSchedule, httpOptions);
    }

    newMC(data: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/masters/mst_data/create`, data, httpOptions);
    }
    newVariant(variant: Variant) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/masters/variant/create`, variant, httpOptions);
    }

    newModel(model: Model) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/masters/model/create`, model, httpOptions);
    }

    getAllDevice(): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<Device[]>(`${environment.apiUrl}/masters/mst_data/getmap`, httpOptions);
    }
    getAllDevice2(): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<Device[]>(`${environment.apiUrl}/masters/device`, httpOptions);
    }
    getAllCustomer(): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/masters/customer`, httpOptions);
    }
    getAllModels(): Observable<Model[]> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<Model[]>(`${environment.apiUrl}/masters/model`, httpOptions);
    }

    deleteModel(id: string) {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID });
        const httpOptions = { headers: header };
        const URL = environment.apiUrl + '/masters/model/deletemodel/' + id;
        return this.http.put<Model[]>(URL, httpOptions);
    }

    getAllVariants(): Observable<Variant[]> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<Variant[]>(`${environment.apiUrl}/masters/variant`, httpOptions);
    }

    updateVariant(id: any, params: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.put(`${environment.apiUrl}/masters/variant/update/${id}`, params, httpOptions).pipe(map(x => {
            return x;
        }));
    }

    getTrack(timeValue: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post<Track[]>(`${environment.apiUrl}/vehicletrack/main1`, timeValue, httpOptions);
    }
    getById(id: string): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`, httpOptions);
    }

    getByIdCustomer(id: string): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<Customer>(`${environment.apiUrl}/masters/customer/id/${id}`, httpOptions);
    }

    getByIdDevice(id: string): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<Device>(`${environment.apiUrl}/masters/device/id/${id}`, httpOptions);
    }

    getByIdModel(id: string): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<Model>(`${environment.apiUrl}/masters/model/id/${id}`, httpOptions);
    }


    getByIdMachine(id: string): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<Machine>(`${environment.apiUrl}/masters/mst_data/id/${id}`, httpOptions);
    }

    getByIdVariant(id: string): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get<Variant>(`${environment.apiUrl}/masters/variant/id/${id}`, httpOptions);
    }

    newCustomer(customer: Customer): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/masters/customer/create`, customer, httpOptions);
    }

    updateCustomer(id: any, params: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.put(`${environment.apiUrl}/masters/customer/${id}`, params, httpOptions).pipe(map((x) => {
            return x;
        }));
    }

    updateMachine(id: any, params: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.put(`${environment.apiUrl}/masters/mst_data/${id}`, params, httpOptions).pipe(map((x) => {
            return x;
        }));
    }
    updateModel(id: any, params: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.put(`${environment.apiUrl}/masters/model/update/${id}`, params, httpOptions).pipe(map(x => {
            return x;
        }));
    }
    updateDevice(id: any, params: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.put(`${environment.apiUrl}/masters/device/${id}`, params, httpOptions).pipe(map(x => {
            return x;
        }));
    }
    uploadMachineData(formData: any): Observable<any> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', companyID: environment.companyID });
        const httpOptions = { headers: header };
        const URL = 'http://103.149.113.100:8035/masters/data/upload/machinemaster';
        return this.http.post(URL, formData, httpOptions);
    }
    uploadDeviceData(formData: FormData): Observable<any> {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', companyID: environment.companyID });
        const httpOptions = { headers: header };
        const URL = 'http://103.149.113.100:8035/masters/data/upload/devicemaster';
        return this.http.post(URL, formData, httpOptions);
    }

    update(id: string, params: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.put(`${environment.apiUrl}/users/${id}`, params, httpOptions).pipe(map(x => {
            if (id === this.userValue.id) {
                const user = { ...this.userValue, ...params };
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
            }
            return x;
        }));
    }

    delete(id: string): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.delete(`${environment.apiUrl}/users/${id}`, httpOptions).pipe(map(x => {
            if (id === this.userValue.id) {
                this.logout();
            }
        }));
    }
    deletedevice(id: string): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        const URL = environment.apiUrl + '/masters/device/deleteDevice/' + id;
        return this.http.put(URL, httpOptions);
    }
    deleteMachineData(id: string): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        const URL = environment.apiUrl + '/masters/mst_data/deleteMasters/' + id;
        return this.http.put<Machine>(URL, httpOptions);
    }
    removeCustomerRow(id: string): Observable<any> {
        // Delete customer data
        const header = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID });
        const httpOptions = { headers: header };
        const URL = environment.apiUrl + '/masters/customer/deleteCustomer/' + id;
        return this.http.put(URL, httpOptions);

    }
    deletePoiAreaRow(id: string): Observable<any> {
        // Delete location data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/masters/poi/delete/${id}`, httpOptions);
    }

    addMasterLocation(location: any): Observable<any> {
        // Add location

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/masters/poi/create`, location, httpOptions);
    }

    getTrackByCompanyID(map: any): Observable<any> {
        // Get vehicle track data by pinno and between start date & end date

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/map`, map, httpOptions);
    }
    getAllTrackByCompanyID(map: any): Observable<any> {
        // Get all on and off vehicles track data by pinno and between start date & end date

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/Allmap`, map, httpOptions);
    }


    getBatchDatas(batchData: any): Observable<any> {
        // Get batch data by pinno and between start date & end date

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/batchdata`, batchData, httpOptions);
    }
    getEngineDatas(engineData: any): Observable<any> {
        // Get engine hours data by pinno and between start date & end date

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post<Track>(`${environment.apiUrl}/vehicletrack/enginehour`, engineData, httpOptions);
    }

    // Dashboard Inner Pages
    getLastMonthCountInner(data: { useType: any; loginName: any; }): Observable<any> {
        // Get run hour statistics data for last month

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboardn/lastmonthcount`, data, httpOptions);
    }

    getCurrentMonthCountInner(data: { useType: any; loginName: any; }): Observable<any> {
        // Get run hour statistics data for last month

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboardn/currentmonthcount`, data, httpOptions);
    }

    getCurrentYearCountInner(data: { useType: any; loginName: any; }): Observable<any> {
        // Get run hour statistics data for last month

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboardn/currentyearcount`, data, httpOptions);
    }

    // Dashboard
    getCurrentMonthCount(data: { useType: any; loginName: any; }): Observable<any> {
        // Get run hour statistics data for current month

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboard/currentmonthcount`, data, httpOptions);
    }
    getLastMonthCount(data: { useType: any; loginName: any; }): Observable<any> {
        // Get run hour statistics data for last month

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboard/lastmonthcount`, data, httpOptions);
    }
    getCurrentYearCount(data: { useType: any; loginName: any; }): Observable<any> {
        // Get run hour statistics data for current year

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboard/currentyearcount`, data, httpOptions);
    }
    getAllvehiclemonModel(data: { useType: any; loginName: any; }): Observable<any> {
        // Get all vehicle monitoring model data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboardn/vehiclemap`, data, httpOptions);
    }
    getVehicleParkData() {
        // Get vehicle park data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/dashboardn/vehiclepark/count/model`, httpOptions);
    }
    getVehicleParkDataByModel(data: { deviceModel: any; }) {
        const params = new HttpParams().set('deviceModel', data.deviceModel);
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }), params };
        return this.http.get(`${environment.apiUrl}/dashboardn/vehiclepark/count/model`, httpOptions);
    }

    getServiceSchedule(data: { useType: any; loginName: any; }): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboardn/ServiceSchedules`, data, httpOptions);
    }
    getServiceSchedulesStatus(data: { useType: any; loginName: any; }): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboardn/ServiceSchedulesStatus`, data, httpOptions);
    }
    getCustomerSegmentationCount(): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/dashboardn/CustomerSegmentationCount`, httpOptions);
    }
    getBreakdownStatisticsCount(data: { useType: any; loginName: any; }): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboardn/BreakDownStatisticsCount`, data, httpOptions);
    }
    getMonitorData(data: { useType: any; loginName: any; }) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboardn/vehiclemonitoring`, data, httpOptions);
    }
    getSummary(data: any) {
        // Get summary data by pinno

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/vehicletrack/vehicle-summary`, data, httpOptions);
    }

    getLastmonthtopfiveperformer(data: { useType: any; loginName: any; }) {
        // Get top 5 performers data for last month

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboardn/Lastmonth-topfiveperformer`, data, httpOptions);
    }

    getCurrentmonthtopfiveperformer(data: { useType: any; loginName: any; }) {
        // Get top 5 performers data for current month

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/dashboardn/Currentmonth-topfiveperformer`, data, httpOptions);
    }
    // batch report
    getBatchReport(data: any) {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/batchreport/datesWiseBatchdata`, data, httpOptions);
    }
    // Battery Analytics
    getBatteryAnalytics(data: any) {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/datesWiseBatteryAnalyticsdata`, data, httpOptions);
    }

    // Fuel Analytics
    getfuelAnalytics(data: any) {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/fuelAnalytics`, data, httpOptions);
    }

    // Alert Analytics
    getAlertAnalytics(data: { fromDate: any; toDate: any; pinno: any; }) {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/alertAnalytics`, data, httpOptions);
    }
    // Service Report
    getServiceReport(data: any) {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/services/machines/report`, data, httpOptions);
    }

    getServiceReportById(pinno: any, serviceNumber: any): Observable<any> {
        // 4. Get upcoming master service schedule by pinno and service number

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/services/machines/${pinno}/${serviceNumber}`, httpOptions);
    }

    updateServiceReport(data: any): Observable<any> {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.put(`${environment.apiUrl}/services/machines`, data, httpOptions);
    }

    // NonIot Device Report
    getNonIotReport() {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/vehicletrack/NonIoT`, httpOptions);
    }

    getSubscriptionReportCount(data: { useType: any; loginName: any; }) {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/vehicle/subscriptionReport`, data, httpOptions);
    }
    // Dealrs
    getAllInvoiceList(): Observable<any> {
        // Get all invoice list data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };

        return this.http.get(`${environment.apiUrl}/transaction/invoiceView`, httpOptions);

        // return this.http.get(`${environmentDealer.apiUrl}/masters/dealer/list`);
    }
    createInvoiceList(data: any): Observable<any> {
        // Create invoice

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/transaction/invoiceCreate`, data, httpOptions);
    }
    getNotificationList(daterange: { gte: string; lt: string; useType: string; loginName: string; }): Observable<any> {
        // Get notification list between the date range

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/notifications/ `, daterange, httpOptions);
    }

    getNotificationListAll(data: any): Observable<any> {
        // Get notification list between the date range

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/Allnotifications `, data, httpOptions);
    }


    // Vehicle Report
    getVehicleReportList(data: { useType: any; loginName: any; }): Observable<any> {
        // Get vehicle report list data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/vehicle/vehiclereport`, data, httpOptions);
    }
    getReportQATestMappedData(data: any): Observable<any> {
        // Get Report QA test data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/qatest/dataliveforDevice`, data, httpOptions);
    }


    getReportQATestUnmappedData(): Observable<any> {
        // Get Report QA test Unmapped data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/reports/qatest/unmappedDevice`, httpOptions);
    }
    getReportQATestUnmappedRawData(data: { deviceID: any; }): Observable<any> {
        // Get Report QA test Unmapped Raw data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/qatest/unmappedDevicerawData`, data, httpOptions);
    }


    getQATestMachineData(data: any): Observable<any> {
        // Get QA data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/qatest/qaiddatalive`, data, httpOptions);
    }
    getQATestBatchData(data: any): Observable<any> {
        // Get QA data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/qatest/qaidbatch`, data, httpOptions);
    }
    getMachineUtilizationData(data: any) {
        // Get Machine Utilization report data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/utilization`, data, httpOptions);
    }
    getPinno(data: any): Observable<any> {
        // Get pinno list by device model and variant

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/transaction/unbilled/machines`, data, httpOptions);
    }
    getEngineOff(data: any): Observable<any> {
        // Get engine off data between date range and by pinno

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/vehicletrack/engineoff`, data, httpOptions);
    }
    getEngineOn(data: any): Observable<any> {
        // Get engine on data between date range and by pinno

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/vehicletrack/engineon`, data, httpOptions);
    }

    getLocationFromlatlang(): Observable<any> {
        // Get Location address from Latitude Langitude
        const lat = 28.612673;
        const lng = 77.2772634;
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDITud13UV0N6Y58jk0AWInr5y52lJ4rsY`);
    }

    getReportQATestForRowDataAPI(data: any): Observable<any> {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/reports/qatest/qaid`, data, httpOptions);
    }
    createUserlogs(data: { loginName: any; module: string; function: string; type: string; }): Observable<any> {
        // For creating user logs

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/userlogs/Create`, data, httpOptions);
    }

    GetUserlogsSummaryData(data: any): Observable<any> {
        // Get list of user logs summary

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        const URL = environment.apiUrl + '/userlogs/getSummary';
        return this.http.post(URL, data, httpOptions);
    }

    GetUserlogsDetailsData(data: any): Observable<any> {
        // Get list of user logs details

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        const URL = environment.apiUrl + '/userlogs';
        return this.http.post(URL, data, httpOptions);
    }

    // Service
    // Upcoming service page details start here
    getUpcomingServices(data: { useType: any; loginName: any; }): Observable<any> {
        // 1. Get upcoming services data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/services/machines`, data, httpOptions);
    }
    registerService(id: any, data: any): Observable<any> {
        // 2. Register an upcoming service and convert in scheduled service

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/services/machines/${id}`, data, httpOptions);
    }

    // Upcoming service page details ends here

    // Scheduled or completed Services page details start here
    getCreatedServices(data: { useType: any; loginName: any; }): Observable<any> {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };

        return this.http.post(`${environment.apiUrl}/services/machines/getService`, data, httpOptions);

    }
    getCreatedServicesByMachine(id: any, snum: any): Observable<any> {
        // 4. Get upcoming master service schedule by pinno and service number

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/services/machines/${id}/${snum}`, httpOptions);
    }
    serviceUpdate(pinno: any, num: any, data: any) {
        // 5. Update service data and set status as close

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.put(`${environment.apiUrl}/services/machines/${pinno}/${num}`, data, httpOptions);
    }
    newService(id: any, data: any): Observable<any> {
        // update service by pinno and service details

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/services/machines/${id}`, data, httpOptions);
    }

    getCategory() {
        // Get category data by pinno and service number

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/masters/categories`, httpOptions);
    }
    getSubCategory(data: any) {
        // Get subcategory by category

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/masters/categories`, data, httpOptions);
    }


    // Geo-Fencing
    getAllGeofenceList(data: { useType: any; loginName: any; }): Observable<any> {
        // Get all geofence list

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/vehicle/geo-fence/getAll`, data, httpOptions);
    }

    getGeoFenceLocationList(): Observable<any> {
        // Get all geofence location list

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/masters/poi`, httpOptions);
    }
    createNotification(data: { machineno: any; title: string; pinno: any; message: string; deviceID: any; mobileno: any; companyID: any; deviceModel: any; type: any; status: number; for?: string; }): Observable<any> {
        // Insert into notificationjob collection (send sms)

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/notifications/create`, data, httpOptions);
    }
    addLocation(data: any): Observable<any> {
        // Add geofence location data

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.put(`${environment.apiUrl}/vehicle/geo-fence`, data, httpOptions);
    }
    deleteLocationGeofence(data: any): Observable<any> {
        // Delete geofence location data
        const header = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmJiM2M2YmMyMGUwZjM2MzgzNDM1ZTIiLCJpYXQiOjE2MTAzNDEzMjksImV4cCI6MTYxMDk0NjEyOX0.c5Dp4ILdwL3Zc68nxU9UAb5atlvTn0EF8MTJxkFRZmk', companyID: environment.companyID });
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/vehicle/geo-fence`, data, httpOptions);
    }
    getLocationAddress(lat: number, lng: number): Observable<any> {
        // Get location address
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAMDelQFr1mwJz0whw7L9Bu1BFQ3hvbxZg`);
    }
    changePassword(data: any) {
        // Change password

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.put(`${environment.apiUrl}/users/password/change`, data, httpOptions);

    }
    getLocationInfo(appURL: string): Observable<any> {
        // get the  location by openstreetmap
        return this.http.get(appURL);
    }
    forgotPassword(data: { referanceData: any; secretCode: string; }) {

        const header = new HttpHeaders({ 'Content-Type': 'application/json', companyID: environment.companyID });
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/users/forgotPassword`, data, httpOptions);
    }
    getEmailIDToken(id: string, token: any) {
        // Get email id token
        const header = new HttpHeaders({ 'Content-Type': 'application/json', companyID: environment.companyID });
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/users/getEmailIdTokenAndIdData/${id}/${token}`, httpOptions);
    }
    resetPassword(data: { password: any; password2: any; }, data1: { _id: any; token: any; }) {
        const header = new HttpHeaders({ 'Content-Type': 'application/json', companyID: environment.companyID, _id: data1._id, token: data1.token });
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/users/resetPassword`, data, httpOptions);
    }
    updateEngHours(data: any) {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/items/updateItemData`, data, httpOptions);
    }

    createOnDemandService(data: any) {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/services/machines/OndemandService`, data, httpOptions);
    }
    getAllRoles(): Observable<any> {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.get(`${environment.apiUrl}/roles`, httpOptions);
    }
    getRoleByCode(data: { code: any; }): Observable<any> {
        // Get role details by roleID

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.post(`${environment.apiUrl}/roles/getRoleByCode`, data, httpOptions);
    }
    updateRoleByCode(id: any, data: { roleMenus: { dashboard: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; roles: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; masters: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; model: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; variant: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; machine: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; device: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; customer: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; location: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; geofence: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; shipment: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; service: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; reports: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; trackvehicles: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; services: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; schedules: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; update: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; createondemand: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; usermanagement: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; users: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; dealers: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; vehicle: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; batch: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; serviceReport: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; machineUtilization: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; qatesting: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; analytics: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; subscription: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; noniotMachines: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; userlogs: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; battery: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; fuel: { link: boolean; add: boolean; edit: boolean; delete: boolean; level: any; }; }; roleIDs: any; alternateIDs: any; isActive: boolean; name: any; useType: any; description: any; companyID: any; createdBy: any; code: any; createdAt: any; updatedAt: Date; updatedBy: any; createdDate: any; id: any; }): Observable<any> {

        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token, companyID: environment.companyID }) };
        return this.http.put(`${environment.apiUrl}/roles/update/${id}`, data, httpOptions);
    }
}
