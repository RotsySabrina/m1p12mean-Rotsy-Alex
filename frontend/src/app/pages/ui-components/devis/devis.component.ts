import { Component,OnInit } from '@angular/core';
import { DevisService } from 'src/app/services/devis.service';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-devis',
  imports: [MaterialModule,CommonModule,RouterModule],
  templateUrl: './devis.component.html',
  styleUrl: './devis.component.scss'
})
export class DevisComponent implements OnInit {

  devis: any[] = [];
  totalCost: number = 0;

  displayedColumns: string[] = ['id','date_devis','vehicule','montant_total', 'status','actions'];

  constructor(
    private devisService: DevisService
  ) { }

  ngOnInit(): void {
    this.loadDevis();
  }

  loadDevis(): void {
    this.devisService.getDevis().subscribe(
      data => {
        console.log('Données reçues :', data); 
        if (Array.isArray(data)) {
          this.devis = data;
        } else {
          console.error('Données non valides :', data);
        }
      },
      error => {
        console.error('Erreur lors du chargement des devis :', error);
      }
    );
  }

  // updateStatus(): void{
  //   this.devisService.updateStatus()
  // }
  
}
