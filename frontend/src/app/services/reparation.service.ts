import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReparationService {

  private apiUrl = 'http://localhost:5000/api/reparations';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  creerReparation(id_devis: string, id_mecanicien: string, services: any[]): Observable<any>{
    return this.http.post(`${this.apiUrl}`, {id_devis, id_mecanicien, services}, {headers: this.getHeaders()});
  }

  getAllReparations(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, {headers: this.getHeaders()});
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
