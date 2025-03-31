import { Component, OnInit } from '@angular/core';
import { ReparationService } from 'src/app/services/reparation.service';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reparations',
  imports: [MaterialModule, RouterModule],
  templateUrl: './reparations.component.html',
  styleUrl: './reparations.component.scss'
})
export class ReparationsComponent implements OnInit{
  reparations: any[] = [];

  displayedColumns: string[] = ['id', 'mecanicien', 'status', 'actions'];

  constructor(private reparationService: ReparationService) {}

  ngOnInit(): void {
    this.loadReparations();
  }

  loadReparations(): void {
    this.reparationService.getAllReparations().subscribe(data => {
      this.reparations = data;
    });
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
