import { TestBed } from '@angular/core/testing';

import { ReparationServiceService } from './reparation-service.service';

describe('ReparationServiceService', () => {
  let service: ReparationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReparationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
