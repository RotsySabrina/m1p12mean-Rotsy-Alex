import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../services/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthentificationService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole = route.data['role'];  // Récupère le rôle requis pour la route
    const userRole = this.authService.getRole();  // Récupère le rôle de l'utilisateur actuel

    console.log('Role Guard: expectedRole =', expectedRole, 'userRole =', userRole);  // Ajoute un log pour débugger

    if (userRole === expectedRole) {
      return true;  // Si les rôles correspondent, l'utilisateur peut accéder à la route
    } else {
      console.log('Access denied, redirecting to login...');
      this.router.navigate(['/login']);  // Sinon, redirige l'utilisateur vers la page de login
      return false;  // Bloque l'accès à la route
    }
  }

}
