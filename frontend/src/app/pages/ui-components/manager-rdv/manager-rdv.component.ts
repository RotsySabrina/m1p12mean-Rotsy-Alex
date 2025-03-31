import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ManagerRdvService } from 'src/app/services/manager-rdv.service';
import { MecanicienService } from 'src/app/services/mecanicien.service';
import { AlerteService } from '../../../services/alerte.service';  // Ajout du service d'alerte

@Component({
  selector: 'app-manager-rdv',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './manager-rdv.component.html',
  styleUrl: './manager-rdv.component.scss'
})
export class ManagerRdvComponent implements OnInit {
  message: string | null = null;
  isSuccess: boolean = true;
  rendez_vous_client: any[] = [];
  mecaniciens: any[] = [];
  selectedMecanicien: { [key: string]: string } = {};

  displayedColumns: string[] = ['date', 'duree', 'client', 'voiture', 'categorieServices', 'mecanicien', 'actions'];

  constructor(
    private managerRdvService: ManagerRdvService,
    private mecanicienService: MecanicienService,
    private alerteService: AlerteService
  ) {
    this.alerteService.message$.subscribe(msg => {
      this.message = msg;
      this.isSuccess = this.alerteService.getSuccessStatus();

      // Masquer l'alerte après 3 secondes
      setTimeout(() => {
        this.message = null;
      }, 3000);
    });
    220
  }

  ngOnInit(): void {
    this.loadManagerRendezVous();
    this.loadMecaniciens();
  }

  loadManagerRendezVous(): void {
    this.managerRdvService.getUpcomingRendezVous().subscribe(
      data => {
        console.log("Données loadManagerRendezVous :", data);
        this.rendez_vous_client = data.data;
      },
      error => {
        console.error("Erreur lors du chargement des rendez-vous clients :", error);
      }
    );
  }

  loadMecaniciens(): void {
    this.mecanicienService.getMecaniciens().subscribe(
      data => {
        console.log("Données mecanicien :", data);
        this.mecaniciens = data;
      },
      error => {
        console.error("Erreur lors du chargement des mecaniciens :", error);
      }
    )
  }

  updateMecanicien(rdvId: string): void {
    const mecanicienId = this.selectedMecanicien[rdvId];
    if (!mecanicienId) {
      this.alerteService.showMessage("Veuillez sélectionner un mécanicien", false);
      return;
    }

    console.log(`Envoi de la requête pour RDV: ${rdvId} avec Mécanicien: ${mecanicienId}`);

    this.managerRdvService.updateRendezVousMecanicien(rdvId, mecanicienId).subscribe(
      response => {
        console.log("Mécanicien ajouté avec succès :", response);
        this.alerteService.showMessage("Mécanicien assigné avec succès", true);
        this.loadManagerRendezVous(); // Recharge la liste
      },
      error => {
        console.error("Erreur lors de l'ajout du mécanicien :", error);
        this.alerteService.showMessage("Erreur lors de l'assignation du mécanicien", false);
      }
    );
  }
}
