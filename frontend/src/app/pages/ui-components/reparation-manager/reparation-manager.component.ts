import { Component,OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ReparationService } from 'src/app/services/reparation.service';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reparation-manager',
  imports: [MaterialModule, RouterModule, DatePipe, CommonModule],
  templateUrl: './reparation-manager.component.html',
  styleUrl: './reparation-manager.component.scss'
})
export class ReparationManagerComponent implements OnInit{
reparations: any[] = [];
  
  displayedColumns: string[] = ['date', 'client', 'vehicule','mecanicien','status', 'devis','actions'];
  
    constructor(
      private reparationService: ReparationService
    ) {}
  
    ngOnInit(): void {
      this.loadReparations();
    }

    loadReparations(): void {
      console.log("🔄 Chargement des réparations...");
    
      this.reparationService.getReparations().subscribe(
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
}
