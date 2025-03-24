import { TestBed } from '@angular/core/testing';

import { CreneauxServiceService } from './creneaux-service.service';

describe('CreneauxServiceService', () => {
  let service: CreneauxServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreneauxServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
