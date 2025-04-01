import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ReparationServiceService} from '../../../services/reparation-service.service';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-reparation-detail-manager',
  imports: [MaterialModule],
  templateUrl: './reparation-detail-manager.component.html',
  styleUrl: './reparation-detail-manager.component.scss'
})
export class ReparationDetailManagerComponent {
  idReparation: string | null = null;
    reparationDetails: any = null;
  
    displayedColumns: string[] = ['service', 'status', 'observation'];
  
    constructor(
      private route: ActivatedRoute,
      private reparationService : ReparationServiceService
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
}
