import { Component, OnInit, ViewChild} from '@angular/core';
import { VehiculeService } from 'src/app/services/vehicule.service';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlerteService } from '../../../services/alerte.service';  // Ajout du service d'alerte
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginator } from 'src/app/custom-paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-vehicule-list',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './vehicule-list.component.html',
  styleUrls: ['./vehicule-list.component.scss','../facture/facture.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }]
})
export class VehiculeListComponent implements OnInit {

  message: string | null = null;
  isSuccess: boolean = true;
  vehicules: any[] = [];

  displayedColumns: string[] = ['marque', 'modele', 'immatriculation', 'annee', 'actions'];
  newVehicule = { marque: '', modele: '', immatriculation: '', annee: '' };
  editedVehicule: any = null; // Stocke le service en cours d'édition

  dataSource = new MatTableDataSource<any>([]); 
    
        @ViewChild(MatPaginator) paginator!: MatPaginator;
        @ViewChild(MatSort) sort!: MatSort;

  constructor(private vehiculeService: VehiculeService, private alerteService: AlerteService) {
    this.alerteService.message$.subscribe(msg => {
      this.message = msg;
      this.isSuccess = this.alerteService.getSuccessStatus();

      // Masquer l'alerte après 3 secondes
      setTimeout(() => {
        this.message = null;
      }, 3000);
    });
    220
  }
  ngOnInit(): void {
    this.loadVehicules();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadVehicules(): void {
    this.vehiculeService.getVehicules().subscribe(data => {
      this.vehicules = data;
      this.dataSource.data = this.vehicules; // Mettre à jour la dataSource après la récupération des données
      
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteVehicule(id: string): void {
    if (confirm("Voulez-vous vraiment supprimer ce véhicule ?")) {
      this.vehiculeService.deleteVehicule(id).subscribe({
        next: () => {
          this.loadVehicules();
          this.alerteService.showMessage("Véhicule supprimé avec succès", true);
        },
        error: () => this.alerteService.showMessage("Erreur lors de la suppression du véhicule", false)
      });
    }
  }

  addVehicule(): void {
    if (this.newVehicule.marque && this.newVehicule.modele && this.newVehicule.immatriculation && this.newVehicule.annee) {
      this.vehiculeService.addVehicule(this.newVehicule).subscribe({
        next: () => {
          this.loadVehicules();
          this.newVehicule = { marque: '', modele: '', immatriculation: '', annee: '' };
          this.alerteService.showMessage("Véhicule ajouté avec succès", true);
        },
        error: () => this.alerteService.showMessage("Erreur lors de l'ajout du véhicule", false)
      });
    } else {
      this.alerteService.showMessage("Veuillez remplir tous les champs", false);
    }
  }

  editVehicule(service: any): void {
    this.editedVehicule = { ...service };
  }

  saveVehicule(): void {
    if (this.editedVehicule) {
      this.vehiculeService.updateVehicule(this.editedVehicule._id, this.editedVehicule).subscribe({
        next: (updatedVehicule) => {
          const index = this.vehicules.findIndex(s => s._id === updatedVehicule._id);
          if (index !== -1) {
            this.vehicules[index] = updatedVehicule;
          }
          this.editedVehicule = null;
          this.alerteService.showMessage("Véhicule mis à jour avec succès", true);
        },
        error: () => this.alerteService.showMessage("Erreur lors de la mise à jour du service", false)
      });
    }
  }

  cancelEdit(): void {
    this.editedVehicule = null; // Annuler l'édition
  }

}