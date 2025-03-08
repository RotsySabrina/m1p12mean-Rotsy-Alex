import { Routes } from '@angular/router';
import { CategorieServiceListComponent } from './components/categorie-service-list/categorie-service-list.component';

export const routes: Routes = [

    { path: 'categorie_services', component: CategorieServiceListComponent }, // Route pourarticle - list
    { path: '', redirectTo: 'categorie_services', pathMatch: 'full' } // Redirectiontutorial - par défaut


];
