import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecanicienDisponibleListComponent } from './mecanicien-disponible-list.component';

describe('MecanicienDisponibleListComponent', () => {
  let component: MecanicienDisponibleListComponent;
  let fixture: ComponentFixture<MecanicienDisponibleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MecanicienDisponibleListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MecanicienDisponibleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
