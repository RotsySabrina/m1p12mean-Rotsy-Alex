import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReparationServiceService {
  private apiUrl = 'http://localhost:5000/api/reparation_services';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDetailReparation(id_reparation: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/services/${id_reparation}`, {headers: this.getHeaders()});
  }

  updateServiceStatus(idService: string, status: string, observations: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idService}`, { status, observations });
  }
}
