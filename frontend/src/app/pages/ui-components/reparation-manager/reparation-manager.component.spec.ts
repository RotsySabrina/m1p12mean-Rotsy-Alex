import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReparationManagerComponent } from './reparation-manager.component';

describe('ReparationManagerComponent', () => {
  let component: ReparationManagerComponent;
  let fixture: ComponentFixture<ReparationManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReparationManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReparationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
