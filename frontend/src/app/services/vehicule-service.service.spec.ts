import { TestBed } from '@angular/core/testing';

import { VehiculeServiceService } from './vehicule-service.service';

describe('VehiculeServiceService', () => {
  let service: VehiculeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiculeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
