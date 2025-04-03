import { Component, OnInit, ViewChild } from '@angular/core';
import { ReparationService } from 'src/app/services/reparation.service';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginator } from 'src/app/custom-paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-reparations',
  imports: [MaterialModule, RouterModule, DatePipe],
  templateUrl: './reparations.component.html',
  // styleUrl: './reparations.component.scss',
  styleUrl: '../facture/facture.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }]
})
export class ReparationsComponent implements OnInit{
  reparations: any[] = [];

  displayedColumns: string[] = ['date', 'mecanicien', 'status', 'actions'];

  dataSource = new MatTableDataSource<any>([]); 
  
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private reparationService: ReparationService
  ) {}

  ngOnInit(): void {
    this.loadReparations();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
  
      return (
        (data.createdAt ? new Date(data.createdAt).toLocaleDateString('fr-FR').includes(transformedFilter) : false) || // Date création
        (data.id_devis?.id_rendez_vous_client?.id_mecanicien?.nom?.toLowerCase().includes(transformedFilter) || false) || // Mécanicien
        (data.status?.toLowerCase().includes(transformedFilter) || false) // Statut
      );
    };
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }  

  loadReparations(): void {
    console.log("🔄 Chargement des réparations...");
  
    this.reparationService.getAllReparations().subscribe(
      data => {
        console.log("📩 Données reçues de l'API:", data);
  
        if (data && data.reparations) {
          this.reparations = data.reparations;
          this.dataSource.data = this.reparations;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          
          this.dataSource.sort = this.sort;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
