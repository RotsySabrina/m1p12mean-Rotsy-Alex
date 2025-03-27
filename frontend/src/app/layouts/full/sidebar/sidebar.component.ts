import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthentificationService } from '../../../services/authentification.service';
import { navItems } from './sidebar-data'; // Liste des éléments de navigation
import { BrandingComponent } from './branding.component';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [BrandingComponent, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidebarComponent implements OnInit {

  @Input() showToggle: boolean = false;  // Ajoute @Input() pour accepter la valeur depuis le parent
  @Output() toggleMobileNav = new EventEmitter<void>();  // Émet un événement pour informer le parent

  public filteredNavItems: any[] = []; // Liste filtrée des éléments de navigation
  public userRole: string | null = ''; // Déclare une variable pour le rôle de l'utilisateur

  constructor(private authService: AuthentificationService) { }

  ngOnInit(): void {
    this.userRole = this.authService.getRole(); // Récupérer le rôle de l'utilisateur
    console.log('User Role:', this.userRole); // Vérifie que le rôle est bien récupéré

    // Filtrer les éléments de la sidebar en fonction du rôle de l'utilisateur
    this.filteredNavItems = navItems.filter(item =>
      Array.isArray(item.roles) && item.roles.includes(this.userRole ?? '')
    );
  }

  // Vérifier si un élément peut être accessible par l'utilisateur
  canAccess(item: any): boolean {
    return Array.isArray(item.roles) && item.roles.includes(this.userRole ?? '');
  }


}
