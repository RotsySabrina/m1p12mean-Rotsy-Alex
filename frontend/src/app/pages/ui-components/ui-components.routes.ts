import { Routes } from '@angular/router';

// ui
import { ServiceListComponent } from './service-list/service-list.component';
import { CategorieServiceListComponent } from './categorie-service-list/categorie-service-list.component';
import { VehiculeListComponent } from './vehicule-list/vehicule-list.component';
import { MecanicienListComponent } from './mecanicien-list/mecanicien-list.component';
import { RendezVousClientComponent } from './rendez-vous-client/rendez-vous-client.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'rendez_vous_client',
        component: RendezVousClientComponent,
      },
      {
        path: 'mecaniciens',
        component: MecanicienListComponent,
      },
      {
        path: 'vehicules',
        component: VehiculeListComponent,
      },
      {
        path: 'categorie_services',
        component: CategorieServiceListComponent,
      },
      {
        path: 'services',
        component: ServiceListComponent,
      },
    ],
  },
];
