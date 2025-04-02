import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class MecanicienRdvService {
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
      return this.http.get(`${this.apiUrl}/rendez-vous-mecanicien`, { headers: this.getHeaders() });
    }
}
