import { Component, OnInit } from '@angular/core';
import { CreneauxService } from 'src/app/services/creneaux.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

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
  creneaux: any[] = [];

  displayColumns: string[] = ['heure ouverture', 'heure fermeture', 'pause début', 'pause fin', 'jours non travailles', 'actions']
  newCreneaux = { heure_ouverture: '', heure_fermeture: '', pause_debut: '', pause_fin: '', jours_non_travailles: '' }
  constructor(private creneauxService: CreneauxService) { }
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
      this.creneauxService.addCreneaux(this.newCreneaux).subscribe(() => {
        this.loadCreneaux();
        this.newCreneaux = { heure_ouverture: '', heure_fermeture: '', pause_debut: '', pause_fin: '', jours_non_travailles: '' };
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
    this.creneauxService.updateCreneaux(this.editedCreneau._id, this.editedCreneau).subscribe(() => {
      this.loadCreneaux();
      this.cancelEdit();
    });
  }

  // deleteCreneau(id: string): void {
  //   if (confirm("Voulez-vous vraiment supprimer ce créneau ?")) {
  //     this.creneauxService.deleteCreneau(id).subscribe(() => {
  //       this.loadCreneaux();
  //     });
  //   }
  // }

}
