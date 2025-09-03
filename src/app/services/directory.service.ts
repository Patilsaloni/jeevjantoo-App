import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  private apiBase = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  getCounts(): Observable<any> {
    return this.http.get(`${this.apiBase}/counts`);
  }

 getClinics(params?: any): Observable<any> {
  let query = '';
  if (params?.type) query += `type=${params.type}&`;
  if (params?.city) query += `city=${params.city}&`;

  return this.http.get(`${this.apiBase}/clinics?${query}`);
}
getNGOs(params?: any): Observable<any> {
  let query = '';
  if (params?.type) query += `type=${params.type}&`;
  if (params?.city) query += `city=${params.city}&`;

  return this.http.get(`${this.apiBase}/ngos?${query}`);
}

// directory.service.ts
getAmbulances(params?: any): Observable<any> {
  let query = '';
  if (params?.q) query += `q=${params.q}&`;
  if (params?.city) query += `city=${params.city}&`;
  if (params?.area) query += `area=${params.area}&`;
  if (params?.userLat) query += `userLat=${params.userLat}&`;
  if (params?.userLng) query += `userLng=${params.userLng}&`;
  if (params?.radius) query += `radius=${params.radius}&`;
  if (params?.page) query += `page=${params.page}&`;
  if (params?.pageSize) query += `pageSize=${params.pageSize}&`;

  return this.http.get(`${this.apiBase}/ambulance?${query}`);
}

getBoardingSpa(params?: any): Observable<any> {
  let query = '';
  if (params?.q) query += `q=${params.q}&`;
  if (params?.location) query += `location=${params.location}&`;
  if (params?.type) query += `type=${params.type}&`;
  if (params?.userLat) query += `userLat=${params.userLat}&`;
  if (params?.userLng) query += `userLng=${params.userLng}&`;
  if (params?.radius) query += `radius=${params.radius}&`;
  if (params?.page) query += `page=${params.page}&`;
  if (params?.pageSize) query += `pageSize=${params.pageSize}&`;

  return this.http.get(`${this.apiBase}/boarding-spa?${query}`);
}


// directory.service.ts
getGovtHelpline(params?: any): Observable<any> {
  let query = '';
  if (params?.q) query += `q=${params.q}&`;
  if (params?.userLat) query += `userLat=${params.userLat}&`;
  if (params?.userLng) query += `userLng=${params.userLng}&`;
  if (params?.radius) query += `radius=${params.radius}&`;
  if (params?.page) query += `page=${params.page}&`;
  if (params?.pageSize) query += `pageSize=${params.pageSize}&`;

  return this.http.get(`${this.apiBase}/govthelpline?${query}`);
}

getFeeding(params?: any): Observable<any> {
  let query = '';
  if (params?.q) query += `q=${params.q}&`;
  if (params?.location) query += `location=${params.location}&`;
  if (params?.userLat) query += `userLat=${params.userLat}&`;
  if (params?.userLng) query += `userLng=${params.userLng}&`;
  if (params?.radius) query += `radius=${params.radius}&`;
  if (params?.page) query += `page=${params.page}&`;
  if (params?.pageSize) query += `pageSize=${params.pageSize}&`;

  return this.http.get(`${this.apiBase}/feeding?${query}`);
}

getMedicalInsurance(params?: any): Observable<any> {
  let query = '';
  if (params?.q) query += `q=${params.q}&`;
  if (params?.city) query += `city=${params.city}&`;
  if (params?.coverage_type) query += `coverage_type=${params.coverage_type}&`;
  if (params?.minSum) query += `minSum=${params.minSum}&`;
  if (params?.maxPremium) query += `maxPremium=${params.maxPremium}&`;
  if (params?.page) query += `page=${params.page}&`;
  if (params?.pageSize) query += `pageSize=${params.pageSize}&`;

  return this.http.get(`${this.apiBase}/medicalinsurance?${query}`);
}


}
