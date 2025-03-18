import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RendezVousClientService {

  private apiUrl = `${environment.apiUrl}/api/rendez_vous_client`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getRendezVousClients(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  addRendezVousClient(rendez_vous_client: any): Observable<any> {
    return this.http.post(this.apiUrl, rendez_vous_client, { headers: this.getHeaders() });
  }

  updateRendezVousClient(id: string, rendez_vous_client: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, rendez_vous_client, { headers: this.getHeaders() });
  }

  deleteRendezVousClient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
