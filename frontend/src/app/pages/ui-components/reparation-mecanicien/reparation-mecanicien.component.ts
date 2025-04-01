import { Component,OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ReparationService } from 'src/app/services/reparation.service';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reparation-mecanicien',
  imports: [MaterialModule, RouterModule, DatePipe],
  templateUrl: './reparation-mecanicien.component.html',
  styleUrl: './reparation-mecanicien.component.scss'
})
export class ReparationMecanicienComponent implements OnInit{
  reparations: any[] = [];
  
  displayedColumns: string[] = ['date', 'client', 'vehicule','status', 'actions'];
  
    constructor(
      private reparationService: ReparationService
    ) {}
  
    ngOnInit(): void {
      this.loadReparations();
    }

    loadReparations(): void {
      console.log("🔄 Chargement des réparations...");
    
      this.reparationService.getReparationsMecaniciens().subscribe(
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
