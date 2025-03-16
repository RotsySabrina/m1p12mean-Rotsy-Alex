import { Component, OnInit } from '@angular/core';
import { MecanicienService } from 'src/app/services/mecanicien.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategorieServiceService } from 'src/app/services/categorie-service.service';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-mecanicien-list',
  standalone: true, // Ajout pour standalone component si besoin
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './mecanicien-list.component.html',
  styleUrls: ['./mecanicien-list.component.scss']
})
export class MecanicienListComponent implements OnInit {

  mecaniciens: any[] = []; // Liste des mécaniciens
  categories: any[] = []; // Liste des catégories de services
  newMecanicien = {
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    specialisations: [] as string[] // Tableau d'ID des catégories sélectionnées
  };

  constructor(
    private mecanicienService: MecanicienService,
    private categorieService: CategorieServiceService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categorieService.getCategories().subscribe(
      data => this.categories = data,
      error => console.error("Erreur lors de la récupération des catégories", error)
    );
  }

  addMecanicien(): void {
    if (this.newMecanicien.specialisations.length > 0) {
      this.mecanicienService.addMecanicien(this.newMecanicien).subscribe(
        () => {
          this.mecaniciens.push(this.newMecanicien); // Ajouter le nouveau mécanicien à la liste affichée
          this.resetForm(); // Réinitialiser le formulaire après ajout
        },
        (error) => {
          console.error("Erreur lors de l'ajout du mécanicien : ", error);
          if (error.error && error.error.message) {
            console.error("Message d'erreur du serveur :", error.error.message);
          }
        }
      );
    } else {
      console.warn("Veuillez sélectionner au moins une spécialisation.");
    }
  }
  
  

  resetForm(): void {
    this.newMecanicien = {
      nom: '',
      prenom: '',
      email: '',
      mot_de_passe: '',
      specialisations: []
    };
  }
}
