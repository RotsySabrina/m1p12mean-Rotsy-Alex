import { Routes } from '@angular/router';

// ui
import { ServiceListComponent } from './service-list/service-list.component';
import { CategorieServiceListComponent } from './categorie-service-list/categorie-service-list.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
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
