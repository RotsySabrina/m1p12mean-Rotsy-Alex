import { Component, OnInit } from '@angular/core';
import { VehiculeServiceService } from 'src/app/services/vehicule-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicule-service',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './vehicule-service.component.html',
  styleUrl: './vehicule-service.component.scss'
})
export class VehiculeServiceComponent implements OnInit {

  services: any[] = [];
  groupedServices: { [key: string]: any[] } = {};
  idRdvClient: string | null = null;
  vehicules: any[] = [];

  selectedServices: string[] = [];

  rendezVousServices: any[] = [];

  displayedColumns: string[] = ['categorieServices','service', 'cout'];

  constructor(
    private route: ActivatedRoute,
    private vehiculeService: VehiculeServiceService  
  ) { }

  ngOnInit(): void {
    this.idRdvClient = this.route.snapshot.paramMap.get('id')
    console.log("ID du rendez-vous client récupéré :", this.idRdvClient);
    if (this.idRdvClient) {
      this.getServices(this.idRdvClient);
      this.selectRendezVousServices(this.idRdvClient);
    }
  }

  getServices(id_rendez_vous_client: string): void {
    this.vehiculeService.getServicesByCategoryForRdv(id_rendez_vous_client)
      .subscribe(data => {
        console.log("Services reçus :", data);
        this.services = Object.entries(data).flatMap(([category, services]) =>
          (services as any[]).map(service => ({ ...service, category }))
        );
        console.log("Services transformés en tableau :", this.services);
        this.groupServicesByCategory();
      });
  }
  
  groupServicesByCategory(): void {
    this.groupedServices = this.services.reduce((acc, service) => {
      const category = service.category; 
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {});
  
    // console.log("Services groupés par catégorie :", this.groupedServices);
  }

  selectRendezVousServices(id_rendez_vous_client: string): void {
    this.vehiculeService.selectRendezVousServices(id_rendez_vous_client).subscribe(
      data => {
        console.log("Données selectRendezVousServices :", data);
        this.rendezVousServices = data;
      },
      error => {
        console.error("Erreur lors du chargement des services de rendez-vous :", error);
      }
    );
  }

  addServicesToRendezVous() {
    // console.log("📌 Services sélectionnés :", this.selectedServices);
  
    if (!this.idRdvClient || !Array.isArray(this.selectedServices) || this.selectedServices.length === 0) {
      console.warn("⚠ Aucun service sélectionné ou format incorrect !");
      return;
    }
  
    this.vehiculeService.addRendezVousServices(this.idRdvClient, this.selectedServices)
      .subscribe(
        response => {
          console.log("📌 Services ajoutés avec succès :", response);
  
          if (this.idRdvClient) { 
            this.selectRendezVousServices(this.idRdvClient);
          }
  
          setTimeout(() => {
            const totalCost = this.getTotalCost();
  
            // 4️⃣ Création du devis avec le montant total
            if (this.idRdvClient) {
              this.vehiculeService.addDevis(this.idRdvClient, totalCost)
                .subscribe(
                  devisResponse => console.log("📌 Devis créé avec succès :", devisResponse),
                  devisError => console.error("❌ Erreur lors de la création du devis :", devisError)
                );
            }
          }, 500); 
        },
        error => console.error("❌ Erreur lors de l'ajout des services :", error)
      );
  }  

  getTotalCost(): number {
    return this.rendezVousServices.reduce((total, service) => total + (service.serviceCout || 0), 0);
  }  
}
