import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculeServiceComponent } from './vehicule-service.component';

describe('VehiculeServiceComponent', () => {
  let component: VehiculeServiceComponent;
  let fixture: ComponentFixture<VehiculeServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculeServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
