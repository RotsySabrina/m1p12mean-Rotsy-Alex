import { Routes } from '@angular/router';

// ui
import { ServiceListComponent } from './service-list/service-list.component';
import { CategorieServiceListComponent } from './categorie-service-list/categorie-service-list.component';
import { VehiculeListComponent } from './vehicule-list/vehicule-list.component';
import { MecanicienListComponent } from './mecanicien-list/mecanicien-list.component';
import { RendezVousClientComponent } from './rendez-vous-client/rendez-vous-client.component';
import { CreneauxListComponent } from './creneaux-list/creneaux-list.component';
import { MecanicienDisponibleListComponent } from './mecanicien-disponible-list/mecanicien-disponible-list.component';
import { ManagerRdvComponent } from './manager-rdv/manager-rdv.component';
import { MecanicienRdvComponent } from './mecanicien-rdv/mecanicien-rdv.component';
import { StatistiqueRendezVousComponent } from './statistique-rendez-vous/statistique-rendez-vous.component';
import { RoleGuard } from '../../auth/role.guard';
import { VehiculeServiceComponent } from './vehicule-service/vehicule-service.component';
import {DevisComponent} from './devis/devis.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'stat_rdv',
        component: StatistiqueRendezVousComponent,
        canActivate: [RoleGuard],
        data: { role: 'manager' }  // Ici, seul un utilisateur avec le rôle 'manager' peut accéder à cette route
      },
      {
        path: 'mecanicien_rdv',
        component: MecanicienRdvComponent,
      },
      {
        path: 'vehicule_service/:id',
        component: VehiculeServiceComponent,
      },
      {
        path: 'manager_rdv',
        component: ManagerRdvComponent,
        canActivate: [RoleGuard],
        data: { role: 'manager' }
      },
      {
        path: 'meca_dispo',
        component: MecanicienDisponibleListComponent,
        canActivate: [RoleGuard],
        data: { role: 'mecanicien' }
      },
      {
        path: 'statistiques',
        component: CreneauxListComponent,
        canActivate: [RoleGuard],
        data: { role: 'manager' }
      },
      {
        path: 'creneaux',
        component: CreneauxListComponent
      },
      {
        path: 'rendez_vous_client',
        component: RendezVousClientComponent,
        canActivate: [RoleGuard],
        data: { role: 'client' }
      },
      {
        path: 'mecaniciens',
        component: MecanicienListComponent,
        canActivate: [RoleGuard],
        data: { role: 'manager' }
      },
      {
        path: 'vehicules',
        component: VehiculeListComponent
      },
      {
        path: 'categorie_services',
        component: CategorieServiceListComponent
      },
      {
        path: 'services',
        component: ServiceListComponent
      },
      {
        path: 'devis',
        component: DevisComponent
      },
    ],
  },
];
