import { TestBed } from '@angular/core/testing';

import { ManagerRdvService } from './manager-rdv.service';

describe('ManagerRdvService', () => {
  let service: ManagerRdvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerRdvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
