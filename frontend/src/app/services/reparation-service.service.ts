import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReparationServiceService {
  private apiUrl = 'http://localhost:5000/api/reparation-services';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Mettre à jour le statut d'un service dans une réparation
  updateServiceStatus(idService: string, status: string, observations: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idService}`, { status, observations });
  }
}
