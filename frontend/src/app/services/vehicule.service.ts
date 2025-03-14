import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = `${environment.apiUrl}/api/vehicules`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getVehicules(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  addVehicule(vehicule: any): Observable<any> {
    return this.http.post(this.apiUrl, vehicule, { headers: this.getHeaders() });
  }

  updateVehicule(id: string, vehicule: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, vehicule, { headers: this.getHeaders() });
  }

  deleteVehicule(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
