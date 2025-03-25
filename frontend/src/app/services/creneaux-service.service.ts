import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreneauxServiceService {
  private apiUrl = `${environment.apiUrl}/api/creneaux/creneaux-dispo`;

  constructor(private http: HttpClient) { }


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    // console.log('🔍 Token récupéré depuis localStorage:', token);

    if (!token) {
      console.warn('⚠️ Aucun token trouvé dans localStorage');
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCreneauxDisponibles(date: string, categorieServices: string[]): Observable<any> {
    const params = { date, categorieServices: JSON.stringify(categorieServices) };
    const headers = this.getHeaders();

    // console.log('📅 Date envoyée:', date);
    // console.log('🛠️ Catégorie Services:', categorieServices);

    return this.http.post<any>(this.apiUrl, {}, { headers, params });
  }
}
