import { Component, OnInit ,ViewChild} from '@angular/core';
import { CategorieServiceService } from '../../../services/categorie-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { AlerteService } from 'src/app/services/alerte.service';
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginator } from 'src/app/custom-paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-categorie-service-list',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './categorie-service-list.component.html',
  styleUrls: ['./categorie-service-list.component.css','../facture/facture.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }]
})
export class CategorieServiceListComponent implements OnInit {

  message: string | null = null;
  isSuccess: boolean = true;

  newCategorie = { description: '', duree: '' };
  displayedColumns: string[] = ['description', 'duree', 'actions'];
  categories: any[] = [];

  editedCategorie: any = null;

  dataSource = new MatTableDataSource<any>([]); 
         
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;

  constructor(private categorieService: CategorieServiceService,
    private alerteService: AlerteService) {
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
    this.loadCategories();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadCategories(): void {
    this.categorieService.getCategories().subscribe(
      data => {
        if (data) {
          this.categories =data;
          this.dataSource.data = this.categories;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          
          this.dataSource.sort = this.sort;
          console.log("✅ categorie services chargées avec succès:", this.categories);
        } else {
          console.warn("⚠️ Aucune réparation trouvée dans la réponse.");
        }
      },
      error => {
        console.error("❌ Erreur lors du chargement des categorie services:", error);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteCategorie(id: string): void {
    if (confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      this.categorieService.deleteCategorie(id).subscribe({
        next: () => {
          this.loadCategories();
          this.alerteService.showMessage("Catégorie supprimée avec succès", true);
        },
        error: () => this.alerteService.showMessage("Erreur lors de la suppression de la catégorie", false)
      });
    }
  }


  addCategorie(): void {
    if (this.newCategorie.description && this.newCategorie.duree) {
      this.categorieService.addCategorie(this.newCategorie).subscribe({
        next: () => {
          this.loadCategories();
          this.newCategorie = { description: '', duree: '' };
          this.alerteService.showMessage("Catégorie ajoutée avec succès", true);
        },
        error: () => this.alerteService.showMessage("Erreur lors de l'ajout de la catégorie", false)
      });
    } else {
      this.alerteService.showMessage("Veuillez remplir la description", false);
    }
  }

  editCategorie(categorie: any): void {
    this.editedCategorie = { ...categorie }; // Cloner l'objet pour éviter la modification directe
  }

  saveCategorie(): void {
    if (this.editedCategorie) {
      this.categorieService.updateCategorie(this.editedCategorie._id, this.editedCategorie).subscribe({
        next: (updatedCategorie) => {
          const index = this.categories.findIndex(s => s._id === updatedCategorie._id);
          if (index !== -1) {
            this.categories[index] = updatedCategorie;
          }
          this.editedCategorie = null;
          this.alerteService.showMessage("Catégorie mise à jour avec succès", true);
        },
        error: () => this.alerteService.showMessage("Erreur lors de la mise à jour de la catégorie", false)
      });
    }
  }

  cancelEdit(): void {
    this.editedCategorie = null; // Annuler l'édition
  }


}
