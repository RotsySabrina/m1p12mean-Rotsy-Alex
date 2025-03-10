import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieServiceService {
  private apiUrl = 'http://localhost:5000/categorie_services';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addCategorie(categorie: any): Observable<any> {
    return this.http.post(this.apiUrl, categorie);
  }

}
 