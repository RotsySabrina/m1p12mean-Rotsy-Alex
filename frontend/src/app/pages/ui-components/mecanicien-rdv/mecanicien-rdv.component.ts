import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MecanicienRdvService } from 'src/app/services/mecanicien-rdv.service';

@Component({
  selector: 'app-mecanicien-rdv',
  imports: [CommonModule, MaterialModule],
  templateUrl: './mecanicien-rdv.component.html',
  styleUrl: './mecanicien-rdv.component.scss'
})
export class MecanicienRdvComponent {
  rendez_vous_client: any[] = [];

  displayedColumns: string[] = ['date', 'duree', 'client', 'voiture','categorieServices', 'actions'];

  constructor(
      private mecanicienService: MecanicienRdvService
    ){}
  
    ngOnInit(): void {
      this.loadMecanicienRendezVous();
    }

    loadMecanicienRendezVous(): void {
      this.mecanicienService.getUpcomingRendezVous().subscribe(
        data => {
          console.log("Données loadMecanicienRendezVous :", data);
          this.rendez_vous_client = data.data;
        },
        error => {
          console.error("Erreur lors du chargement des rendez-vous clients des mecaniciens :", error);
        }
      );
    }
}
