import { Component, OnInit } from '@angular/core';
import { CreneauxService } from '../../../services/creneaux.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { AlerteService } from 'src/app/services/alerte.service';

@Component({
  selector: 'app-creneaux-list',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule],
  templateUrl: './creneaux-list.component.html',
  styleUrl: './creneaux-list.component.scss'
})
export class CreneauxListComponent implements OnInit {
  message: string | null = null;
  isSuccess: boolean = true;

  creneaux: any[] = [];

  displayColumns: string[] = ['heure_ouverture', 'heure_fermeture', 'pause_debut', 'pause_fin', 'jours_non_travailles', 'actions'];

  newCreneaux = { heure_ouverture: '', heure_fermeture: '', pause_debut: '', pause_fin: '', jours_non_travailles: '' }
  constructor(private creneauxService: CreneauxService,
    private alerteService: AlerteService) {
    this.alerteService.message$.subscribe(msg => {
      this.message = msg;
      this.isSuccess = this.alerteService.getSuccessStatus();
    });
  }

  editedCreneau: any = null;
  ngOnInit(): void {
    this.loadCreneaux();
  }

  loadCreneaux(): void {
    this.creneauxService.getCreneaux().subscribe(data => this.creneaux =
      data);
  }

  addCreneaux(): void {
    if (this.newCreneaux.heure_ouverture && this.newCreneaux.heure_fermeture && this.newCreneaux.pause_debut && this.newCreneaux.pause_fin && this.newCreneaux.jours_non_travailles) {
      this.creneauxService.addCreneaux(this.newCreneaux).subscribe({
        next: () => {
          this.loadCreneaux();
          this.newCreneaux = { heure_ouverture: '', heure_fermeture: '', pause_debut: '', pause_fin: '', jours_non_travailles: '' };
          this.alerteService.showMessage("Créneau ajouté avec succès", true);
        },
        error: () => {
          this.alerteService.showMessage("Erreur lors de l'ajout du créneau", false);
        }
      });
    }
  }

  resetForm(): void {
    this.newCreneaux = { heure_ouverture: '', heure_fermeture: '', pause_debut: '', pause_fin: '', jours_non_travailles: '' };
  }

  editCreneau(creneaux: any): void {
    this.editedCreneau = { ...creneaux }; // Cloner l'objet pour éviter les modifications directes
  }

  cancelEdit(): void {
    this.editedCreneau = null;
  }

  saveCreneau(): void {
    if (this.editedCreneau) {
      this.creneauxService.updateCreneaux(this.editedCreneau._id, this.editedCreneau).subscribe({
        next: () => {
          this.loadCreneaux();
          this.cancelEdit();
          this.alerteService.showMessage("Créneau modifié avec succès", true);
        },
        error: () => {
          this.alerteService.showMessage("Erreur lors de la modification du créneau", false);
        }
      });
    }
  }

  // deleteCreneau(id: string): void {
  //   if (confirm("Voulez-vous vraiment supprimer ce créneau ?")) {
  //     this.creneauxService.deleteCreneau(id).subscribe(() => {
  //       this.loadCreneaux();
  //     });
  //   }
  // }

}
