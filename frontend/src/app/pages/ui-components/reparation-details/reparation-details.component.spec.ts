import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReparationDetailsComponent } from './reparation-details.component';

describe('ReparationDetailsComponent', () => {
  let component: ReparationDetailsComponent;
  let fixture: ComponentFixture<ReparationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReparationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReparationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
