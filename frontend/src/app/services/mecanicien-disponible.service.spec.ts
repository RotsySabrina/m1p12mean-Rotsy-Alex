import { TestBed } from '@angular/core/testing';

import { MecanicienDisponibleService } from './mecanicien-disponible.service';

describe('MecanicienDisponibleService', () => {
  let service: MecanicienDisponibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MecanicienDisponibleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
