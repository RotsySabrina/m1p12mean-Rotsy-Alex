import { Component, OnInit , ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ManagerRdvService } from 'src/app/services/manager-rdv.service';
import { MecanicienService } from 'src/app/services/mecanicien.service';
import { AlerteService } from '../../../services/alerte.service';  // Ajout du service d'alerte
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginator } from 'src/app/custom-paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-manager-rdv',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './manager-rdv.component.html',
  styleUrls: ['./manager-rdv.component.scss','../facture/facture.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }]
})
export class ManagerRdvComponent implements OnInit {
  message: string | null = null;
  isSuccess: boolean = true;
  rendez_vous_client: any[] = [];
  mecaniciens: any[] = [];
  selectedMecanicien: { [key: string]: string } = {};

  displayedColumns: string[] = ['date', 'duree', 'client', 'voiture', 'categorieServices', 'mecanicien', 'actions'];

  dataSource = new MatTableDataSource<any>([]); 
         
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private managerRdvService: ManagerRdvService,
    private mecanicienService: MecanicienService,
    private alerteService: AlerteService
  ) {
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
    this.loadManagerRendezVous();
    this.loadMecaniciens();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
  
      return (
        (`${data.id_user.nom} ${data.id_user.prenom}`.toLowerCase().includes(transformedFilter)) || // Recherche sur le client
        (data.date_heure ? new Date(data.date_heure).toLocaleDateString('fr-FR').includes(transformedFilter) : false) || // Recherche sur la date
        (data.duree_totale?.toString().includes(transformedFilter)) || // Recherche sur la durée
        (`${data.id_vehicule.marque} ${data.id_vehicule.modele} ${data.id_vehicule.immatriculation} ${data.id_vehicule.annee}`
          .toLowerCase().includes(transformedFilter)) || // Recherche sur le véhicule
        (data.categories.some((categ: { description: string }) => categ.description.toLowerCase().includes(transformedFilter))) || // Recherche sur les catégories
        (data.id_mecanicien?.nom?.toLowerCase().includes(transformedFilter) || 'non assigné'.includes(transformedFilter)) // Recherche sur le mécanicien
      );
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadManagerRendezVous(): void {
    this.managerRdvService.getUpcomingRendezVous().subscribe(
      data => {
        if (data) {
          this.rendez_vous_client = data.data;
          this.dataSource.data = this.rendez_vous_client;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          
          this.dataSource.sort = this.sort;
          console.log("✅ rendez_vous_client_manager chargées avec succès:", this.rendez_vous_client);
        } else {
          console.warn("⚠️ Aucune réparation trouvée dans la réponse.");
        }
      },
      error => {
        console.error("Erreur lors du chargement des rendez-vous clients :", error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadMecaniciens(): void {
    this.mecanicienService.getMecaniciens().subscribe(
      data => {
        console.log("Données mecanicien :", data);
        this.mecaniciens = data;
      },
      error => {
        console.error("Erreur lors du chargement des mecaniciens :", error);
      }
    )
  }

  updateMecanicien(rdvId: string): void {
    const mecanicienId = this.selectedMecanicien[rdvId];
    if (!mecanicienId) {
      this.alerteService.showMessage("Veuillez sélectionner un mécanicien", false);
      return;
    }

    console.log(`Envoi de la requête pour RDV: ${rdvId} avec Mécanicien: ${mecanicienId}`);

    this.managerRdvService.updateRendezVousMecanicien(rdvId, mecanicienId).subscribe(
      response => {
        console.log("Mécanicien ajouté avec succès :", response);
        this.alerteService.showMessage("Mécanicien assigné avec succès", true);
        this.loadManagerRendezVous(); // Recharge la liste
      },
      error => {
        console.error("Erreur lors de l'ajout du mécanicien :", error);
        this.alerteService.showMessage("Erreur lors de l'assignation du mécanicien", false);
      }
    );
  }
}
