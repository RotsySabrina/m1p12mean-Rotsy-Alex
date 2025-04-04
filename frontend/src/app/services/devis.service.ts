import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';



@Injectable({
  providedIn: 'root'
})
export class DevisService {
private apiUrl = `${environment.apiUrl}/api/devis`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDevis(): Observable<any> {
    return this.http.get(`${this.apiUrl}/client`, { headers: this.getHeaders() });
  }

  updateStatus(id: string, status: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}`, {status}, { headers: this.getHeaders() });
  }

  getStat(annee: string): Observable<any> {
    const params = new HttpParams().set('annee', annee); // Utilisation de HttpParams
  
    return this.http.get(`${this.apiUrl}/stat`, {
      headers: this.getHeaders(),
      params: params // Passage des paramètres dans la requête
    });
  }
  
}
