import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReparationMecanicienComponent } from './reparation-mecanicien.component';

describe('ReparationMecanicienComponent', () => {
  let component: ReparationMecanicienComponent;
  let fixture: ComponentFixture<ReparationMecanicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReparationMecanicienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReparationMecanicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
