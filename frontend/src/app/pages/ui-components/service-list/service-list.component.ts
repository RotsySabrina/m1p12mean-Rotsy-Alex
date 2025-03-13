import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../../services/service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategorieServiceService } from '../../../services/categorie-service.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-service-list',
  imports: [
    CommonModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule, 
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.css'
})

export class ServiceListComponent implements OnInit {

  services: any[] = [];
  displayedColumns: string[] = ['categorie', 'description', 'cout', 'actions'];
  constructor(
    private serviceService: ServiceService,
    private categorieService: CategorieServiceService
  ) { }


  categories: any[] = [];

  newService = { description: '', cout: '', id_categorie_service: '' };

  ngOnInit(): void {
    this.loadServices();
    this.getCategories();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe(data => this.services =
      data);
  }

  deleteService(id: string): void {
    this.serviceService.deleteService(id).subscribe(() =>
      this.loadServices());
  }

  getCategories(): void {
    this.categorieService.getCategories().subscribe(data => this.categories =
      data);
  }

  addService(): void {
    if (this.newService.description && this.newService.cout && this.newService.id_categorie_service) {
      this.serviceService.addService(this.newService).subscribe(() => {
        this.loadServices();
        this.newService = { description: '', cout: '', id_categorie_service: '' };
      });
    }
  }

}
