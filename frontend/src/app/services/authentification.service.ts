import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private apiUrl = `${environment.apiUrl}/api/auth`; // URL API

  constructor(private http: HttpClient) { }

  // Inscription
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Connexion
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token && response.role) {
          this.saveToken(response.token);
          this.saveRole(response.role); // 🔥 Stocker le rôle
        }
      })
    );
  }

  // Sauvegarder le token
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Sauvegarder le rôle
  saveRole(role: string): void {
    localStorage.setItem('role', role);
  }

  getRole(): string | null {
    const role = localStorage.getItem('role');
    console.log('getRole:', role);  // Vérifie que le rôle est bien récupéré
    return role;
  }


  // Vérifier le rôle
  isManager(): boolean {
    return this.getRole() === 'manager';
  }

  isMecanicien(): boolean {
    return this.getRole() === 'mecanicien';
  }

  isClient(): boolean {
    return this.getRole() === 'client';
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // 🔥 Supprimer aussi le rôle
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
