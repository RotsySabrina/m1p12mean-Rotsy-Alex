import { Component, OnInit } from '@angular/core';
import { FactureService } from 'src/app/services/facture.service';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-facture',
  imports: [MaterialModule, RouterModule, DatePipe],
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.scss'
})
export class FactureComponent implements OnInit{
  factures: any[] = [];
  
    displayedColumns: string[] = ['date', 'total', 'id_rdv', 'actions'];
  
    constructor(
      private factureService: FactureService
    ) {}
  
    ngOnInit(): void {
      this.loadFactures();
    }
  
    loadFactures(): void {
      console.log("🔄 Chargement des factures...");
    
      this.factureService.getFacturesByClient().subscribe(
        data => {
          console.log("📩 Données reçues de l'API:", data);
    
          if (data) {
            this.factures = data;
            console.log("✅ Factures chargées avec succès:", this.factures);
          } else {
            console.warn("⚠️ Aucune facture trouvée dans la réponse.");
          }
        },
        error => {
          console.error("❌ Erreur lors du chargement des factures:", error);
        }
      );
    }  
}
