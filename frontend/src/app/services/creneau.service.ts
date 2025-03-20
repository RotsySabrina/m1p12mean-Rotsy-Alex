import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreneauService {
  private apiUrl = 'http://localhost:5000/api/creneaux/creneaux-dispo';

  constructor(private http: HttpClient) {}

  getCreneauxDisponibles(date: string, categorieServices: string[]): Observable<any> {
    const params = {
      date: date,
      categorieServices: JSON.stringify(categorieServices)
    };
    return this.http.get<any>(this.apiUrl, { params });
  }
}
