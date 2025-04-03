import { Component , OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MecanicienRdvService } from 'src/app/services/mecanicien-rdv.service';
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginator } from 'src/app/custom-paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-mecanicien-rdv',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './mecanicien-rdv.component.html',
  styleUrls: ['./mecanicien-rdv.component.scss','../facture/facture.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }]
})
export class MecanicienRdvComponent implements OnInit{
  rendez_vous_client: any[] = [];

  displayedColumns: string[] = ['date', 'duree', 'client', 'voiture', 'categorieServices', 'actions'];

  dataSource = new MatTableDataSource<any>([]); 
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private mecanicienService: MecanicienRdvService
  ) { }

  ngOnInit(): void {
    this.loadMecanicienRendezVous();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      filter = filter.trim().toLowerCase(); // Normalisation du texte
  
      // Extraction des valeurs imbriquées sous forme de chaîne de texte
      const dataStr = `
        ${data.date_heure} 
        ${data.duree_totale} 
        ${data.id_user.nom} ${data.id_user.prenom} 
        ${data.id_vehicule.marque} ${data.id_vehicule.modele} ${data.id_vehicule.immatriculation} ${data.id_vehicule.annee} 
        ${data.categories.map((c: any) => c.description).join(' ')}
      `.toLowerCase();
  
      return dataStr.includes(filter);
    };

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadMecanicienRendezVous(): void {
    this.mecanicienService.getUpcomingRendezVous().subscribe(
      data => {
        console.log("Données loadMecanicienRendezVous :", data);
        this.rendez_vous_client = data.data;
        this.dataSource.data = this.rendez_vous_client; // Mettre à jour la dataSource après la récupération des données
      
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      error => {
        console.error("Erreur lors du chargement des rendez-vous clients des mecaniciens :", error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
