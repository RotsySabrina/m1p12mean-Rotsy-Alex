import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiqueRendezVousComponent } from './statistique-rendez-vous.component';

describe('StatistiqueRendezVousComponent', () => {
  let component: StatistiqueRendezVousComponent;
  let fixture: ComponentFixture<StatistiqueRendezVousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistiqueRendezVousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiqueRendezVousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
