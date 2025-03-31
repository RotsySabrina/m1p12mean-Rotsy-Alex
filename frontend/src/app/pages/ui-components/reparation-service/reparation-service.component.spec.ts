import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReparationServiceComponent } from './reparation-service.component';

describe('ReparationServiceComponent', () => {
  let component: ReparationServiceComponent;
  let fixture: ComponentFixture<ReparationServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReparationServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReparationServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
