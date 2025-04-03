import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment.prod';



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
}
