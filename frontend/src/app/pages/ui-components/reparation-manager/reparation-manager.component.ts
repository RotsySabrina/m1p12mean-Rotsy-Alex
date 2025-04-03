import { Component,OnInit ,ViewChild} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ReparationService } from 'src/app/services/reparation.service';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginator } from 'src/app/custom-paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-reparation-manager',
  imports: [MaterialModule, RouterModule, DatePipe, CommonModule],
  templateUrl: './reparation-manager.component.html',
  styleUrls: ['./reparation-manager.component.scss','../facture/facture.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }]
})
export class ReparationManagerComponent implements OnInit{
reparations: any[] = [];
  
  displayedColumns: string[] = ['date', 'client', 'vehicule','mecanicien','status', 'devis','actions'];
  
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
          data.client.nom.toLowerCase().includes(transformedFilter) ||
          data.client.prenom.toLowerCase().includes(transformedFilter) ||
          data.vehicule.marque.toLowerCase().includes(transformedFilter) ||
          data.vehicule.modele.toLowerCase().includes(transformedFilter) ||
          data.vehicule.immatriculation.toLowerCase().includes(transformedFilter) ||
          data.mecanicien.nom.toLowerCase().includes(transformedFilter) || // Ajout du mécanicien
          data.mecanicien.prenom.toLowerCase().includes(transformedFilter) || // Ajout du mécanicien
          data.status.toLowerCase().includes(transformedFilter) ||
          data.createdAt.toLowerCase().includes(transformedFilter) || // Si `createdAt` est une string
          data.montant_total.$numberDecimal.toString().includes(transformedFilter) // Ajout du devis
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
    
      this.reparationService.getReparations().subscribe(
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
}
