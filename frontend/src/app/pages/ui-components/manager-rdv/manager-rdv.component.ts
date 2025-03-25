import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
@Component({
  selector: 'app-manager-rdv',
  standalone: true,  // Ajoute standalone si tu utilises Angular 14+
  imports: [CommonModule, MaterialModule],
  templateUrl: './manager-rdv.component.html',
  styleUrl: './manager-rdv.component.scss'
})
export class ManagerRdvComponent {
  displayedColumns: string[] = ['client', 'date', 'mecanicien', 'actions'];

  // Données statiques provisoires (à remplacer avec un back plus tard)
  dataSource = [
    { client: 'Jean Dupont', date: '25/03/2025', mecanicien: 'Paul Durand' },
    { client: 'Alice Martin', date: '26/03/2025', mecanicien: 'Sophie Bernard' },
    { client: 'Marc Laval', date: '27/03/2025', mecanicien: 'Alex Morel' },
  ];
}
