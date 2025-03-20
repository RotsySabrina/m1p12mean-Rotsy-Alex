import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CreneauxService {

  private apiUrl = `${environment.apiUrl}/api/creneaux`;


  constructor(private http: HttpClient) { }

  getCreneaux(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addCreneaux(creneaux: any): Observable<any> {
    return this.http.post(this.apiUrl, creneaux);
  }

  updateCreneaux(id: string, creneaux: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, creneaux);
  }

}
