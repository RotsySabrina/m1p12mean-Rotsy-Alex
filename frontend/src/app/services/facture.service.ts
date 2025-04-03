import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
private apiUrl = `${environment.apiUrl}/api/facture`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  genereFacture(idDevis: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${idDevis}`, {}, { headers: this.getHeaders() });
  }

  getFacturesByClient(): Observable<any>{
    return this.http.get(`${this.apiUrl}/factures`, { headers: this.getHeaders() });
  }
}
