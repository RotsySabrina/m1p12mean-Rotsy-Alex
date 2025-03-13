import { Component, OnInit } from '@angular/core';
import { CategorieServiceService } from '../../services/categorie-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-categorie-service-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './categorie-service-list.component.html',
  styleUrl: './categorie-service-list.component.css'
})
export class CategorieServiceListComponent implements OnInit {

  newCategorie = { description: '' };

  categories: any[] = [];

  // editingCategorie: any = null; // Stocke la catégorie en cours d'édition
  // categorieDescription: string = ''; // Variable pour stocker la description

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

  trackByCategorie(index: number, categorie: any): string {
    return categorie._id; // Retourne l'ID unique pour aider Angular à optimiser le rendu
  }


  // startEdit(categorie: any): void {
  //   this.editingCategorie = { ...categorie };
  //   this.categorieDescription = categorie.description; // Charger la description dans l'input
  // }

  // updateCategorie(): void {
  //   if (this.editingCategorie) {
  //     this.editingCategorie.description = this.categorieDescription;
  //     this.categorieService.updateCategorie(this.editingCategorie._id, this.editingCategorie).subscribe(() => {
  //       this.loadCategories();
  //       this.cancelEdit(); // Réinitialiser après l'update
  //     });
  //   }
  // }

  // cancelEdit(): void {
  //   this.editingCategorie = null;
  //   this.categorieDescription = ''; // Réinitialiser l'input
  // }


}
