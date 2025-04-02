import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class ReparationService {

  private apiUrl = `${environment.apiUrl}/api/reparations`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  creerReparation(id_devis: string, id_mecanicien: string, services: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { id_devis, id_mecanicien, services }, { headers: this.getHeaders() });
  }

  getAllReparations(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getReparationsMecaniciens(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reparation_mecanicien`, { headers: this.getHeaders() });
  }

  mettreAJourStatutReparation(id_reparation: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/a_jour/${id_reparation}`, {}, { headers: this.getHeaders() });
  }

  getReparations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reparations`, { headers: this.getHeaders() });
  }

  // Démarrer une réparation
  demarrerReparation(idReparation: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idReparation}/demarrer`, {});
  }

  // Terminer une réparation
  terminerReparation(idReparation: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idReparation}/terminer`, {});
  }
}
