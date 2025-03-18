import { Component, OnInit } from '@angular/core';
import { MecanicienService } from 'src/app/services/mecanicien.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategorieServiceService } from 'src/app/services/categorie-service.service';
import { MaterialModule } from 'src/app/material.module';

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

  mecaniciens: any[] = [];
  categories: any[] = [];
  displayedColumns: string[] = ['nom', 'prenom', 'email', 'specialisations', 'actions'];
  newMecanicien = { nom: '', prenom: '', email: '', mot_de_passe: '', specialisations: [] as string[] };

  editedMecanicien: any = null; // Stocke le mécanicien en cours d'édition

  constructor(
    private mecanicienService: MecanicienService,
    private categorieService: CategorieServiceService
  ) { }

  ngOnInit(): void {
    this.loadMecaniciens();
    this.getCategories();
  }

  loadMecaniciens(): void {
    this.mecanicienService.getMecaniciens().subscribe(data => this.mecaniciens = data);
  }

  getCategories(): void {
    this.categorieService.getCategories().subscribe(data => this.categories = data);
  }

  addMecanicien(): void {
    if (this.newMecanicien.nom && this.newMecanicien.prenom && this.newMecanicien.email && this.newMecanicien.specialisations.length > 0) {
      this.mecanicienService.addMecanicien(this.newMecanicien).subscribe(() => {
        this.loadMecaniciens();
        this.resetForm();
      });
    }
  }

  editMecanicien(mecanicien: any): void {
    this.editedMecanicien = { ...mecanicien }; // Cloner l'objet pour éviter la modification directe
  }

  saveMecanicien(): void {
    if (this.editedMecanicien) {
      this.mecanicienService.updateMecanicien(this.editedMecanicien._id, this.editedMecanicien).subscribe(updatedMecanicien => {
        const index = this.mecaniciens.findIndex(m => m._id === updatedMecanicien._id);
        if (index !== -1) {
          this.mecaniciens[index] = updatedMecanicien;
        }
        this.editedMecanicien = null;
      });
    }
  }

  cancelEdit(): void {
    this.editedMecanicien = null;
  }

  deleteMecanicien(id: string): void {
    if (confirm("Voulez-vous vraiment supprimer ce mécanicien ?")) {
      this.mecanicienService.deleteMecanicien(id).subscribe(() => this.loadMecaniciens());
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
