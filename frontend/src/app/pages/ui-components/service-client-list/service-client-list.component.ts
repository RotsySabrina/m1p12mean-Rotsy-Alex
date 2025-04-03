import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { DevisService } from 'src/app/services/devis.service';
import { ReparationService } from 'src/app/services/reparation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-service-client-list',
  standalone: true, 
  imports: [CommonModule,MaterialModule],
  templateUrl: './service-client-list.component.html',
  styleUrl: './service-client-list.component.scss'
})
export class ServiceClientListComponent implements OnInit{
  services: any[] = [];
  total :number = 0;
  idDevis: string = '';
  idMecanicien: string = '';
  status: string = '';

  displayedColumns: string[] = ['service', 'cout'];

  constructor(
    private devisService: DevisService,
    private reparationService: ReparationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (history.state.services) {
      this.idDevis = history.state.services._id;
      this.idMecanicien = history.state.services.id_rendez_vous_client?.id_mecanicien || '';

      if (Array.isArray(history.state.services.services)) {
        this.services = history.state.services.services;
      }

      const montant_total = history.state.services.montant_total;
      if (montant_total && montant_total.$numberDecimal) {
        this.total = parseFloat(montant_total.$numberDecimal);
      }
      this.status = history.state.services.status || '';
    } else {
      this.services = [];
      this.total = 0;
      this.status = '';
    }
    // console.log("ID Devis :", this.idDevis);
    console.log("Venant Devis :", history.state.services);
    console.log("ID Mécanicien :", this.idMecanicien);

    // console.log("Services client récupérés :", this.services);
    // console.log("Total montant :", this.total);
    // console.log("Services client récupérés :", this.services);
  }

  updateStatus(status: string) {
    if (!this.idDevis) return;

    this.devisService.updateStatus(this.idDevis, status).subscribe({
      next: (response) => {
        this.snackBar.open("Statut mis à jour avec succès !", "OK", { duration: 3000 });
        if (status === "accepte") {
          this.creerReparation();
        }
      },
      error: (error) => {
        console.error("Erreur mise à jour du statut :", error);
        this.snackBar.open("Erreur lors de la mise à jour du statut.", "OK", { duration: 3000 });
      }
    });
  }

  creerReparation() {
    if (!this.idDevis || !this.idMecanicien) {
      console.error("ID du devis ou ID du mécanicien manquant");
      return;
    }

    this.reparationService.creerReparation(this.idDevis, this.idMecanicien, this.services).subscribe({
      next: (response) => {
        console.log("✅ Réparation créée :", response);
        this.snackBar.open("Réparation créée avec succès !", "OK", { duration: 3000 });
      },
      error: (error) => {
        console.error("❌ Erreur lors de la création de la réparation :", error);
        this.snackBar.open("Erreur lors de la création de la réparation.", "OK", { duration: 3000 });
      }
    });
  }
  
}
