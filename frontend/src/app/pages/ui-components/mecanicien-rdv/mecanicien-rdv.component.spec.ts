import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecanicienRdvComponent } from './mecanicien-rdv.component';

describe('MecanicienRdvComponent', () => {
  let component: MecanicienRdvComponent;
  let fixture: ComponentFixture<MecanicienRdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MecanicienRdvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MecanicienRdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
