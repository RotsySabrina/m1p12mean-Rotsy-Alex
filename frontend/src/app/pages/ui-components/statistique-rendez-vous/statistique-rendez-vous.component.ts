import { Component, OnInit } from '@angular/core';
import { RendezVousClientService } from 'src/app/services/rendez-vous-client.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-statistique-rendez-vous',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './statistique-rendez-vous.component.html',
  styleUrl: './statistique-rendez-vous.component.scss'
})
export class StatistiqueRendezVousComponent implements OnInit {

  statistiques: any = {}; 
  moisSelectionne: number = new Date().getMonth() + 1; 
  anneeSelectionnee: number = new Date().getFullYear(); 

  constructor(
    private rendez_vous_clientService: RendezVousClientService
  ) { }

  ngOnInit(): void {
    this.loadStatistiques();
  }

  loadStatistiques(): void {
    this.rendez_vous_clientService.getStatistiques(this.moisSelectionne, this.anneeSelectionnee).subscribe(
      data => this.statistiques = data
    );
  }
}
