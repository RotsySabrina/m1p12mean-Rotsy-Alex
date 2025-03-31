import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReparationService {

  private apiUrl = 'http://localhost:5000/api/reparations';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les réparations
  getAllReparations(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
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
