import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VehiculeServiceService {

  private apiUrl = `${environment.apiUrl}/api/devis`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    // console.log('🔍 Token récupéré depuis localStorage:', token);

    if (!token) {
      console.warn('⚠️ Aucun token trouvé dans localStorage');
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addDevis(devis: any): Observable<any> {
    return this.http.post(this.apiUrl, devis, { headers: this.getHeaders() });
  }
}
