import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';

import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MecanicienService {
  private apiUrl = `${environment.apiUrl}/api/mecaniciens`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Ajouter un mécanicien
  addMecanicien(mecanicien: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, mecanicien, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error("Erreur lors de l'ajout du mécanicien :", error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer tous les mécaniciens avec leurs spécialisations
  getMecaniciens(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error("Erreur lors de la récupération des mécaniciens :", error);
        return throwError(() => error);
      })
    );
  }

  // Mettre à jour un mécanicien
  updateMecanicien(id: string, mecanicien: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, mecanicien, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error("Erreur lors de la mise à jour du mécanicien :", error);
        return throwError(() => error);
      })
    );
  }

  // Supprimer un mécanicien
  deleteMecanicien(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error("Erreur lors de la suppression du mécanicien :", error);
        return throwError(() => error);
      })
    );
  }
}
