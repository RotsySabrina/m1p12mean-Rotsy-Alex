import { Component, OnInit } from '@angular/core';
import { VehiculeServiceService } from 'src/app/services/vehicule-service.service';
import { ServiceService } from 'src/app/services/service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-vehicule-service',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './vehicule-service.component.html',
  styleUrl: './vehicule-service.component.scss'
})
export class VehiculeServiceComponent implements OnInit {


  services: any[] = [];
  vehicules: any[] = [];
  displayedColumns: string[] = ['service', 'cout', 'montant_total', 'actions'];

  newDevis = { id_rendez_vous: '', montant_total: '' };
  constructor(private vehiculeService: VehiculeServiceService,
    private serviceService: ServiceService
  ) { }

  ngOnInit(): void {
    this.getServices();
  }

  getServices(): void {
    this.serviceService.getServices().subscribe(data => this.services = data);
  }

  addDevis(): void {
    if (this.newDevis.id_rendez_vous && this.newDevis.montant_total) {
      this.vehiculeService.addDevis(this.newDevis).subscribe(() => {
        // this.loadArticles(); 
        this.newDevis = { id_rendez_vous: '', montant_total: '' };
      });
    }
  }


}
