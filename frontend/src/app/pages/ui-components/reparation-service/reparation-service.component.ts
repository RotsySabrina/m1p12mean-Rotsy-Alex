import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ReparationServiceService } from 'src/app/services/reparation-service.service';
import { ReparationService } from 'src/app/services/reparation.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {FactureService} from 'src/app/services/facture.service';

@Component({
  selector: 'app-reparation-service',
  imports: [MaterialModule, FormsModule,],
  templateUrl: './reparation-service.component.html',
  styleUrl: './reparation-service.component.scss'
})
export class ReparationServiceComponent implements OnInit {
  idReparation: string | null = null;
  reparationDetails: any = null;

  displayedColumns: string[] = ['service', 'status', 'observation', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private reparationService: ReparationServiceService,
    private reparation: ReparationService,
    private facture: FactureService
  ) {}

  ngOnInit(): void {
    this.idReparation = this.route.snapshot.paramMap.get('id'); 
    console.log("ID de la réparation récupéré :", this.idReparation);
    if (this.idReparation) {
      this.getDetailReparation(this.idReparation);
    }
  }

  getDetailReparation(id_reparation: string): void {
    this.reparationService.getDetailReparation(id_reparation).subscribe(
      (data) => {
        console.log("Détails de la réparation reçus :", data);
        this.reparationDetails = data.services; 
      },
      (error) => {
        console.error("Erreur lors de la récupération des détails de la réparation :", error);
      }
    );
  }

  updateServiceStatus(idService: string, status: string, observations: string): void {
    this.reparationService.updateServiceStatus(idService, status, observations).subscribe(
      () => {
        console.log("✅ Statut du service mis à jour avec succès !");

        // Vérifier si la réparation est complètement terminée
        if (this.idReparation) {
          this.reparation.mettreAJourStatutReparation(this.idReparation).subscribe(
            (response) => {
              console.log("✅ Statut de la réparation mis à jour !", response);

              if (response.status === "terminee" && response.id_devis) {
                console.log("📄 Génération de la facture...");
                
                this.facture.genereFacture(response.id_devis).subscribe(
                  (facture) => {
                    console.log("✅ Facture générée avec succès :", facture);
                    // alert("Facture générée avec succès !");
                  },
                  (error) => {
                    console.error("❌ Erreur lors de la génération de la facture :", error);
                  }
                );
              }
            },
            (error) => {
              console.error("❌ Erreur mise à jour statut réparation :", error);
            }
          );
        }
      },
      (error) => {
        console.error("❌ Erreur lors de la mise à jour du statut du service :", error);
      }
    );
  }  
  
}