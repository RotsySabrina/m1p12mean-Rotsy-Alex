import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReparationServiceService {
  private apiUrl = 'http://localhost:5000/api/reparation-services';

  constructor(private http: HttpClient) {}

  // Mettre à jour le statut d'un service dans une réparation
  updateServiceStatus(idService: string, status: string, observations: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idService}`, { status, observations });
  }
}
