import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class CategorieServiceService {
  private apiUrl =  `${environment.apiUrl}/categorie_services`; 

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addCategorie(categorie: any): Observable<any> {
    return this.http.post(this.apiUrl, categorie);
  }

  updateCategorie(id: string, categorie: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categorie);
  }
  
  deleteCategorie(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
