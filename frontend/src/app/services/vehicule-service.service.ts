import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VehiculeServiceService {

  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token') || '';
        return new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
  }

  getServicesByCategoryForRdv(id_rendez_vous_client: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/rdv_services/${id_rendez_vous_client}`, { headers: this.getHeaders() });
  }

  addRendezVousServices(id_rendez_vous_client: string, idServices: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/rdv_services`, 
      { id_rendez_vous_client, idServices }, 
      { headers: this.getHeaders() }
    );
  }

  selectRendezVousServices(id_rendez_vous_client: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/rdv_services/get_rdv_services/${id_rendez_vous_client}`, { headers: this.getHeaders() });
  }  
  
  addDevis(id_rendez_vous_client: string, montant_total: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/devis`, { id_rendez_vous_client, montant_total }, { headers: this.getHeaders() });
  }
}
