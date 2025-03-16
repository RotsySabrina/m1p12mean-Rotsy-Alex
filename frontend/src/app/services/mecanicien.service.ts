import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MecanicienService {
  private apiUrl = `${environment.apiUrl}/api/mecaniciens`; // Vérifie que ton backend attend bien "/add"

  constructor(private http: HttpClient) {}

  addMecanicien(mecanicien: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}`, mecanicien, { headers }).pipe(
      catchError(error => {
        console.error("Erreur lors de l'ajout du mécanicien :", error);
        return throwError(() => error);
      })
    );
  }
}
