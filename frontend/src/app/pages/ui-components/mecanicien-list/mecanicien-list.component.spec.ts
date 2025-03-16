import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecanicienListComponent } from './mecanicien-list.component';

describe('MecanicienListComponent', () => {
  let component: MecanicienListComponent;
  let fixture: ComponentFixture<MecanicienListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MecanicienListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MecanicienListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
