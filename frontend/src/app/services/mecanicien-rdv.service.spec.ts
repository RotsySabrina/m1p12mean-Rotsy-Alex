import { TestBed } from '@angular/core/testing';

import { MecanicienRdvService } from './mecanicien-rdv.service';

describe('MecanicienRdvService', () => {
  let service: MecanicienRdvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MecanicienRdvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
