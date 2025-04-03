import { Component, OnInit, ViewChild} from '@angular/core';
import { FactureService } from 'src/app/services/facture.service';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginator } from 'src/app/custom-paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-facture',
  imports: [MaterialModule, RouterModule, DatePipe, CommonModule],
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }]
})
export class FactureComponent implements OnInit{
  factures: any[] = [];
  
  displayedColumns: string[] = ['date', 'total', 'id_rdv', 'actions'];
    
    dataSource = new MatTableDataSource<any>([]); // Pour gérer les filtres et la pagination

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    
    constructor(
      private factureService: FactureService
    ) {}
  
    ngOnInit(): void {
      this.loadFactures();
    }
    ngAfterViewInit() {
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }    
  
    loadFactures(): void {
      console.log("🔄 Chargement des factures...");
    
      this.factureService.getFacturesByClient().subscribe(
        data => {
          console.log("📩 Données reçues de l'API:", data);
    
          if (data) {
            this.factures = data;
            this.dataSource.data = this.factures; // Mise à jour des données
            
            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });
            
            this.dataSource.sort = this.sort;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
