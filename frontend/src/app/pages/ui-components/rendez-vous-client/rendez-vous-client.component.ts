import { Component, OnInit } from '@angular/core';
import { RendezVousClientService } from 'src/app/services/rendez-vous-client.service';
import { ServiceService } from 'src/app/services/service.service';
import { VehiculeService } from 'src/app/services/vehicule.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-rendez-vous-client',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './rendez-vous-client.component.html',
  styleUrls: ['./rendez-vous-client.component.scss']
})
export class RendezVousClientComponent implements OnInit {

  rendez_vous_client: any[] = [];
  services: any[] = [];
  vehicules: any[] = [];
  statistiques: any = {}; // Stocke les statistiques
  displayedColumns: string[] = ['vehicule', 'services', 'date_heure', 'probleme', 'actions'];
  moisSelectionne: number = new Date().getMonth() + 1; // Mois actuel
  anneeSelectionnee: number = new Date().getFullYear(); // Année actuelle
  newRendezVousClient = {
    id_vehicule: '',
    date_heure: '',
    probleme_specifique: '',
    services: [] as string[]
  };

  editedRendezVousClient: any = null;

  constructor(
    private rendez_vous_clientService: RendezVousClientService,
    private serviceService: ServiceService,
    private vehiculeService: VehiculeService
  ) { }

  ngOnInit(): void {
    this.loadRendezVousClients();
    this.getServices();
    this.getVehicules();
    this.loadStatistiques();
  }

  loadStatistiques(): void {
    this.rendez_vous_clientService.getStatistiques(this.moisSelectionne, this.anneeSelectionnee).subscribe(
      data => this.statistiques = data
    );
  }

  loadRendezVousClients(): void {
    this.rendez_vous_clientService.getRendezVousClients().subscribe(
      data => this.rendez_vous_client = data
    );
  }

  getServices(): void {
    this.serviceService.getServices().subscribe(
      data => this.services = data
    );
  }

  getVehicules(): void {
    this.vehiculeService.getVehicules().subscribe(
      data => this.vehicules = data
    );
  }


  addRendezVousClient(): void {
    if (this.newRendezVousClient.id_vehicule && this.newRendezVousClient.date_heure &&
      this.newRendezVousClient.probleme_specifique && this.newRendezVousClient.services.length > 0) {

      this.rendez_vous_clientService.addRendezVousClient(this.newRendezVousClient).subscribe(() => {
        this.loadRendezVousClients();

        this.resetForm();
      });
    }
  }

  resetForm(): void {
    this.newRendezVousClient = {
      id_vehicule: '',
      date_heure: '',
      probleme_specifique: '',
      services: []
    };
  }

  editRendezVous(rendez_vous_client: any): void {
    this.editedRendezVousClient = { ...rendez_vous_client };
  }

  saveRendezVousClient(): void {
    if (this.editedRendezVousClient) {
      this.rendez_vous_clientService.updateRendezVousClient(this.editedRendezVousClient._id, this.editedRendezVousClient)
        .subscribe(updatedRendezVousClient => {
          const index = this.rendez_vous_client.findIndex(s => s._id === updatedRendezVousClient._id);
          if (index !== -1) {
            this.rendez_vous_client[index] = updatedRendezVousClient;
          }
          this.editedRendezVousClient = null;

        });
    }
  }

  cancelEdit(): void {
    this.editedRendezVousClient = null;
  }

  deleteRendezVous(id: string): void {
    if (confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) {
      this.rendez_vous_clientService.cancelRendezVous(id).subscribe(() => {
        this.loadRendezVousClients();
0
      });
    }
  }
}
