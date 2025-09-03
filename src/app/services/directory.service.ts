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

}
