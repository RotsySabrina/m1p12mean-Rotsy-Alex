import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ReparationServiceService } from 'src/app/services/reparation-service.service';

@Component({
  selector: 'app-reparation-service',
  imports: [MaterialModule],
  templateUrl: './reparation-service.component.html',
  styleUrl: './reparation-service.component.scss'
})
export class ReparationServiceComponent implements OnInit {
  @Input() idReparation!: string;
  services: any[] = [];

  displayedColumns: string[] = ['service', 'status', 'actions'];

  constructor(private reparationServiceService: ReparationServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    // Appeler une API pour récupérer les services liés à cette réparation (à implémenter côté backend)
  }

  updateServiceStatus(idService: string, status: string): void {
    this.reparationServiceService.updateServiceStatus(idService, status, "").subscribe(() => {
      this.loadServices();
    });
  }
}