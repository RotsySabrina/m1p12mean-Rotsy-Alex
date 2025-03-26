import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ManagerRdvService {

  private apiUrl = `${environment.apiUrl}/api/rendez_vous_client`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  getUpcomingRendezVous(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rendez-vous-a-venir`, { headers: this.getHeaders() });
  }

  updateRendezVousMecanicien(rendezVousId: string, mecanicienId: string): Observable<any> {
    const body = { rendezVousId, mecanicienId };
    return this.http.put(`${this.apiUrl}/ajout-meca`, body, { headers: this.getHeaders() });
  }

}
