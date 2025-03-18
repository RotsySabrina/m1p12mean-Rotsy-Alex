import { TestBed } from '@angular/core/testing';

import { RendezVousClientService } from './rendez-vous-client.service';

describe('RendezVousClientService', () => {
  let service: RendezVousClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RendezVousClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
