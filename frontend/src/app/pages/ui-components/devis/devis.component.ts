import { Component,OnInit ,ViewChild} from '@angular/core';
import { DevisService } from 'src/app/services/devis.service';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginator } from 'src/app/custom-paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-devis',
  imports: [MaterialModule,CommonModule,RouterModule],
  templateUrl: './devis.component.html',
  // styleUrl: './devis.component.scss'
  styleUrl: '../facture/facture.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }]
})
export class DevisComponent implements OnInit {

  devis: any[] = [];
  totalCost: number = 0;

  displayedColumns: string[] = ['id','date_devis','montant_total', 'status','actions'];
  
  dataSource = new MatTableDataSource<any>([]); 
    
        @ViewChild(MatPaginator) paginator!: MatPaginator;
        @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private devisService: DevisService
  ) { }

  ngOnInit(): void {
    this.loadDevis();
  }

  loadDevis(): void {
    this.devisService.getDevis().subscribe(
      data => {
        console.log('Données devis reçues :', data); 
        if (Array.isArray(data)) {
          this.devis = data;
          this.dataSource.data = this.devis;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          
          this.dataSource.sort = this.sort;
        } else {
          console.error('Données non valides :', data);
        }
      },
      error => {
        console.error('Erreur lors du chargement des devis :', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
