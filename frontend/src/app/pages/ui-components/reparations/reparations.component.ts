import { Component, OnInit } from '@angular/core';
import { ReparationService } from 'src/app/services/reparation.service';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reparations',
  imports: [MaterialModule, RouterModule, DatePipe],
  templateUrl: './reparations.component.html',
  styleUrl: './reparations.component.scss'
})
export class ReparationsComponent implements OnInit{
  reparations: any[] = [];

  displayedColumns: string[] = ['date', 'mecanicien', 'status', 'actions'];

  constructor(
    private reparationService: ReparationService
  ) {}

  ngOnInit(): void {
    this.loadReparations();
  }

  loadReparations(): void {
    console.log("🔄 Chargement des réparations...");
  
    this.reparationService.getAllReparations().subscribe(
      data => {
        console.log("📩 Données reçues de l'API:", data);
  
        if (data && data.reparations) {
          this.reparations = data.reparations;
          console.log("✅ Réparations chargées avec succès:", this.reparations);
        } else {
          console.warn("⚠️ Aucune réparation trouvée dans la réponse.");
        }
      },
      error => {
        console.error("❌ Erreur lors du chargement des réparations:", error);
      }
    );
  }  

  demarrerReparation(idReparation: string): void {
    this.reparationService.demarrerReparation(idReparation).subscribe(() => {
      this.loadReparations();
    });
  }

  terminerReparation(idReparation: string): void {
    this.reparationService.terminerReparation(idReparation).subscribe(() => {
      this.loadReparations();
    });
  }
}
