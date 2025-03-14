import { Component, OnInit } from '@angular/core';
import { CategorieServiceService } from '../../../services/categorie-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-categorie-service-list',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './categorie-service-list.component.html',
  styleUrl: './categorie-service-list.component.css'
})
export class CategorieServiceListComponent implements OnInit {

  newCategorie = { description: '' };
  displayedColumns: string[] = ['description', 'actions'];
  categories: any[] = [];

  editedCategorie: any = null; 

  constructor(private categorieService: CategorieServiceService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categorieService.getCategories().subscribe(data => this.categories =
      data);
  }

  deleteCategorie(id: string): void {
    console.log("Suppression de la catégorie avec ID :", id);
    this.categorieService.deleteCategorie(id).subscribe(() => {
      console.log("Catégorie supprimée avec succès !");
      this.loadCategories(); 
    }, error => {
      console.error("Erreur lors de la suppression :", error);
    });
  }
  

  addCategorie(): void {
    if (this.newCategorie.description) {
      this.categorieService.addCategorie(this.newCategorie).subscribe(() => {
        this.loadCategories(); // Recharge la liste après ajout
        this.newCategorie = { description: '' }; // Réinitialise le formulaire
      });
    }
  }

  editCategorie(categorie: any): void {
    this.editedCategorie = { ...categorie }; // Cloner l'objet pour éviter la modification directe
  }

  saveCategorie(): void {
    if (this.editedCategorie) {
      this.categorieService.updateCategorie(this.editedCategorie._id, this.editedCategorie).subscribe(updatedCategorie => {
        // Mettre à jour la liste localement après modification
        const index = this.categories.findIndex(s => s._id === updatedCategorie._id);
        if (index !== -1) {
          this.categories[index] = updatedCategorie;
        }
        this.editedCategorie = null; // Quitter le mode édition
      });
    }
  }

  cancelEdit(): void {
    this.editedCategorie = null; // Annuler l'édition
  }


}
