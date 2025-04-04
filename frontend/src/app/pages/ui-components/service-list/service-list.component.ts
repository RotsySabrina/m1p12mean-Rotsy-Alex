import { Component, OnInit ,ViewChild} from '@angular/core';
import { ServiceService } from '../../../services/service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategorieServiceService } from '../../../services/categorie-service.service';
import { MaterialModule } from 'src/app/material.module';
import { AlerteService } from '../../../services/alerte.service';  // Ajout du service d'alerte
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginator } from 'src/app/custom-paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-service-list',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css','../facture/facture.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }]
})

export class ServiceListComponent implements OnInit {

  message: string | null = null;
  isSuccess: boolean = true;
  services: any[] = [];
  categories: any[] = [];
  displayedColumns: string[] = ['categorie', 'description', 'cout', 'actions'];
  newService = { description: '', cout: '', id_categorie_service: '' };

  dataSource = new MatTableDataSource<any>([]); 
       
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

  editedService: any = null; // Stocke le service en cours d'édition

  constructor(
    private serviceService: ServiceService,
    private categorieService: CategorieServiceService,
    private alerteService: AlerteService  // Injection du service d'alerte
  ) {
    this.alerteService.message$.subscribe(msg => {
      this.message = msg;
      this.isSuccess = this.alerteService.getSuccessStatus();

      // Masquer l'alerte après 3 secondes
      setTimeout(() => {
        this.message = null;
      }, 3000);
    });
  }

  ngOnInit(): void {
    this.loadServices();
    this.getCategories();
    
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
  
      return (
        data.id_categorie_service.description.toLowerCase().includes(transformedFilter) || // Recherche sur la catégorie
        data.description.toLowerCase().includes(transformedFilter) || // Recherche sur la description
        data.cout.toString().includes(transformedFilter) // Recherche sur le coût
      );
    };
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe(
      data =>{
      if (data) {
        this.services = data;
        this.dataSource.data = this.services;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        
        this.dataSource.sort = this.sort;
        console.log("✅ services chargées avec succès:", this.services);
      } else {
        console.warn("⚠️ Aucune réparation trouvée dans la réponse.");
      }
    },
    error => {
      console.error("❌ Erreur lors du chargement des services:", error);
    }
  );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCategories(): void {
    this.categorieService.getCategories().subscribe(data => this.categories = data)
  }

  addService(): void {
    if (this.newService.description && this.newService.cout && this.newService.id_categorie_service) {
      this.serviceService.addService(this.newService).subscribe({
        next: () => {
          this.loadServices();
          this.newService = { description: '', cout: '', id_categorie_service: '' };
          this.alerteService.showMessage("Service ajouté avec succès", true);
        },
        error: () => this.alerteService.showMessage("Erreur lors de l'ajout du service", false)
      });
    } else {
      this.alerteService.showMessage("Veuillez remplir tous les champs", false);
    }
  }

  editService(service: any): void {
    this.editedService = { ...service }; // Cloner l'objet pour éviter la modification directe
  }

  saveService(): void {
    if (this.editedService) {
      this.serviceService.updateService(this.editedService._id, this.editedService).subscribe({
        next: (updatedService) => {
          const index = this.services.findIndex(s => s._id === updatedService._id);
          if (index !== -1) {
            this.services[index] = updatedService;
          }
          this.editedService = null; // Quitter le mode édition
          this.alerteService.showMessage("Service mis à jour avec succès", true);
        },
        error: () => this.alerteService.showMessage("Erreur lors de la mise à jour du service", false)
      });
    }
  }

  deleteService(id: string): void {
    if (confirm("Voulez-vous vraiment supprimer ce service ?")) {
      this.serviceService.deleteService(id).subscribe({
        next: () => {
          this.loadServices();
          this.alerteService.showMessage("Service supprimé avec succès", true);
        },
        error: () => this.alerteService.showMessage("Erreur lors de la suppression du service", false)
      });
    }
  }

  cancelEdit(): void {
    this.editedService = null; // Annuler l'édition
  }
}