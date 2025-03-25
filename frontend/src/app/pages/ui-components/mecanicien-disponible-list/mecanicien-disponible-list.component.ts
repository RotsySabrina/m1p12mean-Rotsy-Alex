import { Component, OnInit } from '@angular/core';
import { MecanicienDisponibleService } from 'src/app/services/mecanicien-disponible.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MecanicienService } from 'src/app/services/mecanicien.service';
@Component({
  selector: 'app-mecanicien-disponible-list',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './mecanicien-disponible-list.component.html',
  styleUrl: './mecanicien-disponible-list.component.scss'
})
export class MecanicienDisponibleListComponent implements OnInit {

  meca_dispos: any[] = [];
  mecaniciens: any[] = [];
  newMecaDispo = { id_user: '', date_debut: '', date_fin: '', status: '' };

  constructor(private mecaService: MecanicienDisponibleService, private mecanicienService: MecanicienService) { }

  ngOnInit(): void {
    this.loadMecaDispos();
  }
  loadMecaDispos(): void {
    this.mecaService.getMecaDispos().subscribe(data => this.meca_dispos =
      data);
  }
  deleteArticle(id: string): void {
    this.mecaService.deleteMecaDispo(id).subscribe(() =>
      this.loadMecaDispos());
  }

  getMeca(): void {
    this.mecanicienService.getMecaniciens().subscribe(data => this.mecaniciens = data);
  }

  addMecaDispo(): void {
    if (this.newMecaDispo.id_user && this.newMecaDispo.date_debut && this.newMecaDispo.date_fin && this.newMecaDispo.status !== '') {
      this.mecaService.addMecaDispo(this.newMecaDispo).subscribe(() => {
        this.loadMecaDispos(); // Recharge la liste après ajout
        this.newMecaDispo = { id_user: '', date_debut: '', date_fin: '', status: '' }; // Réinitialise le formulaire
      });
    }
  }


}
