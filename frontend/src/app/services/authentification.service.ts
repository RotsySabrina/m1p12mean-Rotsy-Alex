import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private apiUrl = `${environment.apiUrl}/api/auth`; // Utilisation de l'URL de l'API

  constructor(private http: HttpClient) {}

  // Inscription d'un utilisateur
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Connexion d'un utilisateur
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Sauvegarder le token dans le stockage local
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Récupérer le token depuis le stockage local
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Supprimer le token (déconnexion)
  logout(): void {
    localStorage.removeItem('token');
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
