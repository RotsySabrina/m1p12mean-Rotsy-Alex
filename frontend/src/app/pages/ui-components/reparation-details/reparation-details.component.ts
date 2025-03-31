import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reparation-details',
  imports: [],
  templateUrl: './reparation-details.component.html',
  styleUrl: './reparation-details.component.scss'
})
export class ReparationDetailsComponent implements OnInit{
  idReparation: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.idReparation = this.route.snapshot.paramMap.get('id');
  }
}
