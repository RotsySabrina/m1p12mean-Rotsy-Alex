import { Component } from '@angular/core';
import { DevisService } from 'src/app/services/devis.service';

@Component({
  selector: 'app-devis',
  imports: [],
  templateUrl: './devis.component.html',
  styleUrl: './devis.component.scss'
})
export class DevisComponent {

  rendezVousServices: any[] = [];
  totalCost: number = 0;

  constructor(
    private devisService: DevisService
  ) { }

  ngOnInit(): void {
    this.loadDevis();
  }

  loadDevis(): void {
    this.devisService.getDevis().subscribe(data => this.rendezVousServices =
      data);
  }
}
