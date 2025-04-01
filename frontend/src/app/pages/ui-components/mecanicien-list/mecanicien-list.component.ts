import { Component, OnInit } from '@angular/core';
import { MecanicienService } from 'src/app/services/mecanicien.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategorieServiceService } from 'src/app/services/categorie-service.service';
import { MaterialModule } from 'src/app/material.module';
import { AlerteService } from 'src/app/services/alerte.service';

interface Specialisation {
  categorie_service?: string; // ou un autre type selon ton modèle
}

@Component({
  selector: 'app-mecanicien-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './mecanicien-list.component.html',
  styleUrls: ['./mecanicien-list.component.scss']
})

export class MecanicienListComponent implements OnInit {
  message: string | null = null;
  isSuccess: boolean = true;

  mecaniciens: any[] = [];
  categories: any[] = [];
  displayedColumns: string[] = ['nom', 'prenom', 'email', 'specialisations', 'actions'];
  newMecanicien = { nom: '', prenom: '', email: '', mot_de_passe: '', specialisations: [] as string[] };

  editedMecanicien: any = null; // Stocke le mécanicien en cours d'édition

  constructor(
    private mecanicienService: MecanicienService,
    private categorieService: CategorieServiceService,
    private alerteService: AlerteService
  ) {
    // Écoute les messages d'alerte
    this.alerteService.message$.subscribe(msg => {
      this.message = msg;
      this.isSuccess = this.alerteService.getSuccessStatus();

      // Masquer le message après 3 secondes
      setTimeout(() => {
        this.message = null;
      }, 3000);
    });
  }

  ngOnInit(): void {
    this.loadMecaniciens();
    this.getCategories();
  }

  // loadMecaniciens(): void {
  //   this.mecanicienService.getMecaniciens().subscribe(data => this.mecaniciens = data);
  // }

  loadMecaniciens(): void {
    this.mecanicienService.getMecaniciens().subscribe({
      next: (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.mecaniciens = data.map(mecanicien => {
            // Initialisation de specialisations si non défini
            mecanicien.specialisations = mecanicien.specialisations || []; // Si vide ou non défini

            // Pour chaque spécialisation, vérifier et ajouter une valeur par défaut si nécessaire
            mecanicien.specialisations = mecanicien.specialisations.map((spec: Specialisation) => {
              return {
                ...spec,
                categorie_service: spec.categorie_service || "Non défini"
              };
            });

            return mecanicien;
          });
        } else {
          console.error("Aucun mécanicien trouvé.");
          this.mecaniciens = [];
        }
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des mécaniciens :", err);
      }
    });
  }



  getCategories(): void {
    this.categorieService.getCategories().subscribe(data => this.categories = data);
  }

  addMecanicien(): void {
    if (this.newMecanicien.nom && this.newMecanicien.prenom && this.newMecanicien.email && this.newMecanicien.specialisations.length > 0) {
      this.mecanicienService.addMecanicien(this.newMecanicien).subscribe({
        next: () => {
          this.loadMecaniciens();
          this.newMecanicien = { nom: '', prenom: '', email: '', mot_de_passe: '', specialisations: [] }; // Correction ici
          this.alerteService.showMessage("Mécanicien ajouté avec succès", true);
        },
        error: () => {
          this.alerteService.showMessage("Erreur lors de l'ajout du mécanicien", false);
        }
      });
    } else {
      this.alerteService.showMessage("Veuillez remplir tous les champs obligatoires", false);
    }
  }

  editMecanicien(mecanicien: any): void {
    this.editedMecanicien = { ...mecanicien }; // Cloner l'objet pour éviter la modification directe
  }

  saveMecanicien(): void {
    if (this.editedMecanicien) {
      this.mecanicienService.updateMecanicien(this.editedMecanicien._id, this.editedMecanicien).subscribe({
        next: (updatedMecanicien) => {
          const index = this.mecaniciens.findIndex(m => m._id === updatedMecanicien._id);
          if (index !== -1) {
            this.mecaniciens[index] = updatedMecanicien;
          }
          this.editedMecanicien = null;
          this.alerteService.showMessage("Mécanicien mis à jour avec succès", true);
        },
        error: () => {
          this.alerteService.showMessage("Erreur lors de la mise à jour", false);
        }
      });
    }
  }

  cancelEdit(): void {
    this.editedMecanicien = null;
  }

  deleteMecanicien(id: string): void {
    if (confirm("Voulez-vous vraiment supprimer ce mécanicien ?")) {
      this.mecanicienService.deleteMecanicien(id).subscribe({
        next: () => {
          this.loadMecaniciens();
          this.alerteService.showMessage("Mécanicien supprimé avec succès", true);
        },
        error: () => {
          this.alerteService.showMessage("Erreur lors de la suppression", false);
        }
      });
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
