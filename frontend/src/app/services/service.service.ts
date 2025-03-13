import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'http://localhost:5000/services';

  constructor(private http: HttpClient) { }

  getServices(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addService(service: any): Observable<any> {
    return this.http.post(this.apiUrl, service);
  }

  updateService(id: string, service: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
