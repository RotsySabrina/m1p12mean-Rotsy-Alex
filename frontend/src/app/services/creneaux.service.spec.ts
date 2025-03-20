import { TestBed } from '@angular/core/testing';

import { CreneauxService } from './creneaux.service';

describe('CreneauxService', () => {
  let service: CreneauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreneauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
