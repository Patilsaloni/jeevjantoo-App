import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  private apiBase = 'http://localhost:3000/api/v1'; // change to your backend

  constructor(private http: HttpClient) {}

  getAdoptions(params?: any): Observable<any> {
    return this.http.get(`${this.apiBase}/adoptions`, { params });
  }
}
