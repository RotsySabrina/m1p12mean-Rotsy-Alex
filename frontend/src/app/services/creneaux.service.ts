import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CreneauxService {

  private apiUrl = `${environment.apiUrl}/api/creneaux`;


  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    // console.log('🔍 Token récupéré depuis localStorage:', token);

    if (!token) {
      console.warn('⚠️ Aucun token trouvé dans localStorage');
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  getCreneaux(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  addCreneaux(creneaux: any): Observable<any> {
    return this.http.post(this.apiUrl, creneaux, { headers: this.getHeaders() });
  }

  updateCreneaux(id: string, creneaux: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, creneaux, { headers: this.getHeaders() });
  }

}
