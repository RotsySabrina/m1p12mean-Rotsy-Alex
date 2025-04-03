import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MecanicienDisponibleService {

  private apiUrl = `${environment.apiUrl}/api/mecanicien_disponibles`;


  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMecaDispos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error("Erreur lors de l'ajout du mécanicien :", error);
        return throwError(() => error);
      }));
  }

  addMecaDispo(meca_dispo: any): Observable<any> {
    return this.http.post(this.apiUrl, meca_dispo, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error("Erreur lors de l'ajout du mécanicien :", error);
        return throwError(() => error);
      })
    );
  }

  updateMecaDispo(id: string, meca_dispo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, meca_dispo, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error("Erreur lors de l'ajout du mécanicien :", error);
        return throwError(() => error);
      }));
  }

  deleteMecaDispo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error("Erreur lors de l'ajout du mécanicien :", error);
        return throwError(() => error);
      }));
  }
}
