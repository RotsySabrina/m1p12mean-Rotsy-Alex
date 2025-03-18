import { Component, OnInit } from '@angular/core';
import { RendezVousClientService } from 'src/app/services/rendez-vous-client.service';
import { ServiceService } from 'src/app/services/service.service';
import { CategorieServiceService } from 'src/app/services/categorie-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { VehiculeService } from 'src/app/services/vehicule.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rendez-vous-client',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './rendez-vous-client.component.html',
  styleUrls: ['./rendez-vous-client.component.scss']
})
export class RendezVousClientComponent implements OnInit {
  rendez_vous_client: any[] = [];
  services: any[] = [];
  vehicules: any[] = [];
  displayedColumns: string[] = ['vehicule', 'services', 'date_heure', 'probleme', 'actions'];
  newRendezVousClient = { id_vehicule: '', date_heure: '', probleme_specifique: '', id_service: [] as string[] };
  editedRendezVousClient: any = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private rendez_vous_clientService: RendezVousClientService,
    private serviceService: ServiceService,
    private categorieService: CategorieServiceService,
    private vehiculeService: VehiculeService
  ) { }

  ngOnInit(): void {
    this.loadRendezVousClients();
    this.getServices();
    this.getVehicules();
  }

  loadRendezVousClients(): void {
    const sub = this.rendez_vous_clientService.getRendezVousClients().subscribe(
      data => this.rendez_vous_client = data,
      error => console.error("Erreur lors de la récupération des rendez-vous clients", error)
    );
    this.subscriptions.push(sub);
  }

  getServices(): void {
    const sub = this.serviceService.getServices().subscribe(
      data => this.services = data,
      error => console.error("Erreur lors de la récupération des services", error)
    );
    this.subscriptions.push(sub);
  }

  getVehicules(): void {
    const sub = this.vehiculeService.getVehicules().subscribe(
      data => this.vehicules = data,
      error => console.error("Erreur lors de la récupération des véhicules", error)
    );
    this.subscriptions.push(sub);
  }

  addRendezVousClient(): void {
    if (this.newRendezVousClient.id_vehicule && this.newRendezVousClient.date_heure
      && this.newRendezVousClient.probleme_specifique && this.newRendezVousClient.id_service.length > 0) {
      const sub = this.rendez_vous_clientService.addRendezVousClient(this.newRendezVousClient).subscribe(
        () => {
          this.loadRendezVousClients();
          this.resetForm();
        },
        error => console.error("Erreur lors de l'ajout du rendez-vous", error)
      );
      this.subscriptions.push(sub);
    } else {
      console.warn("Veuillez remplir tous les champs requis.");
    }
  }

  resetForm(): void {
    this.newRendezVousClient = { id_vehicule: '', date_heure: '', probleme_specifique: '', id_service: [] };
  }

  editRendezVous(rendez_vous_client: any): void {
    this.editedRendezVousClient = { ...rendez_vous_client };
  }

  saveRendezVousClient(): void {
    if (this.editedRendezVousClient) {
      this.rendez_vous_clientService.updateRendezVousClient(this.editedRendezVousClient._id, this.editedRendezVousClient).subscribe(updatedRendezVousClient => {
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
    const sub = this.rendez_vous_clientService.deleteRendezVousClient(id).subscribe(
      () => this.loadRendezVousClients(),
      error => console.error("Erreur lors de la suppression du rendez-vous", error)
    );
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
