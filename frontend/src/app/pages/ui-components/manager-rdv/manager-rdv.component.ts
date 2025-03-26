import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ManagerRdvService } from 'src/app/services/manager-rdv.service';
import { MecanicienService } from 'src/app/services/mecanicien.service';

@Component({
  selector: 'app-manager-rdv',
  standalone: true, 
  imports: [CommonModule, MaterialModule],
  templateUrl: './manager-rdv.component.html',
  styleUrl: './manager-rdv.component.scss'
})
export class ManagerRdvComponent implements OnInit{

  rendez_vous_client: any[] = [];
  mecaniciens: any[] = [];
  selectedMecanicien: { [key: string]: string } = {};

  displayedColumns: string[] = ['client', 'date', 'mecanicien', 'actions'];

  constructor(
    private managerRdvService: ManagerRdvService,
    private mecanicienService: MecanicienService
  ){}

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

  loadMecaniciens(): void{
    this.mecanicienService.getMecaniciens().subscribe(
      data =>{
        console.log("Données mecanicien :", data);
        this.mecaniciens = data;
      },
      error =>{
        console.error("Erreur lors du chargement des mecaniciens :", error);
      }
    )
  }

  updateMecanicien(rdvId: string): void {
    // const mecanicienId = this.selectedMecanicien[rdvId]; // Récupère l'ID du mécanicien sélectionné
    // if (!mecanicienId) return;
  
    // this.managerRdvService.updateRendezVousMecanicien(rdvId, { mecanicienId }).subscribe(
    //   response => {
    //     console.log("Mécanicien ajouté avec succès :", response);
    //     this.loadManagerRendezVous(); // Rafraîchir la liste après mise à jour
    //   },
    //   error => {
    //     console.error("Erreur lors de l'ajout du mécanicien :", error);
    //   }
    // );
  }


}
