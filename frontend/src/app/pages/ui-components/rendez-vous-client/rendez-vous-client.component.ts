import { Component, OnInit } from '@angular/core';
import { RendezVousClientService } from 'src/app/services/rendez-vous-client.service';
import { CategorieServiceService } from 'src/app/services/categorie-service.service';
import { VehiculeService } from 'src/app/services/vehicule.service';
import {CreneauxServiceService} from 'src/app/services/creneaux-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


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
  categorie_services: any[] = [];
  vehicules: any[] = [];
  statistiques: any = {}; // Stocke les statistiques
  moisSelectionne: number = new Date().getMonth() + 1; // Mois actuel
  anneeSelectionnee: number = new Date().getFullYear(); // Année actuelle
  selectedDate!: string;
  creneaux: string[] = [];
  selectedCreneau!: string;
  displayedColumns: string[] = ['vehicule', 'categorieServices', 'date_heure', 'duree' ,'status'];

  newRendezVousClient = {
    id_vehicule: '',
    date_heure: '',
    catServices: [] as string[]
  };

  editedRendezVousClient: any = null;

  constructor(
    private rendez_vous_clientService: RendezVousClientService,
    private categorieService: CategorieServiceService,
    private vehiculeService: VehiculeService,
    private creneauxService: CreneauxServiceService
  ) { }

  ngOnInit(): void {
    this.loadRendezVousClients();
    this.getCategorieServices();
    this.getVehicules();
    this.loadStatistiques();
  }

  loadStatistiques(): void {
    this.rendez_vous_clientService.getStatistiques(this.moisSelectionne, this.anneeSelectionnee).subscribe(
      data => this.statistiques = data
    );
  }

  onDateChange() {
    if (this.selectedDate) {
        // console.log("selectedDate (raw):", this.selectedDate);

        const dateObj = new Date(this.selectedDate);
        // console.log("selectedDate (as Date object):", dateObj);

        const timezoneOffset = dateObj.getTimezoneOffset() * 60000; // Convertir en millisecondes
        const correctedDate = new Date(dateObj.getTime() - timezoneOffset);

        const formattedDate = correctedDate.toISOString().split('T')[0];

        // console.log("formattedDate:", formattedDate);

        this.creneauxService.getCreneauxDisponibles(formattedDate, this.newRendezVousClient.catServices)
            .subscribe(data => {
                this.creneaux = data.creneaux;
            });
    }
  }

  combineDateAndCreneau(selectedCreneau: string) {
    if (this.selectedDate && selectedCreneau) {
      const timeParts = selectedCreneau.split(':'); // "14:00" => ["14", "00"]
      const combinedDate = new Date(this.selectedDate);
  
      combinedDate.setHours(Number(timeParts[0]), Number(timeParts[1]), 0, 0);
  
      // Formatter en "YYYY-MM-DD HH:MM"
      const yyyy = combinedDate.getFullYear();
      const mm = String(combinedDate.getMonth() + 1).padStart(2, '0'); // Mois de 0 à 11
      const dd = String(combinedDate.getDate()).padStart(2, '0');
      const hh = String(combinedDate.getHours()).padStart(2, '0');
      const mi = String(combinedDate.getMinutes()).padStart(2, '0');
  
      // Stocker la date-heure locale sous format "YYYY-MM-DD HH:MM"
      this.newRendezVousClient.date_heure = `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  
      console.log('Date et créneau combinés:', this.newRendezVousClient.date_heure);
    }
  }

  loadRendezVousClients(): void {
    // console.log("Chargement des rendez-vous clients...");
    this.rendez_vous_clientService.getRendezVousClients().subscribe(
      data => {
        console.log("Données reçues :", data);
        this.rendez_vous_client = data.rendezVous;
      },
      error => {
        console.error("Erreur lors du chargement des rendez-vous clients :", error);
      }
    );
  }

  getCategorieServices(): void {
    this.categorieService.getCategories().subscribe(
      data => {
        // console.log("Données categorie_services reçues :", data);
        this.categorie_services = data;
      }
    );
  }

  getVehicules(): void {
    this.vehiculeService.getVehicules().subscribe(
      data => this.vehicules = data
    );
  }


  addRendezVousClient(): void {
    if (this.newRendezVousClient.id_vehicule && this.newRendezVousClient.date_heure && this.newRendezVousClient.catServices.length > 0) {

      this.rendez_vous_clientService.addRendezVousClient(this.newRendezVousClient).subscribe(() => {
        this.loadRendezVousClients();

        this.resetForm();
      });
    }
  }

  // Statut
  getStatus(rendez_vous_client: any): string {
    const now = new Date();
    const rdvDate = new Date(rendez_vous_client.date_heure);

    if (rdvDate > now) {
      return 'A venir';
    } else if (rdvDate < now) {
      return 'Déjà passé';
    } else {
      return 'En cours';  
    }
  }

  get isDateDisabled(): boolean {
    return this.newRendezVousClient.catServices.length === 0;
  }

  tomorrow: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  // Vérifier si la date sélectionnée est dans le futur
  get isDateInvalid(): boolean {
    if (!this.selectedDate) return false;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); 
    return new Date(this.selectedDate) < currentDate;
  }

  resetForm(): void {
    this.newRendezVousClient = {
      id_vehicule: '',
      date_heure: '',
      catServices: []
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

      });
    }
  }
}
