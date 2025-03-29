import { Component, OnInit } from '@angular/core';
import { VehiculeService } from 'src/app/services/vehicule.service';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-vehicule-list',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './vehicule-list.component.html',
  styleUrl: './vehicule-list.component.scss'
})
export class VehiculeListComponent implements OnInit {

  vehicules: any[] = [];

  displayedColumns: string[] = ['marque', 'modele', 'immatriculation', 'annee', 'actions'];
  newVehicule = { marque: '', modele: '', immatriculation: '', annee: '' };
  editedVehicule: any = null; // Stocke le service en cours d'édition

  constructor(private vehiculeService: VehiculeService) { }
  ngOnInit(): void {
    this.loadVehicules();
  }

  loadVehicules(): void {
    this.vehiculeService.getVehicules().subscribe(data => this.vehicules =
      data);
  }

  deleteVehicule(id: string): void {
    this.vehiculeService.deleteVehicule(id).subscribe(() =>
      this.loadVehicules());
  }

  addVehicule(): void {
    if (this.newVehicule.marque && this.newVehicule.modele && this.newVehicule.immatriculation && this.newVehicule.annee) {
      this.vehiculeService.addVehicule(this.newVehicule).subscribe(() => {
        this.loadVehicules();
        this.newVehicule = { marque: '', modele: '', immatriculation: '', annee: '' };
      });
    }
  }

  editVehicule(service: any): void {
    this.editedVehicule = { ...service }; // Cloner l'objet pour éviter la modification directe
  }

  saveVehicule(): void {
    if (this.editedVehicule) {
      this.vehiculeService.updateVehicule(this.editedVehicule._id, this.editedVehicule).subscribe(updatedVehicule => {
        // Mettre à jour la liste localement après modification
        const index = this.vehicules.findIndex(s => s._id === updatedVehicule._id);
        if (index !== -1) {
          this.vehicules[index] = updatedVehicule;
        }
        this.editedVehicule = null; // Quitter le mode édition
      });
    }
  }

  cancelEdit(): void {
    this.editedVehicule = null; // Annuler l'édition
  }

}


