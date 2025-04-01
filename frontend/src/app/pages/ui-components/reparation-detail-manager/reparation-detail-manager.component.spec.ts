import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReparationDetailManagerComponent } from './reparation-detail-manager.component';

describe('ReparationDetailManagerComponent', () => {
  let component: ReparationDetailManagerComponent;
  let fixture: ComponentFixture<ReparationDetailManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReparationDetailManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReparationDetailManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
